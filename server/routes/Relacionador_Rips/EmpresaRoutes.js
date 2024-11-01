import express from 'express';
import { sql, poolPromise } from '../../db.js';

const router = express.Router();


router.get('/mostrar-empresas-con-resoluciones-vigentes', async (req, res) => {
    try {
        const pool = await poolPromise;

        const query = `
            SELECT
                Emp.[Nombre Comercial Empresa] AS NombreComercialEmpresa,
                Emp.[Documento Empresa] AS DocumentoEmpresa,
                EmpV.[Id EmpresaV] AS IdEmpresaV,
                EmpV.[Prefijo Resolución Facturación EmpresaV] + EmpV.[Resolución Facturación EmpresaV] AS ResolucionFacturacion
            FROM
                Empresa Emp
            INNER JOIN 
                EmpresaV EmpV ON Emp.[Documento Empresa] = EmpV.[Documento Empresa]
        `;

        // Ejecutar la consulta
        const result = await pool.request().query(query);

        // Enviar los datos como respuesta JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/mostrar-resoluciones-vigentes-segun-empresa-seleccionada/:empresa', async (req, res) => {
    const EmpresaSeleccionadaPorElCliente = req.params.empresa;

    if (!EmpresaSeleccionadaPorElCliente) {
        return res.status(400).send('Debe seleccionar una empresa');
    }

    try {
        const pool = await poolPromise; // Obtenemos una conexión de la piscina
        const result = await pool.request()
        .input('EmpresaSeleccionada', sql.NVarChar, EmpresaSeleccionadaPorElCliente) // Declaramos el parámetro

        .query( `
            SELECT 
                EmpV.[Resolución Facturación EmpresaV] AS Resolucion,
                EmpV.[Prefijo Resolución Facturación EmpresaV] + EmpV.[Resolución Facturación EmpresaV] AS ResolucionVigente,
                EmpV.[Prefijo Resolución Facturación EmpresaV] AS PrefijoResolucionVigente
            FROM 
                EmpresaV EmpV
            INNER JOIN
                Empresa Emp ON EmpV.[Documento Empresa] = Emp.[Documento Empresa]
            WHERE
                EmpV.[Id Estado] = 7 AND EmpV.[Documento Empresa] = @EmpresaSeleccionada
        `);

        const listaResolucionesData = result.recordset.map(row => ({
            value: row['Resolucion'],
            text: row['ResolucionVigente']
        }));
        res.json(listaResolucionesData);
    } catch (error) {
        console.error('Error inesperado:', error.message);
        res.status(500).send('Error inesperado');
    }
});


export default router;