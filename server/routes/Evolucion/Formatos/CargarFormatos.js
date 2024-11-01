import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { sql, poolPromise } from '../../../db.js';

const router = Router();
// Cambiar el path a la carpeta absoluta
const formatosPath = path.join('C:/CeereSio/Formatos HC');

// Obtener lista de archivos .html
router.get('/formatos', (req, res) => {
    fs.readdir(formatosPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo leer la carpeta' });
        }
        // Filtrar solo archivos .html
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        res.json(htmlFiles);
    });
});

// Obtener contenido de archivo seleccionado
router.get('/formatos/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(formatosPath, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo leer el archivo' });
        }
        res.send(data);
    });
});

router.post('/insertar', async (req, res) => {
    const { diagnosticoGeneral, rutaArchivo, tipoRIPS, selectedTipoRips, selectedCUPS, selectedCUPS2, selectedCIE, selectedCIE2, selectedTipoDiag, selectedEntidad, selectedViaIngreso, selectedModalidad, selectedGrupoServicios, selectedServicio, selectedFinalidad, selectedCausa, docEmpresa, documentoEntidad, nombre, identificacion, direccion, telefono, edad, unidadMedida, sexo, ocupacion, residencia, estadoCivil, aseguradora, tipoAfiliado, parentescoResponsable, fechaNacimiento, nombreAcompanante, telefonoAcompanante, parentescoAcompanante, nombreResponsable, telefonoResponsable, firmaPaciente } = req.body;

    console.log('Los datos a insertar son: ', req.body)

    // Verifica si algunos de los campos están vacíos y asígnales NULL
    const cups2 = selectedCUPS2 === '' ? null : selectedCUPS2;
    const cie2 = selectedCIE2 === '' ? null : selectedCIE2;

    const datosLimpios = {
        nombre: nombre === '' ? null : nombre,
        identificacion: identificacion === '' ? null : identificacion,
        direccion: direccion === '' ? null : direccion,
        telefono: telefono === '' ? null : telefono,
        edad: edad === '' ? null : edad,
        unidadMedida: unidadMedida === '' ? null : unidadMedida,
        sexo: sexo === '' ? null : sexo,
        ocupacion: ocupacion === '' ? null : ocupacion,
        residencia: residencia === '' ? null : residencia,
        estadoCivil: estadoCivil === '' ? null : estadoCivil,
        aseguradora: aseguradora === '' ? null : aseguradora,
        tipoAfiliado: tipoAfiliado === '' ? null : tipoAfiliado,
        parentescoResponsable: parentescoResponsable === '' ? null : parentescoResponsable,
        fechaNacimiento: fechaNacimiento === '' ? null : fechaNacimiento,
        nombreAcompanante: nombreAcompanante === '' ? null : nombreAcompanante,
        telefonoAcompanante: telefonoAcompanante === '' ? null : telefonoAcompanante,
        parentescoAcompanante: parentescoAcompanante === '' ? null : parentescoAcompanante,
        nombreResponsable: nombreResponsable === '' ? null : nombreResponsable,
        telefonoResponsable: telefonoResponsable === '' ? null : telefonoResponsable,
        firmaPaciente: firmaPaciente === '' ? null : firmaPaciente
    };


    if (!diagnosticoGeneral || !rutaArchivo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('diagnosticoGeneral', sql.VarChar, diagnosticoGeneral)
            .input('rutaArchivo', sql.VarChar, rutaArchivo)
            .input('docEmpresa', sql.VarChar, docEmpresa) 
            .input('documentoEntidad', sql.VarChar, documentoEntidad) 
            .input('nombre', sql.VarChar, datosLimpios.nombre) 
            .input('identificacion', sql.VarChar, datosLimpios.identificacion) 
            .input('direccion', sql.VarChar, datosLimpios.direccion) 
            .input('telefono', sql.VarChar, datosLimpios.telefono) 
            .input('edad', sql.Int, datosLimpios.edad) 
            .input('unidadMedida', sql.Int, datosLimpios.unidadMedida) 
            .input('sexo', sql.Int, datosLimpios.sexo) 
            .input('ocupacion', sql.Int, datosLimpios.ocupacion) 
            .input('residencia', sql.Int, datosLimpios.residencia) 
            .input('estadoCivil', sql.Int, datosLimpios.estadoCivil) 
            .input('aseguradora', sql.VarChar, datosLimpios.aseguradora) 
            .input('tipoAfiliado', sql.Int, datosLimpios.tipoAfiliado) 
            .input('parentescoResponsable', sql.Int, datosLimpios.parentescoResponsable) 
            .input('fechaNacimiento', sql.VarChar, datosLimpios.fechaNacimiento) 
            .input('nombreAcompanante', sql.VarChar, datosLimpios.nombreAcompanante) 
            .input('telefonoAcompanante', sql.VarChar, datosLimpios.telefonoAcompanante) 
            .input('parentescoAcompanante', sql.Int, datosLimpios.parentescoAcompanante) 
            .input('nombreResponsable', sql.VarChar, datosLimpios.nombreResponsable) 
            .input('telefonoResponsable', sql.VarChar, datosLimpios.telefonoResponsable) 
            .input('firmaPaciente', sql.VarChar, datosLimpios.firmaPaciente) 
            .query(`
                DECLARE @newIdTable TABLE (Id INT);

                INSERT INTO [Evaluación Entidad] 
                (
                    [Id Tipo de Evaluación], [Documento Entidad], [Edad Entidad Evaluación Entidad], [Acompañante Evaluación Entidad], 
                    [Id Parentesco], [Teléfono Acompañante], [Diagnóstico General Evaluación Entidad], [Diagnóstico Específico Evaluación Entidad], 
                    [Manejo de Medicamentos], [Dirección Domicilio], [Id Ciudad], [Teléfono Domicilio], [Fecha Nacimiento], [Id Unidad de Medida Edad], 
                    [Id Sexo], [Id Estado], [Id Estado Civil], [Id Ocupación], [Documento Aseguradora], [Id Tipo de Afiliado], 
                    [Responsable Evaluación Entidad], [Id Parentesco Responsable], [Teléfono Responsable], [Documento Usuario],
                    [Documento Empresa], [Documento Profesional], [Id Estado Web], [Con Orden], [Firma Evaluación Entidad], [Sincronizado], [PreguntarControl]
                )
                OUTPUT INSERTED.[Id Evaluación Entidad] INTO @newIdTable
                VALUES 
                (4, @identificacion, @edad, @nombreAcompanante, @parentescoAcompanante, @telefonoAcompanante, @rutaArchivo, @diagnosticoGeneral, 'False', @direccion, @residencia, @telefono, @fechaNacimiento, @unidadMedida, @sexo, 7, @estadoCivil, @ocupacion, @aseguradora, @tipoAfiliado, @nombreResponsable, @parentescoResponsable, @telefonoResponsable, @documentoEntidad, @docEmpresa, @documentoEntidad, 1, 'False', @firmaPaciente, 'False', 'False');

                SELECT Id FROM @newIdTable;
            `);

        const insertedId = result.recordset[0].Id;

        // Inserción en Evaluación Entidad Rips usando el Id insertado
        await pool.request()
            .input('IdEvaluacionEntidad', sql.Int, insertedId)
            .input('CodigoRips', sql.VarChar, selectedCUPS)
            .input('CodigoRips2', sql.VarChar, cups2)
            .input('DiagnosticoRips', sql.VarChar, selectedCIE)
            .input('DiagnosticoRips2', sql.VarChar, cie2)
            .input('IdTipoRips', sql.Int, selectedTipoRips)
            .input('DocumentoTipoRips', sql.VarChar, selectedEntidad)
            .input('IdFinalidadConsulta', sql.Int, selectedFinalidad)
            .input('IdCausaExterna', sql.Int, selectedCausa)
            .input('IdTipoDiagPrincipal', sql.Int, selectedTipoDiag)
            .input('IdActoQuirurgico', sql.Int, tipoRIPS)
            .input('IdModalidadAtencion', sql.Int, selectedModalidad)
            .input('IdGrupoServicios', sql.Int, selectedGrupoServicios)
            .input('IdServicios', sql.Int, selectedServicio)
            .input('IdViaIngreso', sql.Int, selectedViaIngreso)
            .query(`
                INSERT INTO [Evaluación Entidad Rips] 
                ([Id Evaluación Entidad], [Codigo Rips], [Codigo Rips2], [Diagnostico Rips], [Diagnostico Rips2], [Id Tipo de Rips], 
                [Documento Tipo Rips], [Id Finalidad Consulta], [Id Causa Externa], [Id Tipo de Diagnóstico Principal], [Id Acto Quirúrgico], 
                [Id Modalidad Atencion], [Id Grupo Servicios], [Id Servicios], [Id Via Ingreso Usuario])


                VALUES (@IdEvaluacionEntidad, @CodigoRips, @CodigoRips2, @DiagnosticoRips, @DiagnosticoRips2, @IdTipoRips, @DocumentoTipoRips, 
                @IdFinalidadConsulta, @IdCausaExterna, @IdTipoDiagPrincipal, @IdActoQuirurgico, @IdModalidadAtencion, @IdGrupoServicios, @IdServicios, @IdViaIngreso);
            `);

        res.json({ success: true, message: 'Insertado correctamente', insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }


});

router.get('/formato-archivo', (req, res) => {
    const filePath = decodeURIComponent(req.query.path);  // Decodificar la ruta que viene en el query param

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error al leer el archivo' });
            } else {
                res.send(data); // Devolver el contenido del archivo HTML
            }
        });
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

export default router;
