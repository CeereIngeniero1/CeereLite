import { Router } from 'express';
import sql from 'mssql';
import { poolPromise } from '../../db.js'; // Asegúrate de que poolPromise esté exportado correctamente

const router = Router();

router.get('/atencion-reciente/:documento', async (req, res) => {
    const { documento } = req.params;

    // Validar el formato del documento
    if (!documento || typeof documento !== 'string') {
        return res.status(400).json({ error: 'Documento inválido' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('documento', sql.VarChar, documento)
            .query(`
                SELECT TOP 1 [Fecha Evaluación Entidad] 
                FROM [Evaluación Entidad] 
                WHERE [Documento Entidad] = @documento 
                ORDER BY [Fecha Evaluación Entidad] DESC
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información de atención reciente' });
        }

        res.json({
            fecha: result.recordset[0]['Fecha Evaluación Entidad']
                ? new Date(result.recordset[0]['Fecha Evaluación Entidad']).toISOString()
                : null,
        });
    } catch (err) {
        console.error('Error al ejecutar la consulta de atención reciente:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de atención reciente' });
    }
});

router.get('/nombre-paciente/:documento', async (req, res) => {
    const { documento } = req.params;

    // Validar el formato del documento
    if (!documento || typeof documento !== 'string') {
        return res.status(400).json({ error: 'Documento inválido' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('documento', sql.VarChar, documento)
            .query(`
                SELECT [Nombre Completo Entidad] AS [Nombre Paciente]
                FROM [Entidad]
                WHERE [Documento Entidad] = @documento
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información del paciente' });
        }

        res.json({
            nombrePaciente: result.recordset[0]['Nombre Paciente']
        });
    } catch (err) {
        console.error('Error al ejecutar la consulta de nombre del paciente:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de nombre del paciente' });
    }
});

router.get('/atencion-primera/:documento', async (req, res) => {
    const { documento } = req.params;

    // Validar el formato del documento
    if (!documento || typeof documento !== 'string') {
        return res.status(400).json({ error: 'Documento inválido' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('documento', sql.VarChar, documento)
            .query(`
                SELECT TOP 1 [Fecha Evaluación Entidad] 
                FROM [Evaluación Entidad] 
                WHERE [Documento Entidad] = @documento 
                ORDER BY [Fecha Evaluación Entidad] ASC
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información de primera atención' });
        }

        res.json({
            fecha: result.recordset[0]['Fecha Evaluación Entidad']
                ? new Date(result.recordset[0]['Fecha Evaluación Entidad']).toISOString()
                : null,
        });
    } catch (err) {
        console.error('Error al ejecutar la consulta de primera atención:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de primera atención' });
    }
});

export default router;
