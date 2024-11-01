import { Router } from 'express';
import { poolPromise, sql } from '../../../db.js';

const router = Router();


router.post('/insertarResolucion', async (req, res) => {

    const { docEmpresa, resolucion, fechaInicio, fechaFin, prefijo, noInicio, noFin } = req.body;

    console.log('datos a insertar en resolucion son', req.body);

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('docEmpresa', sql.VarChar, docEmpresa)
            .input('resolucion', sql.VarChar, resolucion)
            .input('fechaInicio', sql.DateTime, fechaInicio)
            .input('fechaFin', sql.DateTime, fechaFin)
            .input('prefijo', sql.NVarChar, prefijo)
            .input('noInicio', sql.Int, noInicio)
            .input('noFin', sql.Int, noFin)
            .query(`
                INSERT INTO EmpresaV ([Documento Empresa], [Resolución Facturación EmpresaV], [Fecha Resolución Facturación EmpresaV], [Fecha Final Resolucion Facturacion Empresa], [Prefijo Resolución Facturación EmpresaV], [Nro Inicio Resolución Facturación EmpresaV], [Nro Fin Resolución Facturación EmpresaV], [Id Estado])

                VALUES (@docEmpresa, @resolucion, @fechaInicio, @fechaFin, @prefijo, @noInicio, @noFin, 7)
            `);

        res.status(200).send("Compromiso agendado exitosamente");
    } catch (error) {
        console.error('Error al insertar la resolución:', error);
        res.status(500).send("Error al insertar la resolución");
    }
});


export default router;