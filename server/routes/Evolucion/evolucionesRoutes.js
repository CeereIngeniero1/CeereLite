import { Router } from 'express';
import { poolPromise, sql } from '../../db.js'; 

const router = Router();

router.get('/evoluciones/:documentoEntidad', async (req, res) => {
    const { documentoEntidad } = req.params;   

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DocumentoEntidad', sql.VarChar, documentoEntidad) // Agrega los parámetros
            .query(`SELECT eve.[Id Evaluación Entidad], 
                    en.[Primer Nombre Entidad] + ' ' + en.[Primer Apellido Entidad] as [Nombre Paciente], 
                    eve.[Fecha Evaluación Entidad]
                    FROM [Evaluación Entidad] as eve
                    INNER JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
                    WHERE eve.[Id Tipo de Evaluación] = 1 AND eve.[Documento Entidad] = @DocumentoEntidad
                    ORDER BY eve.[Fecha Evaluación Entidad] DESC`);

        const evolucionesPacienteData = result.recordset.map(row => ({
            idEvolucion: row['Id Evaluación Entidad'],
            pacienteEvolucion: row['Nombre Paciente'],
            fechaEvolucion: row['Fecha Evaluación Entidad'].toISOString().split('T')[0]
        }));

        res.json(evolucionesPacienteData);

    } catch (err) {
        console.error('Error al ejecutar la consulta de las evaluaciones del paciente:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de las evaluaciones del paciente' });
    }
});

router.get('/formulas/:documentoEntidad', async (req, res) => {
    const { documentoEntidad } = req.params;
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DocumentoEntidad', sql.VarChar, documentoEntidad)
            .query(`SELECT eve.[Id Evaluación Entidad], 
                    en.[Primer Nombre Entidad] + ' ' + en.[Primer Apellido Entidad] as [Nombre Paciente], 
                    eve.[Fecha Evaluación Entidad]
                    FROM [Evaluación Entidad] as eve
                    INNER JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
                    WHERE eve.[Id Tipo de Evaluación] = 2 AND eve.[Documento Entidad] = @DocumentoEntidad
                    ORDER BY eve.[Fecha Evaluación Entidad] DESC`);

        const formulasPacienteData = result.recordset.map(row => ({
            idEvolucion: row['Id Evaluación Entidad'],
            pacienteEvolucion: row['Nombre Paciente'],
            fechaEvolucion: row['Fecha Evaluación Entidad'].toISOString().split('T')[0]
        }));

        res.json(formulasPacienteData);

    } catch (err) {
        console.error('Error al ejecutar la consulta de las evaluaciones del paciente:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de las evaluaciones del paciente' });
    }
});

router.get('/evolucion/:idEvaluacion', async (req, res) => {
    const { idEvaluacion } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idEvaluacion', sql.Int, idEvaluacion)
            .query(`
            SELECT eve.[Id Evaluación Entidad], tpe.[Tipo de Evaluación], eve.[Id Tipo de Evaluación], enpro.[Nombre Completo Entidad] as [Nombre Profesional],
            [Fecha Evaluación Entidad], en.[Nombre Completo Entidad] as [Nombre Paciente], 
            eve.[Documento Entidad] as [Documento Paciente], eve.[Dirección Domicilio], eve.[Id Ciudad], Ciudad.Ciudad,
            eve.[Teléfono Domicilio], eve.[Fecha Nacimiento], eve.[Edad Entidad Evaluación Entidad] as [Edad Paciente],
            eve.[Id Unidad de Medida Edad], ume.[Descripción Unidad de Medida Edad] as [Unidad Medida], eve.[Id Sexo], Sexo.[Descripción Sexo],
            eve.[Id Estado Civil], ec.[Estado Civil], eve.[Id Ocupación], oc.Ocupación, eve.[Documento Aseguradora], 
            enase.[Nombre Completo Entidad] as [Nombre Aseguradora], eve.[Id Tipo de Afiliado], tpa.[Tipo de Afiliado],
            eve.[Acompañante Evaluación Entidad] as [Acompanante], 
            eve.[Id Parentesco], 
            pa.Parentesco as [Parentesco Acompanante], 
            eve.[Teléfono Acompañante],
            eve.[Responsable Evaluación Entidad] as [Responsable], eve.[Id Parentesco Responsable], pr.Parentesco as [Parentesco Responsable], 
            eve.[Teléfono Responsable], eve.[Diagnóstico General Evaluación Entidad] as [Diagnostico General],
            eve.[Diagnóstico Específico Evaluación Entidad] as [Diagnostico especifico], eve.[Firma Evaluación Entidad],
            
            --PARTE DE EVALUACIÓN ENTIDAD RIPS
            everips.[Id Acto Quirúrgico],
            everips.[Id Tipo de Rips], tpr.[Tipo Rips], everips.[Codigo Rips], ob.[Descripción Objeto] as [Nombre Procedimiento],
            everips.[Codigo Rips2], ob2.[Descripción Objeto] as [Nombre Procedimiento 2], everips.[Diagnostico Rips],
            obd.[Descripción Objeto] as [Nombre Diagnóstico], everips.[Diagnostico Rips2], 
            obd2.[Descripción Objeto] as [Nombre Diagnostico 2], everips.[Documento Tipo Rips] as [Documento Entidad],
            ent.[Nombre Completo Entidad] as [Nombre Entidad], everips.[Id Modalidad Atencion], rma.[Nombre Modalidad Atencion]
            as [Modalidad Atencion], everips.[Id Grupo Servicios], rgs.[Nombre Grupo Servicios] as [Grupo Servicios], everips.[Id Servicios],
            rs.[Nombre Servicios] as [Servicios], everips.[Id Finalidad Consulta], fnc.[Descripción Finalidad Consulta]
            as [Finalidad Consulta], everips.[Id Causa Externa], ce.[Descripción Causa Externa] as [Causa Externa],
            everips.[Id Tipo de Diagnóstico Principal], tpd.[Descripción Tipo de Diagnóstico Principal] 
            as [Tipo Diagnostico Principal], everips.[Id Via Ingreso Usuario], rvi.[Nombre Via Ingreso Usuario] as [Via Ingreso], 
            fnp.[Descripción Finalidad del Procedimiento] as [Finalidad Procedimiento]

            FROM [Evaluación Entidad] as eve

            LEFT JOIN [Tipo de Evaluación] as tpe ON eve.[Id Tipo de Evaluación] = tpe.[Id Tipo de Evaluación]
            LEFT JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
            LEFT JOIN Entidad as enpro ON eve.[Documento Profesional] = enpro.[Documento Entidad]
            LEFT JOIN Ciudad ON eve.[Id Ciudad] = Ciudad.[Id Ciudad]
            LEFT JOIN [Unidad de Medida Edad] as ume ON eve.[Id Unidad de Medida Edad] = ume.[Id Unidad de Medida Edad]
            LEFT JOIN Sexo ON eve.[Id Sexo] = Sexo.[Id Sexo]
            LEFT JOIN [Estado Civil] as ec ON eve.[Id Estado Civil] = ec.[Id Estado Civil]
            LEFT JOIN Ocupación as oc ON eve.[Id Ocupación] = oc.[Id Ocupación]
            LEFT JOIN Entidad as enase ON eve.[Documento Aseguradora] = enase.[Documento Entidad]
            LEFT JOIN [Tipo de Afiliado] as tpa ON eve.[Id Tipo de Afiliado] = tpa.[Id Tipo de Afiliado]
            LEFT JOIN Parentesco as pa ON eve.[Id Parentesco] = pa.[Id Parentesco]
            LEFT JOIN Parentesco as pr ON eve.[Id Parentesco Responsable] = pr.[Id Parentesco]

            --PARTE DE EVALUACIÓN ENTIDAD RIPS EN JOIN

            LEFT JOIN [Evaluación Entidad Rips] as everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            LEFT JOIN [Tipo Rips] as tpr ON everips.[Id Tipo de Rips] = tpr.[Id Tipo Rips]
            LEFT JOIN Objeto as ob ON everips.[Codigo Rips] = ob.[Código Objeto]
            LEFT JOIN Objeto as ob2 ON everips.[Codigo Rips2] = ob2.[Código Objeto]
            LEFT JOIN Objeto as obd ON everips.[Diagnostico Rips] = obd.[Código Objeto]
            LEFT JOIN Objeto as obd2 ON everips.[Diagnostico Rips2] = obd2.[Código Objeto]
            LEFT JOIN Entidad as ent ON everips.[Documento Tipo Rips] = ent.[Documento Entidad]
            LEFT JOIN [RIPS Modalidad Atención] as rma ON everips.[Id Modalidad Atencion] = rma.[Id Modalidad Atencion]
            LEFT JOIN [RIPS Grupo Servicios] as rgs ON everips.[Id Grupo Servicios] = rgs.[Id Grupo Servicios]
            LEFT JOIN [RIPS Servicios] as rs ON everips.[Id Servicios] = rs.[Id Servicios]
            LEFT JOIN [Finalidad Consulta] as fnc ON everips.[Id Finalidad Consulta] = fnc.[Id Finalidad Consulta]
            LEFT JOIN [Causa Externa] as ce ON everips.[Id Causa Externa] = ce.[Id Causa Externa]
            LEFT JOIN [Tipo de Diagnóstico Principal] as tpd ON everips.[Id Tipo de Diagnóstico Principal] = tpd.[Id Tipo de Diagnóstico Principal]
            LEFT JOIN [RIPS Via Ingreso Usuario] as rvi ON everips.[Id Via Ingreso Usuario] = rvi.[Id Via Ingreso Usuario]
            LEFT JOIN [Finalidad del Procedimiento] as fnp ON everips.[Id Finalidad Consulta] = fnp.[Id Finalidad del Procedimiento]
            WHERE eve.[Id Tipo de Evaluación] = 1 AND eve.[Id Evaluación Entidad] = @idEvaluacion
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de los datos de la evolución:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de los datos de la evolución' });
    }
});

router.get('/formula/:idEvaluacion', async (req, res) => {
    const { idEvaluacion } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idEvaluacion', sql.Int, idEvaluacion)
            .query(`
                SELECT eve.[Id Evaluación Entidad], tpe.[Tipo de Evaluación], eve.[Id Tipo de Evaluación], enpro.[Nombre Completo Entidad] as [Nombre Profesional],
                [Fecha Evaluación Entidad], en.[Nombre Completo Entidad] as [Nombre Paciente], 
                eve.[Documento Entidad] as [Documento Paciente], eve.[Dirección Domicilio], eve.[Id Ciudad], Ciudad.Ciudad,
                eve.[Teléfono Domicilio], eve.[Fecha Nacimiento], eve.[Edad Entidad Evaluación Entidad] as [Edad Paciente],
                eve.[Id Unidad de Medida Edad], ume.[Descripción Unidad de Medida Edad] as [Unidad Medida], eve.[Id Sexo], Sexo.[Descripción Sexo],
                eve.[Id Estado Civil], ec.[Estado Civil], eve.[Id Ocupación], oc.Ocupación, eve.[Documento Aseguradora], 
                enase.[Nombre Completo Entidad] as [Nombre Aseguradora], eve.[Id Tipo de Afiliado], tpa.[Tipo de Afiliado],
                eve.[Acompañante Evaluación Entidad] as [Acompanante], 
                eve.[Id Parentesco], 
                pa.Parentesco as [Parentesco Acompanante], 
                eve.[Teléfono Acompañante],
                eve.[Responsable Evaluación Entidad] as [Responsable], eve.[Id Parentesco Responsable], pr.Parentesco as [Parentesco Responsable], 
                eve.[Teléfono Responsable], eve.[Diagnóstico General Evaluación Entidad] as [Diagnostico General],
                eve.[Diagnóstico Específico Evaluación Entidad] as [Diagnostico especifico]
            
                FROM [Evaluación Entidad] as eve

                LEFT JOIN [Tipo de Evaluación] as tpe ON eve.[Id Tipo de Evaluación] = tpe.[Id Tipo de Evaluación]
                LEFT JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
                LEFT JOIN Entidad as enpro ON eve.[Documento Profesional] = enpro.[Documento Entidad]
                LEFT JOIN Ciudad ON eve.[Id Ciudad] = Ciudad.[Id Ciudad]
                LEFT JOIN [Unidad de Medida Edad] as ume ON eve.[Id Unidad de Medida Edad] = ume.[Id Unidad de Medida Edad]
                LEFT JOIN Sexo ON eve.[Id Sexo] = Sexo.[Id Sexo]
                LEFT JOIN [Estado Civil] as ec ON eve.[Id Estado Civil] = ec.[Id Estado Civil]
                LEFT JOIN Ocupación as oc ON eve.[Id Ocupación] = oc.[Id Ocupación]
                LEFT JOIN Entidad as enase ON eve.[Documento Aseguradora] = enase.[Documento Entidad]
                LEFT JOIN [Tipo de Afiliado] as tpa ON eve.[Id Tipo de Afiliado] = tpa.[Id Tipo de Afiliado]
                LEFT JOIN Parentesco as pa ON eve.[Id Parentesco] = pa.[Id Parentesco]
                LEFT JOIN Parentesco as pr ON eve.[Id Parentesco Responsable] = pr.[Id Parentesco]

                WHERE eve.[Id Tipo de Evaluación] = 2 AND eve.[Id Evaluación Entidad] = @idEvaluacion
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de la fórmula médica:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de la fórmula médica' });
    }
});

router.get('/formato-guardado/:idEvaluacion', async (req, res) => {
    const { idEvaluacion } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idEvaluacion', sql.Int, idEvaluacion)
            .query(`
            SELECT eve.[Id Evaluación Entidad], tpe.[Tipo de Evaluación], eve.[Id Tipo de Evaluación], enpro.[Nombre Completo Entidad] as [Nombre Profesional],
            [Fecha Evaluación Entidad], en.[Nombre Completo Entidad] as [Nombre Paciente], 
            eve.[Documento Entidad] as [Documento Paciente], eve.[Dirección Domicilio], eve.[Id Ciudad], Ciudad.Ciudad,
            eve.[Teléfono Domicilio], eve.[Fecha Nacimiento], eve.[Edad Entidad Evaluación Entidad] as [Edad Paciente],
            eve.[Id Unidad de Medida Edad], ume.[Descripción Unidad de Medida Edad] as [Unidad Medida], eve.[Id Sexo], Sexo.[Descripción Sexo],
            eve.[Id Estado Civil], ec.[Estado Civil], eve.[Id Ocupación], oc.Ocupación, eve.[Documento Aseguradora], 
            enase.[Nombre Completo Entidad] as [Nombre Aseguradora], eve.[Id Tipo de Afiliado], tpa.[Tipo de Afiliado],
            eve.[Acompañante Evaluación Entidad] as [Acompanante], 
            eve.[Id Parentesco], 
            pa.Parentesco as [Parentesco Acompanante], 
            eve.[Teléfono Acompañante],
            eve.[Responsable Evaluación Entidad] as [Responsable], eve.[Id Parentesco Responsable], pr.Parentesco as [Parentesco Responsable], 
            eve.[Teléfono Responsable], eve.[Diagnóstico General Evaluación Entidad] as [Diagnostico General],
            eve.[Diagnóstico Específico Evaluación Entidad] as [Diagnostico especifico], eve.[Firma Evaluación Entidad],
            
            --PARTE DE EVALUACIÓN ENTIDAD RIPS
            everips.[Id Acto Quirúrgico],
            everips.[Id Tipo de Rips], tpr.[Tipo Rips], everips.[Codigo Rips], ob.[Descripción Objeto] as [Nombre Procedimiento],
            everips.[Codigo Rips2], ob2.[Descripción Objeto] as [Nombre Procedimiento 2], everips.[Diagnostico Rips],
            obd.[Descripción Objeto] as [Nombre Diagnóstico], everips.[Diagnostico Rips2], 
            obd2.[Descripción Objeto] as [Nombre Diagnostico 2], everips.[Documento Tipo Rips] as [Documento Entidad],
            ent.[Nombre Completo Entidad] as [Nombre Entidad], everips.[Id Modalidad Atencion], rma.[Nombre Modalidad Atencion]
            as [Modalidad Atencion], everips.[Id Grupo Servicios], rgs.[Nombre Grupo Servicios] as [Grupo Servicios], everips.[Id Servicios],
            rs.[Nombre Servicios] as [Servicios], everips.[Id Finalidad Consulta], fnc.[Descripción Finalidad Consulta]
            as [Finalidad Consulta], everips.[Id Causa Externa], ce.[Descripción Causa Externa] as [Causa Externa],
            everips.[Id Tipo de Diagnóstico Principal], tpd.[Descripción Tipo de Diagnóstico Principal] 
            as [Tipo Diagnostico Principal], everips.[Id Via Ingreso Usuario], rvi.[Nombre Via Ingreso Usuario] as [Via Ingreso], 
            fnp.[Descripción Finalidad del Procedimiento] as [Finalidad Procedimiento]

            FROM [Evaluación Entidad] as eve

            LEFT JOIN [Tipo de Evaluación] as tpe ON eve.[Id Tipo de Evaluación] = tpe.[Id Tipo de Evaluación]
            LEFT JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
            LEFT JOIN Entidad as enpro ON eve.[Documento Profesional] = enpro.[Documento Entidad]
            LEFT JOIN Ciudad ON eve.[Id Ciudad] = Ciudad.[Id Ciudad]
            LEFT JOIN [Unidad de Medida Edad] as ume ON eve.[Id Unidad de Medida Edad] = ume.[Id Unidad de Medida Edad]
            LEFT JOIN Sexo ON eve.[Id Sexo] = Sexo.[Id Sexo]
            LEFT JOIN [Estado Civil] as ec ON eve.[Id Estado Civil] = ec.[Id Estado Civil]
            LEFT JOIN Ocupación as oc ON eve.[Id Ocupación] = oc.[Id Ocupación]
            LEFT JOIN Entidad as enase ON eve.[Documento Aseguradora] = enase.[Documento Entidad]
            LEFT JOIN [Tipo de Afiliado] as tpa ON eve.[Id Tipo de Afiliado] = tpa.[Id Tipo de Afiliado]
            LEFT JOIN Parentesco as pa ON eve.[Id Parentesco] = pa.[Id Parentesco]
            LEFT JOIN Parentesco as pr ON eve.[Id Parentesco Responsable] = pr.[Id Parentesco]

            --PARTE DE EVALUACIÓN ENTIDAD RIPS EN JOIN

            LEFT JOIN [Evaluación Entidad Rips] as everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            LEFT JOIN [Tipo Rips] as tpr ON everips.[Id Tipo de Rips] = tpr.[Id Tipo Rips]
            LEFT JOIN Objeto as ob ON everips.[Codigo Rips] = ob.[Código Objeto]
            LEFT JOIN Objeto as ob2 ON everips.[Codigo Rips2] = ob2.[Código Objeto]
            LEFT JOIN Objeto as obd ON everips.[Diagnostico Rips] = obd.[Código Objeto]
            LEFT JOIN Objeto as obd2 ON everips.[Diagnostico Rips2] = obd2.[Código Objeto]
            LEFT JOIN Entidad as ent ON everips.[Documento Tipo Rips] = ent.[Documento Entidad]
            LEFT JOIN [RIPS Modalidad Atención] as rma ON everips.[Id Modalidad Atencion] = rma.[Id Modalidad Atencion]
            LEFT JOIN [RIPS Grupo Servicios] as rgs ON everips.[Id Grupo Servicios] = rgs.[Id Grupo Servicios]
            LEFT JOIN [RIPS Servicios] as rs ON everips.[Id Servicios] = rs.[Id Servicios]
            LEFT JOIN [Finalidad Consulta] as fnc ON everips.[Id Finalidad Consulta] = fnc.[Id Finalidad Consulta]
            LEFT JOIN [Causa Externa] as ce ON everips.[Id Causa Externa] = ce.[Id Causa Externa]
            LEFT JOIN [Tipo de Diagnóstico Principal] as tpd ON everips.[Id Tipo de Diagnóstico Principal] = tpd.[Id Tipo de Diagnóstico Principal]
            LEFT JOIN [RIPS Via Ingreso Usuario] as rvi ON everips.[Id Via Ingreso Usuario] = rvi.[Id Via Ingreso Usuario]
            LEFT JOIN [Finalidad del Procedimiento] as fnp ON everips.[Id Finalidad Consulta] = fnp.[Id Finalidad del Procedimiento]
            WHERE eve.[Id Tipo de Evaluación] = 4 AND eve.[Id Evaluación Entidad] = @idEvaluacion
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error('Error al ejecutar la consulta de los datos de la evolución:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de los datos de la evolución' });
    }
});

router.get('/formatos-guardado/:documentoEntidad', async (req, res) => {
    const { documentoEntidad } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('DocumentoEntidad', sql.VarChar, documentoEntidad)
            .query(`SELECT eve.[Id Evaluación Entidad], 
                    en.[Primer Nombre Entidad] + ' ' + en.[Primer Apellido Entidad] as [Nombre Paciente], 
                    eve.[Fecha Evaluación Entidad], eve.[Diagnóstico General Evaluación Entidad]
                    FROM [Evaluación Entidad] as eve
                    INNER JOIN Entidad as en ON eve.[Documento Entidad] = en.[Documento Entidad]
                    WHERE eve.[Id Tipo de Evaluación] = 4 AND eve.[Documento Entidad] = @DocumentoEntidad
                    ORDER BY eve.[Fecha Evaluación Entidad] DESC`);

        console.log('Formatos consultados correctamente');

        const formulasPacienteData = result.recordset.map(row => {
            // Extraer el nombre del formato desde la ruta
            let diagnosticoGeneral = row['Diagnóstico General Evaluación Entidad'];
            let nombreFormato = diagnosticoGeneral.split('\\').pop().replace('.html', '');

            return {
                idEvolucion: row['Id Evaluación Entidad'],
                pacienteEvolucion: row['Nombre Paciente'],
                fechaEvolucion: row['Fecha Evaluación Entidad'].toISOString().split('T')[0],
                nombreFormato: nombreFormato  // Nombre del formato sin ruta ni extensión
            };
        });

        res.json(formulasPacienteData);

    } catch (err) {
        console.error('Error al ejecutar la consulta de las evaluaciones del paciente:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de las evaluaciones del paciente' });
    }
});



export default router;
