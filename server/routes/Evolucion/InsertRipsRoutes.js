import { Router } from 'express';
import sql from 'mssql';
import { poolPromise } from '../../db.js'; // Asegúrate de que poolPromise esté exportado correctamente

const router = Router();

router.post('/insert-evaluacion', async (req, res) => {
    console.log('Petición recibida');
    console.log('Datos recibidos:', req.body);

    const {
        docEmpresa,
        documentoUsuario,
        listaEvaluacion,
        documentoPaciente,
        edadPaciente,
        nombreAcompanante,
        parentescoAcompanante,
        telefonoAcompanante,
        DiagGeneral,
        DiagEspecifico,
        direccionPaciente,
        ciudadPaciente,
        celularPaciente,
        fechaNacimiento,
        unidadMedida,
        sexoPaciente,
        estadoCivilPaciente,
        ocupacionPaciente,
        aseguradora,
        tipoAfiliado,
        nombreResponsable,
        parentescoResponsable,
        telefonoResponsable,
        firmaPaciente,

        // EVALUACIÓN ENTIDAD RIPS
        tipoRIPS,
        listaTipoRips,
        listaEntidad,
        listaViaIngreso,
        listamodalidadAtencion,
        listaGrupoServicios,
        listaServicios,
        listaFinalidad,
        listaCausaMotivo,
        listaTipoDiag,
        listaCodConsulta,
        listaCodConsulta2,
        listaDiag,
        listaDiag2
    } = req.body;

    console.log(`El tipo de RIPS es: ${tipoRIPS}`);

    if (
        listaEvaluacion === undefined || documentoPaciente === undefined ||
        edadPaciente === undefined || nombreAcompanante === undefined || parentescoAcompanante === undefined ||
        telefonoAcompanante === undefined || DiagGeneral === undefined || DiagEspecifico === undefined ||
        direccionPaciente === undefined || ciudadPaciente === undefined || celularPaciente === undefined ||
        fechaNacimiento === undefined || sexoPaciente === undefined || unidadMedida === undefined || estadoCivilPaciente === undefined ||
        ocupacionPaciente === undefined || aseguradora === undefined || tipoAfiliado === undefined ||
        nombreResponsable === undefined || parentescoResponsable === undefined || telefonoResponsable === undefined
    ) {
        console.error('Error: Faltan datos en la solicitud.');
        return res.status(400).json({ error: 'Faltan datos en la solicitud' });
    }

    let query;
    let insertEvaluacionRipsQuery;

    if (tipoRIPS === 99999) {
        query = `
            DECLARE @newIdTable TABLE (Id INT);
            
            BEGIN TRANSACTION;
            
            INSERT INTO [Evaluación Entidad] 
            ([Id Tipo de Evaluación], [Documento Entidad], 
            [Edad Entidad Evaluación Entidad], [Acompañante Evaluación Entidad], 
            [Id Parentesco], [Teléfono Acompañante], [Diagnóstico General Evaluación Entidad], 
            [Diagnóstico Específico Evaluación Entidad], [Manejo de Medicamentos], [Dirección Domicilio], [Id Ciudad], [Teléfono Domicilio], [Fecha Nacimiento], [Id Unidad de Medida Edad], [Id Sexo], [Id Estado], [Id Estado Civil], [Id Ocupación], [Documento Aseguradora], [Id Tipo de Afiliado], [Responsable Evaluación Entidad], [Id Parentesco Responsable], [Teléfono Responsable], [Documento Usuario], [Documento Empresa], [Documento Profesional], [Id Estado Web], [Con Orden], [Sincronizado], [PreguntarControl])
            OUTPUT INSERTED.[Id Evaluación Entidad] INTO @newIdTable
            VALUES 
            (@listaEvaluacion, @documentoPaciente, @edadPaciente, @nombreAcompanante, 
            @parentescoAcompanante, @telefonoAcompanante, @DiagGeneral, @DiagEspecifico, 'False', @direccionPaciente, 
            @ciudadPaciente, @celularPaciente, @fechaNacimiento, @unidadMedida, @sexoPaciente, 8, @estadoCivilPaciente, 
            @ocupacionPaciente, @aseguradora, @tipoAfiliado, @nombreResponsable, @parentescoResponsable, @telefonoResponsable, @documentoUsuario, @docEmpresa, @documentoUsuario, '1', 'False', 'False', 'False');
            
            COMMIT TRANSACTION;
        `;
    } else {
        insertEvaluacionRipsQuery = tipoRIPS === '1'
            ? `
                INSERT INTO [Evaluación Entidad Rips] 
                ([Id Evaluación Entidad], [Codigo Rips], [Codigo Rips2], [Diagnostico Rips], [Diagnostico Rips2], [Id Tipo de Rips], 
                [Documento Tipo Rips], [Id Finalidad Consulta], [Id Causa Externa], [Id Tipo de Diagnóstico Principal], [Id Acto Quirúrgico], 
                [Id Modalidad Atencion], [Id Grupo Servicios], [Id Servicios])
                SELECT 
                    Id, @listaCodConsulta, @listaCodConsulta2, @listaDiag, @listaDiag2, @listaTipoRips, @listaEntidad, @listaFinalidad, 
                    @listaCausaMotivo, @listaTipoDiag, 1, @listamodalidadAtencion, @listaGrupoServicios, @listaServicios
                FROM @newIdTable;
            `
            : `
                INSERT INTO [Evaluación Entidad Rips] 
                ([Id Evaluación Entidad], [Codigo Rips], [Codigo Rips2], [Diagnostico Rips], [Diagnostico Rips2], [Id Tipo de Rips], 
                [Documento Tipo Rips], [Id Finalidad Consulta], [Id Acto Quirúrgico], [Id Modalidad Atencion], [Id Grupo Servicios], 
                [Id Servicios], [Id Via Ingreso Usuario])
                SELECT 
                    Id, @listaCodConsulta, @listaCodConsulta2, @listaDiag, @listaDiag2, @listaTipoRips, @listaEntidad, @listaFinalidad, 
                    2, @listamodalidadAtencion, @listaGrupoServicios, @listaServicios, @listaViaIngreso
                FROM @newIdTable;
            `;

        query = `
            DECLARE @newIdTable TABLE (Id INT);
            
            BEGIN TRANSACTION;
            
            INSERT INTO [Evaluación Entidad] 
            ([Id Tipo de Evaluación], [Documento Entidad], 
            [Edad Entidad Evaluación Entidad], [Acompañante Evaluación Entidad], 
            [Id Parentesco], [Teléfono Acompañante], [Diagnóstico General Evaluación Entidad], 
            [Diagnóstico Específico Evaluación Entidad], [Manejo de Medicamentos], [Dirección Domicilio], [Id Ciudad], [Teléfono Domicilio], [Fecha Nacimiento], [Id Unidad de Medida Edad], [Id Sexo], [Id Estado], [Id Estado Civil], [Id Ocupación], [Documento Aseguradora], [Id Tipo de Afiliado], [Responsable Evaluación Entidad], [Id Parentesco Responsable], [Teléfono Responsable], [Documento Usuario], [Documento Empresa], [Documento Profesional], [Id Estado Web], [Con Orden], [Firma Evaluación Entidad], [Sincronizado], [PreguntarControl])
            OUTPUT INSERTED.[Id Evaluación Entidad] INTO @newIdTable
            VALUES 
            (@listaEvaluacion, @documentoPaciente, @edadPaciente, @nombreAcompanante, 
            @parentescoAcompanante, @telefonoAcompanante, @DiagGeneral, @DiagEspecifico, 'False', @direccionPaciente, 
            @ciudadPaciente, @celularPaciente, @fechaNacimiento, @unidadMedida, @sexoPaciente, 8, @estadoCivilPaciente, 
            @ocupacionPaciente, @aseguradora, @tipoAfiliado, @nombreResponsable, @parentescoResponsable, @telefonoResponsable, @documentoUsuario, @docEmpresa, @documentoUsuario, '1', 'False', @firmaPaciente, 'False', 'False');

            ${insertEvaluacionRipsQuery}

            COMMIT TRANSACTION;
        `;
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('documentoUsuario', sql.NVarChar, documentoUsuario)
            .input('docEmpresa', sql.NVarChar, docEmpresa)
            .input('listaEvaluacion', sql.Int, listaEvaluacion)
            .input('documentoPaciente', sql.NVarChar, documentoPaciente)
            .input('unidadMedida', sql.Int, unidadMedida)
            .input('edadPaciente', sql.Int, edadPaciente)
            .input('nombreAcompanante', sql.NVarChar, nombreAcompanante)
            .input('parentescoAcompanante', sql.Int, parentescoAcompanante)
            .input('telefonoAcompanante', sql.NVarChar, telefonoAcompanante)
            .input('DiagGeneral', sql.NVarChar, DiagGeneral)
            .input('DiagEspecifico', sql.NVarChar, DiagEspecifico)
            .input('direccionPaciente', sql.NVarChar, direccionPaciente)
            .input('ciudadPaciente', sql.Int, ciudadPaciente)
            .input('celularPaciente', sql.NVarChar, celularPaciente)
            .input('fechaNacimiento', sql.Date, new Date(fechaNacimiento))
            .input('sexoPaciente', sql.Int, sexoPaciente)
            .input('estadoCivilPaciente', sql.Int, estadoCivilPaciente)
            .input('ocupacionPaciente', sql.Int, ocupacionPaciente)
            .input('aseguradora', sql.NVarChar, aseguradora)
            .input('tipoAfiliado', sql.Int, tipoAfiliado)
            .input('nombreResponsable', sql.NVarChar, nombreResponsable)
            .input('parentescoResponsable', sql.Int, parentescoResponsable)
            .input('telefonoResponsable', sql.NVarChar, telefonoResponsable)
            .input('firmaPaciente', sql.NVarChar, firmaPaciente)
            // Solo si `tipoRIPS` tiene un valor específico, añadir parámetros adicionales
            .input('tipoRIPS', sql.Int, tipoRIPS !== 99999 ? tipoRIPS : null)
            .input('listaTipoRips', sql.Int, tipoRIPS !== 99999 ? listaTipoRips : null)
            .input('listaEntidad', sql.NVarChar, tipoRIPS !== 99999 ? listaEntidad : null)
            .input('listaViaIngreso', sql.Int, tipoRIPS !== 99999 ? listaViaIngreso : null)
            .input('listamodalidadAtencion', sql.Int, tipoRIPS !== 99999 ? listamodalidadAtencion : null)
            .input('listaGrupoServicios', sql.Int, tipoRIPS !== 99999 ? listaGrupoServicios : null)
            .input('listaServicios', sql.Int, tipoRIPS !== 99999 ? listaServicios : null)
            .input('listaFinalidad', sql.Int, tipoRIPS !== 99999 ? listaFinalidad : null)
            .input('listaCausaMotivo', sql.Int, tipoRIPS !== 99999 ? listaCausaMotivo : null)
            .input('listaTipoDiag', sql.Int, tipoRIPS !== 99999 ? listaTipoDiag : null)
            .input('listaCodConsulta', sql.NVarChar, tipoRIPS !== 99999 ? listaCodConsulta : null)
            .input('listaCodConsulta2', sql.NVarChar, tipoRIPS !== 99999 ? listaCodConsulta2 : null)
            .input('listaDiag', sql.NVarChar, tipoRIPS !== 99999 ? listaDiag : null)
            .input('listaDiag2', sql.NVarChar, tipoRIPS !== 99999 ? listaDiag2 : null)
            .query(query);

        console.log('Consulta de inserción ejecutada con éxito.');
        return res.status(200).json({ message: 'Historia clínica insertada correctamente' });
    } catch (err) {
        console.error('Error al insertar la historia clínica:', err.message);
        return res.status(500).json({ error: `Error al insertar la historia clínica => ${err.message}` });
    }
});

router.post('/insert-evaluacion/guardarycerrar', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    res.status(200).json('insertar morris');
})

// router.get('/mor', async (req, res) => {
//     console.log('HOLA MORR, LLEGÓ LA PETICIÓN POR EL CAMINO CORRECTO');
// })

router.get('/mor', async (req, res) => {
    console.log('HOLA MORR, LLEGÓ LA PETICIÓN POR EL CAMINO CORRECTO');
    res.status(200).json('¡Petición recibida correctamente!'); // Envía una respuesta al cliente
    // res.json('¡Petición recibida correctamente!'); // Envía una respuesta al cliente
});

export default router;
