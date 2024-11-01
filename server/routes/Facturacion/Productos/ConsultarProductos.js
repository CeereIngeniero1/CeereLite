import express from 'express';
import { sql, poolPromise } from '../../../db.js'; // Asegúrate de tener tu configuración de conexión a la base de datos

const router = express.Router();

// Endpoint para obtener productos
router.get('/productos', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT Objeto.[Id Objeto] as idProducto, Objeto.[Código Objeto] as codigoProducto, Objeto.[Descripción Objeto] as nombreProducto,
        Subcapítulo.Subcapítulo as subcapitulo
        FROM Objeto 
        INNER JOIN Subcapítulo ON Objeto.[Id Subcapítulo] = Subcapítulo.[Id Subcapítulo]
        INNER JOIN Capítulo ON Subcapítulo.[Id Capítulo] = Capítulo.[Id Capítulo]
        WHERE Objeto.[Id Subcapítulo] <> 2
        AND Capítulo.Capítulo = 'Procedimientos Internos'

        ORDER BY Objeto.[Descripción Objeto] ASC
    `);

        res.json(result.recordset); // Enviar los resultados en formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
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

router.get('/tipoTarifa', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .query(`SELECT [Id Tipo Tarifa], [Tipo Tarifa]

                FROM [Tipo Tarifa]
        `);
        // console.log(`Consulta de subcapítulos en DatosFactura.js ejecutada correctamente!`)

        res.json(result.recordset.map(row => ({
            value: row['Id Tipo Tarifa'],
            text: row['Tipo Tarifa']
        })));
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.post('/insertarProductoYTarifa', async (req, res) => {
    const { subcapitulo, nombreProducto, codigoProducto, precioVenta, tipoTarifa, docEmpresa } = req.body;

    console.log('Datos recibidos para insertar:', req.body);

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        await transaction.begin(); // Inicia la transacción

        try {
            // Inserta el producto
            const requestProducto = new sql.Request(transaction);
            await requestProducto
                .input('subcapitulo', sql.Int, subcapitulo)
                .input('nombreProducto', sql.VarChar, nombreProducto)
                .input('codigoProducto', sql.VarChar, codigoProducto)
                .query(`
                    INSERT INTO Objeto ([Id Subcapítulo], [Código Objeto], [Descripción Objeto])
                    VALUES (@subcapitulo, @codigoProducto, @nombreProducto)
                `);

            // Inserta la tarifa asociada al producto
            const requestTarifa = new sql.Request(transaction);
            await requestTarifa
                .input('codigoProducto', sql.VarChar, codigoProducto)
                .input('precioVenta', sql.VarChar, precioVenta)
                .input('tipoTarifa', sql.Int, tipoTarifa)
                .input('docEmpresa', sql.VarChar, docEmpresa)
                .query(`
                    INSERT INTO [Precio de Venta] ([Código Objeto], [Precio de Venta], [Documento Empresa], [Id Iva], [Id Moneda], [Id Tipo Tarifa])
                    VALUES (@codigoProducto, @precioVenta, @docEmpresa, 2, 2, @tipoTarifa)
                `);

            await transaction.commit(); // Confirma la transacción si todo fue bien
            res.status(200).send("Producto y tarifas creados exitosamente");

        } catch (error) {
            await transaction.rollback(); // Si algo falla, deshacer todos los cambios
            console.error('Error dentro de la transacción:', error);
            res.status(500).send("Error al crear el producto y las tarifas");
        }

    } catch (error) {
        console.error('Error al iniciar la transacción:', error);
        res.status(500).send("Error al iniciar la transacción");
    }
});

router.delete('/eliminarProducto', async (req, res) => {
    const { producto } = req.body; // Recibir la producto como un valor único

    console.log('El id producto es: ', req.body)

    // Verificar si 'producto' es un número válido
    if (typeof producto !== 'number' || isNaN(producto)) {
        return res.status(400).json({ message: 'No se proporcionó un producto válido para eliminar' });
    }

    try {
        const pool = await poolPromise;

        // Crear la consulta para eliminar un sola producto
        const query = `
            DELETE FROM Objeto
            WHERE [Id Objeto] = @producto
        `;

        const request = pool.request();
        request.input('producto', sql.Int, producto);

        await request.query(query);
        console.log("producto eliminado correctamente:", producto);
        res.status(200).json({ message: 'producto eliminado correctamente' });
    } catch (error) {
        // Comprobar si el error es debido a que la producto está asociada a un factura
        if (error.originalError && error.originalError.number === 512) {
            return res.status(400).json({
                error: 'No se puede eliminar el producto porque está asociada a una factura o presupuesto.'
            });
        }

        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});




export default router;
