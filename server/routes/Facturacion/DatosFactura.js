import express from 'express';
import { sql, poolPromise } from '../../db.js';

const router = express.Router();

router.get('/resolucion/:empresaSeleccionada', async (req, res) => {
    const empresaSeleccionada = req.params.empresaSeleccionada;

    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .input('empresaSeleccionada', sql.VarChar, empresaSeleccionada)


            .query(`SELECT [Id EmpresaV], [Resolución Facturación EmpresaV]

        FROM EmpresaV 

        WHERE [Documento Empresa] = @empresaSeleccionada
        AND [Id Estado] = 7
        `);
        // console.log(`Consulta resolucion en DatosFactura.js ejecutada correctamente!`)

        res.json(result.recordset.map(row => ({
            value: row['Id EmpresaV'],
            text: row['Resolución Facturación EmpresaV']
        })));
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/prefijoyfactura/:empresaSeleccionada', async (req, res) => {
    const empresaSeleccionada = req.params.empresaSeleccionada;

    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .input('empresaSeleccionada', sql.VarChar, empresaSeleccionada)


            .query(`SELECT em5.[Prefijo Resolución Facturación EmpresaV] as Prefijo, [No Factura]

            FROM Factura as fc

            LEFT JOIN EmpresaV as em5 ON fc.[Id EmpresaV] = em5.[Id EmpresaV]

            WHERE fc.[Documento Empresa] = @empresaSeleccionada
            ORDER BY [Id Factura] DESC
        `);
        // console.log(`Consulta prefijoyfactura en DatosFactura.js ejecutada correctamente!`)

        res.json(result.recordset.map(row => ({
            prefijo: row['Prefijo'],
            consecutivo: row['No Factura']
        })));
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/subcapitulo', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .query(`SELECT [Id Subcapítulo], Subcapítulo

                FROM Subcapítulo

                WHERE [Id Capítulo] = 1
        `);
        // console.log(`Consulta de subcapítulos en DatosFactura.js ejecutada correctamente!`)

        res.json(result.recordset.map(row => ({
            value: row['Id Subcapítulo'],
            text: row['Subcapítulo']
        })));
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/objeto/:idsubcapitulo', async (req, res) => {
    const idsubcapitulo = req.params.idsubcapitulo;


    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .input('idsubcapitulo', sql.Int, idsubcapitulo)
            .query(`SELECT Objeto.[Código Objeto], Objeto.[Descripción Objeto], pv.[Precio de Venta]

                FROM Objeto

                LEFT JOIN [Precio de Venta] as pv ON Objeto.[Código Objeto] = pv.[Código Objeto]
                LEFT JOIN [Tipo Tarifa] as tt ON pv.[Id Tipo Tarifa] = tt.[Id Tipo Tarifa]

                WHERE [Id Subcapítulo] = @idsubcapitulo
                AND tt.[Tipo Tarifa] LIKE '%particular%'
        `);
        // console.log(`Consulta de objetos en DatosFactura.js ejecutada correctamente!`)

        res.json(result.recordset.map(row => ({
            value: row['Código Objeto'],
            text: row['Descripción Objeto'],
            precio: row['Precio de Venta'],
            codigo: row['Código Objeto']

        })));
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

// Ruta para buscar una factura
router.get('/buscarFactura', async (req, res) => {
    const { prefijo, numeroFactura } = req.query;

    console.log('Los datos recibidos son', req.query)

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('prefijo', sql.VarChar, prefijo)
            .input('numeroFactura', sql.VarChar, numeroFactura)
            .query(`
                SELECT em5.[Prefijo Resolución Facturación EmpresaV] as prefijo,
                    fc.[Id Factura],
                    fc.[No Factura], 
                    fc.[Documento Responsable], 
                    fc.[Fecha Factura], 
                    fc.[Fecha Vencimiento Factura],
                    fc.[Observaciones Factura],
                    fc.[SubTotal Factura], 
                    fc.[Total Factura]
                FROM Factura as fc
                INNER JOIN EmpresaV as em5 ON fc.[Id EmpresaV] = em5.[Id EmpresaV]
                WHERE em5.[Prefijo Resolución Facturación EmpresaV] = @prefijo 
                AND fc.[No Factura] = @numeroFactura;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        // Retorna la factura encontrada
        res.json(result.recordset[0]);

    } catch (error) {
        console.error("Error al buscar la factura:", error);
        res.status(500).json({ message: 'Error al buscar la factura' });
    }
});

router.get('/buscarFacturaItems', async (req, res) => {
    try {
        const { idFactura } = req.query;  // Recibe el id de la factura

        const pool = await poolPromise;
        const result = await pool.request()
            .input('idFactura', sql.Int, idFactura)  // Asigna el parámetro idFactura
            .query(`
                SELECT fc2.[Id Factura], fc2.[Código Objeto], Objeto.[Descripción Objeto], fc2.[Cantidad FacturaII], fc2.[Valor FacturaII]
                FROM FacturaII as fc2
                LEFT JOIN Objeto ON fc2.[Código Objeto] = Objeto.[Código Objeto]
                WHERE fc2.[Id Factura] = @idFactura
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener los items de la factura:', error);
        res.status(500).send('Error al obtener los items de la factura');
    }
});

export default router;