import express from 'express';
import { sql, poolPromise } from '../../db.js';


const router = express.Router();

router.get('/pacientes/:fechaInicio/:fechaFin/:documentoEmpresaSeleccionada', async (req, res) => {
    try {
        const { fechaInicio, fechaFin, documentoEmpresaSeleccionada } = req.params;
        const pool = await poolPromise;

        const query = `
            SELECT en.[Nombre Completo Entidad] AS [Nombre Paciente], tp.[Tipo de Documento], eve.[Documento Entidad], eve.[Fecha Evaluación Entidad], fc.[Id Factura], eve.[Id Evaluación Entidad]
            FROM [Evaluación Entidad Rips] AS everips
            INNER JOIN [Evaluación Entidad] AS eve ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            INNER JOIN Entidad AS en ON eve.[Documento Entidad] = en.[Documento Entidad]
            LEFT JOIN Factura as fc ON eve.[Documento Entidad] = fc.[Documento Paciente]
            INNER JOIN [Tipo de Documento] as tp ON en.[Id Tipo de Documento] = tp.[Id Tipo de Documento]
            LEFT JOIN Empresa as em ON eve.[Documento Empresa] = em.[Documento Empresa]
            WHERE CONVERT(DATE, eve.[Fecha Evaluación Entidad], 101) BETWEEN @FechaInicio AND @FechaFin
            AND EXISTS (SELECT 1 FROM [Evaluación Entidad Rips] AS rips WHERE rips.[Id Evaluación Entidad] = eve.[Id Evaluación Entidad])
            AND NOT EXISTS (SELECT 1 FROM [RIPS Unión AC] AS ripsAC WHERE ripsAC.[Id Evaluación Entidad] = eve.[Id Evaluación Entidad])
            AND NOT EXISTS (SELECT 1 FROM [RIPS Unión AP] AS rips WHERE rips.[Id Evaluación Entidad] = eve.[Id Evaluación Entidad])
            AND everips.[Id Factura] IS NULL
            AND em.[Documento Empresa] = @DocumentoEmpresaSeleccionada
            ORDER BY [Nombre Paciente] ASC
        `;

        const result = await pool.request()
            .input('FechaInicio', sql.DateTime, fechaInicio)
            .input('FechaFin', sql.DateTime, fechaFin)
            .input('DocumentoEmpresaSeleccionada', sql.VarChar, documentoEmpresaSeleccionada)
            .query(query);

        const pacientesData = result.recordset;
        const nombresVistos = new Set();
        
        // Filtrar duplicados basados en el nombre
        const pacientesUnicos = pacientesData.filter(paciente => {
            if (!nombresVistos.has(paciente['Nombre Paciente'])) {
                nombresVistos.add(paciente['Nombre Paciente']);
                return true;
            }
            return false;
        });

        // Enviar los datos de pacientes únicos como respuesta JSON
        res.json(pacientesUnicos.map(row => ({
            nombre: row['Nombre Paciente'],
            tipoDocumento: row['Tipo de Documento'],
            documento: row['Documento Entidad'],
            fechaEvaluacion: row['Fecha Evaluación Entidad']
        })));
    } catch (err) {
        console.error('Error al obtener datos de pacientes:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de pacientes' });
    }
});

router.get('/evaluaciones/:documento/:fechaInicio/:fechaFin', async (req, res) => {
    try {
        const { documento, fechaInicio, fechaFin } = req.params;
        const pool = await poolPromise;

        const query = `
            SELECT eve.[Documento Entidad], eve.[Fecha Evaluación Entidad] AS [Fecha Evaluación Entidad], eve.[Id Evaluación Entidad], 
            everips.[Id Evaluación Entidad Rips], everips.[Id Factura], Entidad.[Nombre Completo Entidad] AS [Nombre Usuario]
            FROM [Evaluación Entidad] AS eve 
            INNER JOIN [Evaluación Entidad Rips] AS everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            INNER JOIN Entidad ON eve.[Documento Usuario] = Entidad.[Documento Entidad]
            WHERE eve.[Documento Entidad] = @Documento 
            AND everips.[Id Tipo de Rips] = 2 
            AND everips.[Id Factura] IS NULL 
            AND NOT EXISTS (SELECT 1 FROM [RIPS Unión AP] AS rips WHERE rips.[Id Evaluación Entidad] = eve.[Id Evaluación Entidad]) 
            AND CONVERT(DATE, eve.[Fecha Evaluación Entidad], 101) BETWEEN @FechaInicio AND @FechaFin
        `;

        const result = await pool.request()
            .input('Documento', sql.VarChar, documento)
            .input('FechaInicio', sql.DateTime, fechaInicio)
            .input('FechaFin', sql.DateTime, fechaFin)
            .query(query);

        const evaluacionData = result.recordset;

        // Enviar los datos de evaluaciones como respuesta JSON
        res.json(evaluacionData.map(row => ({
            fechaEvaluacion: row['Fecha Evaluación Entidad'],
            idEvaluacion: row['Id Evaluación Entidad Rips'],
            nombreUsuario: row['Nombre Usuario']
        })));
    } catch (err) {
        console.error('Error al obtener datos de evaluaciones:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de evaluaciones' });
    }
});

router.get('/facturas/:documento', async (req, res) => {
    try {
        const { documento } = req.params;
        const pool = await poolPromise;

        const query = `
            SELECT fc.[Id Factura], fc.[No Factura], fc.[Total Factura], emV.[Prefijo Resolución Facturación EmpresaV] AS [Prefijo], fc.[Fecha Factura],
            Entidad.[Nombre Completo Entidad] AS [Nombre Usuario]
            FROM Factura AS fc 
            INNER JOIN EmpresaV as emV ON fc.[Id EmpresaV] = emV.[Id EmpresaV]
            INNER JOIN Entidad ON fc.[Documento Usuario] = Entidad.[Documento Entidad]
            WHERE fc.[Documento Paciente] = @Documento
            AND NOT EXISTS (SELECT 1 FROM dbo.[Evaluación Entidad Rips] AS ap WHERE fc.[Id Factura] = ap.[Id Factura])
            ORDER BY fc.[Fecha Factura] DESC
        `;

        const result = await pool.request()
            .input('Documento', sql.VarChar, documento)
            .query(query);

        const facturasData = result.recordset;

        // Enviar los datos de facturas como respuesta JSON
        res.json(facturasData.map(row => ({
            noFactura: row['No Factura'],
            idFactura: row['Id Factura'],
            totalFactura: row['Total Factura'],
            prefijo: row['Prefijo'],
            fechaFactura: row['Fecha Factura'],
            nombreUsuario: row['Nombre Usuario']
        })));
    } catch (err) {
        console.error('Error al obtener datos de facturas:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de facturas' });
    }
});

router.post('/relacionar', async (req, res) => {
    try {
        const { evaluacion, factura } = req.body;

        // console.log('Datos recibidos en el servidor:');
        // console.log('Evaluación:', evaluacion);
        // console.log('Factura:', factura);

        const pool = await poolPromise;

        const result = await pool.request()
            .input('IdEvaluacion', sql.Int, evaluacion)
            .input('IdFactura', sql.Int, factura)
            .query('UPDATE [Evaluación Entidad Rips] SET [Id Factura] = @IdFactura WHERE [Id Evaluación Entidad Rips] = @IdEvaluacion');

        console.log('Consulta ejecutada con éxito');
        console.log('Número de filas afectadas:', result.rowsAffected[0]); // Puedes revisar cuántas filas fueron afectadas

        res.json({ success: true, message: 'Datos relacionados correctamente' });
    } catch (err) {
        console.error('Error al ejecutar la actualización:', err.message);
        res.status(500).json({ error: 'Error al relacionar datos' });
    }
});

router.post('/facturaCero/:documentoEmpresaSeleccionada', async (req, res) => {
    try {
        const { evaluacion } = req.body;
        const documentoEmpresaSeleccionada = req.params.documentoEmpresaSeleccionada;

        const pool = await poolPromise;

        // Realizar la consulta para obtener el Id Factura
        const selectQuery = `
            SELECT [Id Factura] 
            FROM Factura 
            WHERE [No Factura] = '0000000' 
            AND [Documento Empresa] = @documentoEmpresaSeleccionada
        `;

        const result = await pool.request()
            .input('documentoEmpresaSeleccionada', sql.VarChar, documentoEmpresaSeleccionada)
            .query(selectQuery);

        const idFactura = result.recordset[0]?.['Id Factura'];

        if (idFactura) {
            console.log('IdFactura devuelto por la consulta:', idFactura);

            // Realizar la actualización en la tabla [Evaluación Entidad Rips]
            const updateQuery = `
                UPDATE [Evaluación Entidad Rips] 
                SET [Id Factura] = @IdFactura 
                WHERE [Id Evaluación Entidad Rips] = @IdEvaluacion
            `;

            await pool.request()
                .input('IdEvaluacion', sql.Int, evaluacion)
                .input('IdFactura', sql.Int, idFactura)
                .query(updateQuery);

            console.log('Actualización ejecutada con éxito');
            res.json({ idFactura });
        } else {
            res.status(500).json({ error: 'No se encontró ninguna factura con [No Factura] = 0000000' });
        }
    } catch (error) {
        console.error('Error inesperado:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


export default router;
