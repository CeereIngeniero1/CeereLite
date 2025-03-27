// Asegúrate de importar express y otros paquetes necesarios
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';



import authRoutes from './routes/loginRoutes.js';
import infoEmpresaRoutes from './routes/infoEmpresaRoutes.js'

//AGENDA
import listasAgendarCompromisosRoutes from './routes/Agenda/listasAgendarCompromisosRoutes.js'

// EVOLUCION
import listasRoutes from './routes/Evolucion/listasRoutes.js';
import loadDataRoutes from './routes/Evolucion/loadDataRoutes.js';
import listasRipsRoutes from './routes/Evolucion/listasRipsRoutes.js';
import InsertRipsRoutes from './routes/Evolucion/InsertRipsRoutes.js';
import loadFechasRoutes from './routes/Evolucion/loadFechasRoutes.js';
import imagesRoutes from './routes/Evolucion/imagesRoutes.js';
import citasRoutes from './routes/Agenda/citasRoutes.js';
import evolucionesRoutes from './routes/Evolucion/evolucionesRoutes.js'
import listasRipsDefecto from './routes/Evolucion/listasRipsDefecto.js'
import EndPointsRipsDefectoRoutes from './routes/Evolucion/EndPointsRipsDefectoRoutes.js'
import CargarFormatos from './routes/Evolucion/Formatos/CargarFormatos.js'


import usuariosRoutes from './routes/usuariosRoutes.js';
import InsertarCompromisoRoutes from './routes/Agenda/InsertarCompromisoRoutes.js'

//ROUTES RELACIONADOR RIPS
import EmpresaRoutes from './routes/Relacionador_Rips/EmpresaRoutes.js'
import infoPacientesRoutes from './routes/Relacionador_Rips/infoPacientesRoutes.js'
import descargarArchivosRIPSRoutes from './routes/Relacionador_Rips/descargarArchivosRIPSRoutes.js'
import descargarXMLSporAPIFacturatechRoutes from './routes/Relacionador_Rips/descargarXMLSporAPIFacturatechRoutes.js'

//ROUTES FACTURACIÓN
import DatosFactura from './routes/Facturacion/DatosFactura.js'
import InsertarFactura from './routes/Facturacion/InsertarFactura.js'
import CargarResoluciones from './routes/Facturacion/Resolucion/CargarResoluciones.js'
import CrearResolucion from './routes/Facturacion/Resolucion/CrearResolucion.js'
import ConsultarProductos from './routes/Facturacion/Productos/ConsultarProductos.js'

// Registro de usuarios
import CargarInformacionParaModalRoutes from './routes/Usuarios/CargarInformacionParaModalRoutes.js';

//API'S
import ApiMinisterio from './routes/Api/ApiMinisterio.js'

// ENVIOMINISTERIO

import ConsultarParaEnvio from './routes/EnvioMinisterio/ConsultarParaEnvio.js'

// RIPS POR DEFECTO
import ListasRIPS from './routes/Evolucion/ListasRIPS/ListasRIPSRoutes.js'


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a `true` si estás usando HTTPS
}));

// Configura Express para servir archivos desde una carpeta externa
// Ajusta la ruta a tu carpeta compartida
app.use('/images', express.static('C:/CeereSio/Foto Entidad'));

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        console.log('Token no proporcionado');
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            console.error('Error al verificar el token:', err.message);
            return res.status(403).json({ error: 'Token inválido' });
        }

        console.log('Token autenticado');
        req.user = user;
        next();
    });
};

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

app.use('/api', authRoutes);
//EVOLUCION
app.use('/api/listas', listasRoutes);
app.use('/api/datos', loadDataRoutes);
app.use('/api/listas/Rips', listasRipsRoutes);
app.use('/api/Rips', listasRipsDefecto);
app.use('/api', InsertRipsRoutes);
app.use('/api', loadFechasRoutes);
app.use('/api', imagesRoutes);
app.use('/api', citasRoutes);
app.use('/api', evolucionesRoutes);
app.use('/api', infoEmpresaRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', listasAgendarCompromisosRoutes);
app.use('/api', CargarInformacionParaModalRoutes);
app.use('/api', InsertarCompromisoRoutes);
app.use('/api/Rips', EndPointsRipsDefectoRoutes);
app.use('/api/evolucion/formatos', CargarFormatos);
//ROUTES REALACIONADOR RIPS
app.use('/api', EmpresaRoutes);
app.use('/api', infoPacientesRoutes);
app.use('/api', descargarArchivosRIPSRoutes);
app.use('/XMLS', descargarXMLSporAPIFacturatechRoutes);
//ROUTES FACTURACION
app.use('/api/facturacion', DatosFactura);
app.use('/api/facturacion', InsertarFactura);
app.use('/api/resolucion', CargarResoluciones);
app.use('/api/resolucion', CrearResolucion);
app.use('/api/productos', ConsultarProductos);
//API'S
app.use('/api', ApiMinisterio);
// ENVIO MINISTERIO
app.use('/api', ConsultarParaEnvio);
// RIPS POR DEFECTO
app.use('/api/Rips/', ListasRIPS);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});