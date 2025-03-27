// routes/Api/ApiMinisterio.js
import express from 'express';
import axios from 'axios';

import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

const router = express.Router();

// Ruta para login
router.post('/Auth/LoginSISPRO', async (req, res) => {
    const loginData = {
        // PARA DOCTOR FEDERICO ZAPATA
        // persona: {
        //     identificacion: {
        //         tipo: "CC",
        //         numero: "71709046"
        //     }
        // },
        // clave: "Ceere1026*",
        // nit: "71709046"

        persona: {
            identificacion: {
                tipo: "CC",
                numero: "30319671"
            }
        },
        clave: "Isanico2510",
        nit: "30319671"
    };

    // Imprimir los datos que se enviarán
    console.log("Datos enviados al API:", loginData);

    try {
        // const response = await axios.post('https://localhost:9443/api/Auth/LoginSISPRO', loginData, { httpsAgent: agent });
        const response = await axios.post('https://HPRED241:9443/api/Auth/LoginSISPRO', loginData, { httpsAgent: agent });
        const { token, login } = response.data;
        console.log("Respuesta del API:", response.data);

        if (login) {
            res.status(200).json({ token, message: 'Token generado correctamente' });
        } else {
            res.status(400).json({ message: 'Error al generar token' });
        }
    } catch (error) {
        const errorMessage = error.response?.data || 'Error en la solicitud de login';
        console.log("Error en la solicitud:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});

// Ruta para cargar datos usando el token
router.post('/PaquetesFevRips/CargarFevRips', async (req, res) => {
    const { token, bodyData } = req.body;

    // console.log('el toke es:', token)
    if (!token || !bodyData) {
        return res.status(400).json({ message: 'Token o datos faltantes' });
    }

    console.log('Los datos del JSON son:', JSON.stringify(bodyData, null, 2));

    try {
        const response = await axios.post('https://localhost:9443/api/PaquetesFevRips/CargarFevRips', bodyData, {
            httpsAgent: agent,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            console.log("Respuesta recibida de la API:", response.data);

            res.status(200).json({ message: 'Recibido correctamente' });
        } else {
            res.status(response.status).json({ message: 'Error al enviar', data: response.data });
        }
    } catch (error) {
        // Enviar el error completo al frontend
        const errorMessage = error.response?.data || error.message || 'Error al enviar';
        // console.log("Error al enviar:", errorMessage);

        res.status(500).json({ message: JSON.stringify(errorMessage) }); 
    }
});

export default router;
