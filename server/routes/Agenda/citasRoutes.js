import { Router } from 'express';
import sql from 'mssql';
import { poolPromise } from '../../db.js';

const router = Router();

router.get('/citas', async (req, res) => {
    const { start, end, docUsuario } = req.query;
    console.log('Received query params - start:', start, 'end:', end); // Debugging log

    // Validación básica de parámetros
    if (!start || !end) {
        return res.status(400).json({ error: 'Faltan parámetros start o end' });
    }

    try {
        // Obtiene la conexión del pool
        const pool = await poolPromise;

        // Realiza la consulta
        const result = await pool.request()
            .input('start', sql.DateTime, new Date(start))
            .input('end', sql.DateTime, new Date(end))
            .input('docUsuario', sql.VarChar, docUsuario)
            .query(`
                SELECT com6.[Id CompromisoVI] as [Id Cita], 
                en.[Nombre Completo Entidad] as [Nombre Paciente], 
                com6.[Entidad Atendida] as [Documento Paciente],
                CONVERT(VARCHAR(10), com6.[Fecha Inicio CompromisoVI], 120) + ' ' +
                FORMAT(com6.[Hora Inicio CompromisoVI], 'HH:mm') AS [Fecha Inicio Cita],
                CONVERT(VARCHAR(10), com6.[Fecha Fin CompromisoVI], 120) + ' ' +
                FORMAT(com6.[Hora Fin CompromisoVI], 'HH:mm') AS [Fecha Fin Cita]
                FROM CompromisoVI as com6
                INNER JOIN Entidad as en ON com6.[Entidad Atendida] = en.[Documento Entidad]
                WHERE com6.[Fecha Inicio CompromisoVI] >= @start AND com6.[Fecha Fin CompromisoVI] <= @end
                AND com6.[Entidad Responsable] = @docUsuario
                
            `);

        console.log(`Consulta de los compromisos ejecutada con éxito. Filas afectadas: ${result.recordset.length}`);
        res.json(result.recordset.map(row => ({
            id: row['Id Cita'],
            title: row['Nombre Paciente'],
            doc: row['Documento Paciente'],
            start: row['Fecha Inicio Cita'],
            end: row['Fecha Fin Cita']
        })));
    } catch (err) {
        console.error('Error al ejecutar la consulta de los compromisos:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de los compromisos' });
    }
});

export default router;
