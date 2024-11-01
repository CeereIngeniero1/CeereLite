import express from 'express';
import { Router } from 'express';

// Crea una instancia del router
const router = Router();

// Ruta absoluta a la carpeta de imágenes
const imagenesPath = 'C:/CeereSio/Foto Entidad';

// Configura el middleware para servir archivos estáticos desde la ruta absoluta
router.use('/imagenes', express.static(imagenesPath));

export default router;
