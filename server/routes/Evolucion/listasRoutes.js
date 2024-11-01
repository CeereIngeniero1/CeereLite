import { Router } from 'express';
import { sql, poolPromise } from '../../db.js'; // Importamos el poolPromise y sql

const router = Router();

// Ruta para obtener la lista de tipos de evaluación
router.get('/evaluacion', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Tipo de Evaluación], [Tipo de Evaluación]
                    FROM [Tipo de Evaluación]
                    WHERE [Id Estado] = 7`);

        const listaEvaluacionData = result.recordset.map(row => ({
            idListaEvaluacion: row['Id Tipo de Evaluación'],
            nombreListaEvaluacion: row['Tipo de Evaluación']
        }));

        res.json(listaEvaluacionData);
    } catch (err) {
        console.error('Error al ejecutar la consulta que trae las listas de los tipos de evaluaciones:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de tipos de evaluaciones' });
    }
});

// Ruta para obtener la lista de ciudades
router.get('/ciudad', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Ciudad], Ciudad FROM Ciudad`);

        const listCiudadData = result.recordset.map(row => ({
            idListaCiudad: row['Id Ciudad'],
            nombreCiudad: row['Ciudad']
        }));

        res.json(listCiudadData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista ciudades:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista ciudades' });
    }
});

// Ruta para obtener la lista de unidades de medida de edad
router.get('/unidad-medida', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Unidad de Medida Edad], [Descripción Unidad de Medida Edad]
                    FROM [Unidad de Medida Edad]`);

        const listaUnidadEdadData = result.recordset.map(row => ({
            idUnidadEdad: row['Id Unidad de Medida Edad'],
            nombreUnidadEdad: row['Descripción Unidad de Medida Edad']
        }));

        res.json(listaUnidadEdadData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista Unidad medida edad:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista Unidad medida edad' });
    }
});

// Ruta para obtener la lista de sexos
router.get('/sexo', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Sexo], [Descripción Sexo] FROM Sexo`);

        const listaSexoData = result.recordset.map(row => ({
            idListaSexo: row['Id Sexo'],
            nombreSexo: row['Descripción Sexo']
        }));

        res.json(listaSexoData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista sexo:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista sexo' });
    }
});

// Ruta para obtener la lista de estados civiles
router.get('/estadoCivil', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Estado Civil], [Estado Civil]
                    FROM [Estado Civil]`);

        const listaEstadoCivilData = result.recordset.map(row => ({
            idEstadoCivil: row['Id Estado Civil'],
            nombreEstadoCivil: row['Estado Civil']
        }));

        res.json(listaEstadoCivilData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista estado civil:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista estado civil' });
    }
});

// Ruta para obtener la lista de ocupaciones
router.get('/ocupacion', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Ocupación], Ocupación
                    FROM Ocupación ORDER BY [Id Ocupación] ASC`);

        const listaOcupacionData = result.recordset.map(row => ({
            idOcupacion: row['Id Ocupación'],
            nombreOcupacion: row['Ocupación']
        }));

        res.json(listaOcupacionData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista ocupacion:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista ocupacion' });
    }
});

// Ruta para obtener la lista de aseguradoras
router.get('/aseguradora', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT en.[Documento Entidad] as [Documento Aseguradora], 
                    en.[Nombre Completo Entidad] as [Nombre Aseguradora], 
                    fe.[Id Función]
                    FROM Entidad as en
                    INNER JOIN [Función Por Entidad] as fe ON en.[Documento Entidad] = fe.[Documento Entidad]
                    WHERE fe.[Id Función] IN (23, 24)`);

        const nombresVistos = new Set();
        const aseguradorasUnico = result.recordset.filter(row => {
            if (!nombresVistos.has(row['Nombre Aseguradora'])) {
                nombresVistos.add(row['Nombre Aseguradora']);
                return true;
            }
            return false;
        });

        const aseguradorasData = aseguradorasUnico.map(row => ({
            documentoAseguradora: row['Documento Aseguradora'],
            nombreAseguradora: row['Nombre Aseguradora']
        }));

        res.json(aseguradorasData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de Aseguradoras:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Aseguradoras' });
    }
});

// Ruta para obtener la lista de tipos de afiliado
router.get('/tipoAfiliado', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Tipo de Afiliado], [Descripción Tipo de Afiliado]
                    FROM [Tipo de Afiliado]`);

        const tipoAfiliadoData = result.recordset.map(row => ({
            idTipoAfiliado: row['Id Tipo de Afiliado'],
            nombreTipoAfiliado: row['Descripción Tipo de Afiliado']
        }));

        res.json(tipoAfiliadoData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista tipo afiliado:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista tipo afiliado' });
    }
});

// Ruta para obtener la lista de parentescos
router.get('/parentesco', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .query(`SELECT [Id Parentesco], [Parentesco]
                    FROM Parentesco ORDER BY [Id Parentesco] ASC`);

        const parentescoData = result.recordset.map(row => ({
            idParentesco: row['Id Parentesco'],
            nombreParentesco: row['Parentesco']
        }));

        res.json(parentescoData);
    } catch (err) {
        console.error('Error al ejecutar la consulta de lista parentesco:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de lista parentesco' });
    }
});

export default router;
