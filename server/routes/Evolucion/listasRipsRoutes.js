import { Router } from 'express';
import sql from 'mssql';
import { poolPromise } from '../../db.js'; // Asegúrate de importar 'poolPromise'

const router = Router();

router.get('/tipoRips', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones
        const result = await pool.request()
            .query(`SELECT [Id Tipo Rips], [Tipo Rips], [Código Tipo Rips] 
                    FROM [Tipo Rips] 
                    WHERE [Tipo Rips] IS NOT NULL AND [Id Estado] = 7`);

        console.log(`La consulta de Tipo Rips fue ejecutada correctamente`)
        res.json(result.recordset.map(row => ({
            idTipoRips: row['Id Tipo Rips'],
            descripcionTipoRips: row['Tipo Rips'],
            codigoTipoRips: row['Código Tipo Rips']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Tipo de RIPS:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Tipo de Usuario' });
    }
});

router.get('/tipoEntidad/:codigoTipoRips', async (req, res) => {
    const codigoTipoRips = req.params.codigoTipoRips;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('codigoTipoRips', sql.VarChar, codigoTipoRips)
            .query(`SELECT en.[Documento Entidad], en.[Nombre Completo Entidad]
                    FROM [Función Por Entidad] as fe
                    INNER JOIN Entidad as en ON fe.[Documento Entidad] = en.[Documento Entidad]
                    INNER JOIN Función as f ON fe.[Id Función] = f.[Id Función]
                    WHERE f.[Id Función] = @codigoTipoRips
                    ORDER BY en.[Nombre Completo Entidad] ASC
                
                    `);
        res.json(result.recordset.map(row => ({
            idEntidad: row['Documento Entidad'],
            descripcionEntidad: row['Nombre Completo Entidad']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Tipo de Entidad:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Tipo de Entidad' });
    }
});

router.get('/modalidadAtencion', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Modalidad Atencion], [Nombre Modalidad Atencion] 
                    FROM [RIPS Modalidad Atención] 
                    WHERE [Id Estado] = 7`);

        console.log('Consulta de Via Modalidad Atención correctamente')

        res.json(result.recordset.map(row => ({
            codigoModalidad: row['Id Modalidad Atencion'],
            nombreModalidad: row['Nombre Modalidad Atencion']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Modalidad Atención:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Modalidad Atención' });
    }
});

router.get('/grupoServicios', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Grupo Servicios], [Nombre Grupo Servicios] 
                    FROM [RIPS Grupo Servicios] 
                    WHERE [Id Estado] = 7`);
        res.json(result.recordset.map(row => ({
            codigoServicios: row['Id Grupo Servicios'],
            nombreServicios: row['Nombre Grupo Servicios']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Grupo Servicios:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Grupo Servicios' });
    }
});

router.get('/Servicios', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Servicios], [Nombre Servicios] 
                    FROM [RIPS Servicios] 
                    WHERE [Id Estado] = 7`);
        res.json(result.recordset.map(row => ({
            codigoServicios: row['Id Servicios'],
            nombreServicios: row['Nombre Servicios']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Servicios:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Servicios' });
    }
});

router.get('/finalidadConsulta/:tipo', async (req, res) => {
    const tipoConsulta = req.params.tipo;

    if (tipoConsulta !== 'Consulta' && tipoConsulta !== 'del Procedimiento') {
        return res.status(400).json({ error: 'Tipo de consulta inválido' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Finalidad ${tipoConsulta}], [Finalidad ${tipoConsulta}], [Descripción Finalidad ${tipoConsulta}] 
                    FROM [Finalidad ${tipoConsulta}] 
                    WHERE ([Id Finalidad ${tipoConsulta}] <> 1) AND ([Id Estado] = 7)`);
        res.json(result.recordset.map(row => ({
            codigoFinalidad: row[`Id Finalidad ${tipoConsulta}`],
            nombreFinalidad: row[`Descripción Finalidad ${tipoConsulta}`]
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Finalidad Consulta:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Finalidad Consulta' });
    }
});

router.get('/causaExterna', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Causa Externa], [Causa Externa], [Descripción Causa Externa] 
                    FROM [Causa Externa] 
                    WHERE ([Id Causa Externa] <> 1) AND ([Id Estado] = 7)`);
        res.json(result.recordset.map(row => ({
            codigoCausa: row['Id Causa Externa'],
            nombreCausa: row['Descripción Causa Externa']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Causa Externa:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Causa Externa' });
    }
});

router.get('/tipoDiagnostico', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Tipo de Diagnóstico Principal], [Descripción Tipo de Diagnóstico Principal] 
                    FROM [Tipo de Diagnóstico Principal]  
                    WHERE [Id Estado] = 7 AND [Código Tipo de Diagnóstico Principal] IS NOT NULL`);
        res.json(result.recordset.map(row => ({
            codigoObjeto: row['Id Tipo de Diagnóstico Principal'],
            descripcionObjeto: row['Descripción Tipo de Diagnóstico Principal']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Tipo Diagnóstico Principal:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Tipo Diagnóstico Principal' });
    }
});

router.get('/codConsulta', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Código Objeto], [Descripción Objeto]
                    FROM Objeto
                    WHERE [Id Subcapítulo] = 2 AND [Id Estado] = 7`);
        res.json(result.recordset.map(row => ({
            codigoObjeto: row['Código Objeto'],
            descripcionObjeto: row['Descripción Objeto']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de codConsulta:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de codConsulta' });
    }
});

router.get('/codDiag', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Código Objeto], [Descripción Objeto]
                    FROM Objeto
                    WHERE [Id Subcapítulo] = 3 AND [Id Estado] = 7`);
        res.json(result.recordset.map(row => ({
            codigoObjeto: row['Código Objeto'],
            descripcionObjeto: row['Descripción Objeto']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de codDiag:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de codDiag' });
    }
});

router.get('/viaIngresoUsuario', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Id Via Ingreso Usuario], [Nombre Via Ingreso Usuario] 
                    FROM [RIPS Via Ingreso Usuario] 
                    WHERE [Id Estado] = 7`);
        console.log('Consulta de Via Ingreso ejecutada correctamente')
        res.json(result.recordset.map(row => ({
            codigoObjeto: row['Id Via Ingreso Usuario'],
            descripcionObjeto: row['Nombre Via Ingreso Usuario']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de Via Ingreso Usuario:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Via Ingreso Usuario' });
    }
});

router.get('/ripsPorDefecto', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT [Tipo de Rips] AS tipoRips, Entidad, [Modalidad Atencion] as ModalidadAtencion, [Grupo Servicio] as GrupoServicio,
            [Finalidad Consulta] as finalidadConsulta, [Finalidad Procedimiento] as finalidadProcedimiento, Servicio, [Causa Externa] as CausaExterna, 
            [Tipo Diag Principal] as TipoDiag, [Via Ingreso] as ViaIngreso, CUPS, CIE 

            FROM [Rips Por Defecto]`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


export default router;
