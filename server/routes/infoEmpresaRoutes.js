import { Router } from 'express';
import { poolPromise, sql } from '../db.js';
import multer from 'multer';


const router = Router();

router.get('/empresa', async (req, res) => {
    const { docEmpresa } = req.query; // Asegúrate de extraer el parámetro correctamente

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('docEmpresa', sql.VarChar, docEmpresa) // Asegúrate de usar el parámetro en la consulta
            .query(`
                SELECT em.[Nombre Comercial Empresa] as [Nombre Empresa], em.[Documento Empresa],
                em3.[Dirección EmpresaIII] as [Direccion Empresa], em3.[Teléfono No 1 EmpresaIII] as [Telefono Empresa],
                em3.[E-mail 1 EmpresaIII] as [Correo Empresa]
                FROM Empresa as em
                LEFT JOIN EmpresaIII as em3 ON em.[Documento Empresa] = em3.[Documento Empresa]
                WHERE em.[Documento Empresa] = @docEmpresa
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información de la empresa' });
        }

        console.log('Información de la empresa cargada correctamente');
        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de información de la empresa:', err);
        res.status(500).json({ error: 'Error al obtener datos de la empresa', details: err.message });
    }
});

router.get('/seleccionEmpresa', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT [Documento Empresa] as DocumentoEmpresa, [Nombre Comercial Empresa] as NombreComercialEmpresa

                FROM Empresa
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontró información de la empresa' });
        }

        console.log('Informacion de empresa cargada correctamente')
        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de información de la empresa:', err); // Muestra el error completo en el log
        res.status(500).json({ error: 'Error al obtener datos de la empresa', details: err.message });
    }
});

// Configuración de multer para guardar las imágenes en la memoria temporal
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.put('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const pool = await poolPromise;

        // Convertimos el buffer de la imagen a base64
        const imageBase64 = req.file.buffer.toString('base64');
        const docEmpresa = req.body.docEmpresa;

        // Guardamos la cadena base64 en la base de datos
        await pool.request()
            .input('imageData', sql.VarChar(sql.MAX), imageBase64) // Guardar el base64 como texto
            .input('docEmpresa', sql.VarChar(50), docEmpresa)
            .query('UPDATE Empresa SET [Logo Empresa] = @imageData WHERE [Documento Empresa] = @docEmpresa');

        res.json({ message: 'Imagen actualizada exitosamente' });
    } catch (err) {
        console.error('Error al actualizar la imagen', err);
        res.status(500).send('Error al actualizar la imagen');
    }
});

router.get('/get-image/:docEmpresa', async (req, res) => {
    try {
        const pool = await poolPromise;
        const docEmpresa = req.params.docEmpresa;

        // Obtener el base64 de la imagen desde la base de datos
        const result = await pool.request()
            .input('docEmpresa', sql.VarChar(50), docEmpresa)
            .query('SELECT [Logo Empresa] FROM Empresa WHERE [Documento Empresa] = @docEmpresa');

        const imageBase64 = result.recordset[0]['Logo Empresa'];

        if (imageBase64) {
            // Devolver la imagen en formato base64
            res.json({ image: imageBase64 });
        } else {
            res.status(404).send('Imagen no encontrada');
        }
    } catch (err) {
        console.error('Error al recuperar la imagen', err);
        res.status(500).send('Error al recuperar la imagen');
    }
});

export default router;
