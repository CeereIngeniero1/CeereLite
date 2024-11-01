import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { sql, poolPromise } from '../db.js'; // Importamos el poolPromise y sql

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query(`
                SELECT [Nombre de Usuario], Contraseña, en.[Documento Entidad], 
                en.[Nombre Completo Entidad] as [Nombre Usuario], [Id Nivel] 
                FROM Contraseña
                INNER JOIN Entidad as en ON Contraseña.[Documento Entidad] = en.[Documento Entidad] 
                WHERE [Nombre de Usuario] = @username AND Contraseña = @password
            `);

        if (result.recordset.length === 0) {
            console.log('Credenciales incorrectas');
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = result.recordset[0];
        const token = jwt.sign(
            { username: user['Nombre de Usuario'], documentoEntidad: user['Documento Entidad'] },
            'secretKey',
            { expiresIn: '10h' }
        );
        console.log('Token generado:', token); // Mensaje de consola con el token generado

        const userLevel = user['Id Nivel'];
        if (![1, 2, 3].includes(userLevel)) {
            return res.status(403).json({ error: 'Nivel de usuario no reconocido' });
        }

        req.session.user = {
            username: user['Nombre de Usuario'],
            userLevel,
            documentoEntidad: user['Documento Entidad'],
            nombreUsuario: user['Nombre Usuario']
        };

        res.json({
            token,
            userLevel,
            documentoEntidad: user['Documento Entidad'],
            nombreUsuario: user['Nombre Usuario']
        });
    } catch (err) {
        console.error('Error en la autenticación:', err.message);
        res.status(500).json({ error: 'Error en la autenticación' });
    }
});

export default router;
