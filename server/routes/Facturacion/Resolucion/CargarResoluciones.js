import { Router } from 'express';
import { poolPromise, sql } from '../../../db.js';

const router = Router();

router.get('/infoResoluciones', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                    SELECT em5.[Id EmpresaV] as IdEmpresaV, em.[Nombre Comercial Empresa] as NombreEmpresa, em5.[Resolución Facturación EmpresaV] as resolucion, 
                    em5.[Prefijo Resolución Facturación EmpresaV] as prefijo, em5.[Fecha Resolución Facturación EmpresaV] as fechaInicio,
                    [Fecha Final Resolucion Facturacion Empresa] as fechaFinal, em5.[Nro Inicio Resolución Facturación EmpresaV] as NoInicio,
                    em5.[Nro Fin Resolución Facturación EmpresaV] as NoFin, Estado.Estado as estado

                    FROM EmpresaV as em5

                    LEFT JOIN Empresa as em ON em5.[Documento Empresa] = em.[Documento Empresa]
                    LEFT JOIN Estado ON em5.[Id Estado] = Estado.[Id Estado]

                    ORDER BY Estado.Estado ASC, em5.[Fecha Resolución Facturación EmpresaV] DESC;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información de resoluciones' });
        }

        console.log('Informacion de resoluciones cargada correctamente')
        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de información de resoluciones:', err);
        res.status(500).json({ error: 'Error al obtener datos de resoluciones', details: err.message });
    }
});

router.delete('/eliminarResoluciones', async (req, res) => {
    const { resoluciones } = req.body;

    // Verificar si 'resoluciones' es un array y tiene al menos un valor
    if (!Array.isArray(resoluciones) || resoluciones.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron resoluciones válidas para eliminar' });
    }

    try {
        const pool = await poolPromise;

        // Crear la consulta dinámica usando parámetros nombrados (@param)
        const query = `
            DELETE FROM EmpresaV
            WHERE [Id EmpresaV] IN (${resoluciones.map((_, index) => `@resolucion${index}`).join(', ')})
        `;

        const request = pool.request();

        // Añadir las resoluciones como parámetros de tipo Integer
        resoluciones.forEach((resolucion, index) => {
            console.log(`Resolución #${index + 1}:`, resolucion); // Verificar el tipo de dato
            request.input(`resolucion${index}`, sql.Int, resolucion); // Usar sql.Int para asegurarse de que sean enteros
        });

        await request.query(query);
        console.log("Resoluciones eliminadas correctamente:", resoluciones);
        res.status(200).json({ message: 'Resoluciones eliminadas correctamente' });
    } catch (error) {
        // Comprobar si el error es debido a que la resolución está asociada a una factura
        if (error.originalError && error.originalError.number === 512) {
            return res.status(400).json({
                error: 'No se puede eliminar la resolución porque está asociada a una factura.'
            });
        }

        console.error('Error al eliminar resoluciones:', error);
        res.status(500).json({ error: 'Error al eliminar resoluciones' });
    }
});

router.delete('/eliminarResolucion', async (req, res) => {
    const { resolucion } = req.body; // Recibir la resolución como un valor único

    // Verificar si 'resolucion' es un número válido
    if (typeof resolucion !== 'number' || isNaN(resolucion)) {
        return res.status(400).json({ message: 'No se proporcionó una resolución válida para eliminar' });
    }

    try {
        const pool = await poolPromise;

        // Crear la consulta para eliminar una sola resolución
        const query = `
            DELETE FROM EmpresaV
            WHERE [Id EmpresaV] = @resolucion
        `;

        const request = pool.request();
        request.input('resolucion', sql.Int, resolucion); // Usar sql.Int para asegurarse de que sea un entero

        await request.query(query);
        console.log("Resolución eliminada correctamente:", resolucion);
        res.status(200).json({ message: 'Resolución eliminada correctamente' });
    } catch (error) {
        // Comprobar si el error es debido a que la resolución está asociada a una factura
        if (error.originalError && error.originalError.number === 512) {
            return res.status(400).json({
                error: 'No se puede eliminar la resolución porque está asociada a una factura.'
            });
        }

        console.error('Error al eliminar la resolución:', error);
        res.status(500).json({ error: 'Error al eliminar la resolución' });
    }
});

router.put('/actualizarEstado', async (req, res) => {
    const { resolucion } = req.body; // Recibir la resolución como un valor único

    // Verificar si 'resolucion' es un número válido
    if (typeof resolucion !== 'number' || isNaN(resolucion)) {
        return res.status(400).json({ message: 'No se proporcionó una resolución válida para eliminar' });
    }

    try {
        const pool = await poolPromise;

        // Crear la consulta para eliminar una sola resolución
        const query = `
            UPDATE EmpresaV SET [Id Estado] = 8
            WHERE [Id EmpresaV] = @resolucion
        `;

        const request = pool.request();
        request.input('resolucion', sql.Int, resolucion); // Usar sql.Int para asegurarse de que sea un entero

        await request.query(query);
        console.log("Resolución eliminada correctamente:", resolucion);
        res.status(200).json({ message: 'Resolución eliminada correctamente' });
    } catch (error) {
        // Comprobar si el error es debido a que la resolución está asociada a una factura
        if (error.originalError && error.originalError.number === 512) {
            return res.status(400).json({
                error: 'No se puede eliminar la resolución porque está asociada a una factura.'
            });
        }

        console.error('Error al eliminar la resolución:', error);
        res.status(500).json({ error: 'Error al eliminar la resolución' });
    }
});


export default router;