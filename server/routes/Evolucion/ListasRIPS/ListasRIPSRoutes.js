import { Router } from 'express';
import { sql, poolPromise } from '../../../db.js'

const router = Router();
// const pool = await poolPromise;
let pool;

// Inicializa el pool al iniciar la aplicación
(async () => {
    try {
        pool = await poolPromise;
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();
// CONSULTA PARA MOSTRAR LOS TIPOS DE RIPS
router.get('/TipoDeRips', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT
                IdTipoRips, CódigoTipoRips, TipoRips, 
                DescripcionTipoRips, IdEstado
            FROM            
                [Cnsta Relacionador Tipo Rips]
            ORDER BY
                DescripcionTipoRips ASC
        `);
        const DatosObtenidoss = result.recordset.map(({ IdTipoRips, CódigoTipoRips, TipoRips, DescripcionTipoRips, IdEstado }) => ({
            IdTipoRips,
            CódigoTipoRips,
            TipoRips,
            DescripcionTipoRips,
            IdEstado
        }));        

        const DatosObtenidos = result.recordset.map((row) => ({
            value: row['IdTipoRips'],
            text: row['TipoRips']
        }))
        res.status(200).json(DatosObtenidos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// CONSULTA LAS ENTIDADES DEPENDIENDO DEL TIPO ENTIDAD
router.get(`/Entidades`, async (req, res) => {
    try {
        const {Tipo} = req.query;
        const result = await pool.request()
        .input('TipoEntidad', Tipo)
        .query(`
                SELECT         NombreCompletoPaciente, [Id Función], Función, DocumentoEntidad, IdTipoRips
                FROM            [Cnsta Relacionador Entidades Rips]
                WHERE        (IdTipoRips = @TipoEntidad)
                ORDER BY        NombreCompletoPaciente ASC
        `);
        res.status(200).json(result.recordset.map((row) => ({
            value: row['DocumentoEntidad'],
            text: row['NombreCompletoPaciente']
        })))
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// CONSULTA TODAS LAS MODALIDADES GRUPO SERVICIO TECNOLOGÍA SALUD
router.get('/ModalidadGrupoServicioTecSal', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        IdModalidadAtencion, Codigo, NombreModalidadAtencion, 
             DescripcionModalidadAtencion, OrdenModalidadAtencion, [Id Estado]
            FROM            [Cnsta Relacionador Modalidad Atencion]
            ORDER BY NombreModalidadAtencion ASC
        `);

        const ModalidadGrupoServicioTecSalObtenidas = result.recordset.map((row) => ({
            value: row["Codigo"],
            text: row["NombreModalidadAtencion"]
        }))
        const ModalidadGrupoServicioTecSalObtenidasa = result.recordset.map(({Codigo, NombreModalidadAtencion}) => ({
            Codigo,
            NombreModalidadAtencion
        }));
        res.status(200).json(ModalidadGrupoServicioTecSalObtenidas);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/ModalidadGrupoServicioTecSalud', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        IdModalidadAtencion, Codigo, NombreModalidadAtencion, 
             DescripcionModalidadAtencion, OrdenModalidadAtencion, [Id Estado]
            FROM            [Cnsta Relacionador Modalidad Atencion]
            ORDER BY NombreModalidadAtencion ASC
        `);
        res.status(200).json(result.recordset.map((row) => ({
            value: row["IdModalidadAtencion"],
            text: row["NombreModalidadAtencion"]
        })));
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// CONSULTA TODAS LAS VIAS DE INGRESO SERVICIO SALUD
router.get('/ViaIngresoServicioSalud', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        IdViaIngresoUsuario, Codigo, NombreViaIngresoUsuario,
             DescripcionViaIngresoUsuario, OrdenViaIngresoUsuario, [Id Estado]
            FROM            [Cnsta Relacionador Via Ingreso Usuario] 
            ORDER BY NombreViaIngresoUsuario ASC
        `);

        const ViaIngresoServicioSaludObtenidas = result.recordset.map((row) => ({
            value: row["IdViaIngresoUsuario"],
            text: row["NombreViaIngresoUsuario"]
        }))
        res.status(200).json(ViaIngresoServicioSaludObtenidas);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// CONSULTA TODOS LOS GRUPOS DE SERVICIOS
router.get('/GrupoServicios', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        IdGrupoServicios, Codigo, NombreGrupoServicios, 
              DescripcionGrupoServicios, [Orden Grupo Servicios], [Id Estado]
            FROM            [Cnsta Relacionador ModalidadGrupoServicioTecSal]
        `);
        res.status(200).json(result.recordset.map((row) => ({
            value: row["IdGrupoServicios"],
            text: row["NombreGrupoServicios"]
        })));
    } catch {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA TODOS LOS SERVICIOS DEPENDIENDO EL TIPO GRUPO SERVICIO
router.get('/CodServicio', async (req, res) => {
    try {
        const {GrupoServicio} = req.query;
        const result = await pool.request()
        .input("GrupoServicio", GrupoServicio)
        .query(`
            SELECT 
                [Id Servicios], [Código Servicios], [Nombre Servicios], 
                [Descripción Servicios], [Id Estado], [Codigo Grupo Servicios],  
                [Id Grupo Servicios]
            FROM 
                [Cnsta Relacionador Servicios]
            WHERE 
                [Id Grupo Servicios] = @GrupoServicio
            ORDER BY
                [Nombre Servicios] ASC
        `);

        res.status(200).json(result.recordset.map((row) => ({
            value: row["Id Servicios"],
            text: row["Nombre Servicios"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA TODAS LAS FINALIDADES DE TECNOLOGÍA SALUD
router.get('/FinalidadTecnologiaSaludAP', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
                SELECT        IdFinalidadConsulta, Codigo, NombreRIPSFinalidadConsultaVersion2, DescripcionRIPSFinalidadConsultaVersion2, RIPSFinalidadConsultaVersion2, AC, AP, [Id Estado]
                FROM            [Cnsta Relacionador Finalidad]
                WHERE        (AP = N'Si')
                ORDER BY        NombreRIPSFinalidadConsultaVersion2 ASC
        `);
        res.status(200).json(result.recordset.map((row) => ({
            // value: row["IdFinalidadConsulta"],
            value: row["Codigo"],
            text: row["NombreRIPSFinalidadConsultaVersion2"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/FinalidadTecnologiaSaludAC', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
                SELECT        IdFinalidadConsulta, Codigo, NombreRIPSFinalidadConsultaVersion2, DescripcionRIPSFinalidadConsultaVersion2, RIPSFinalidadConsultaVersion2, AC, AP, [Id Estado]
                FROM            [Cnsta Relacionador Finalidad]
                WHERE        (AC = N'Si')
                ORDER BY        NombreRIPSFinalidadConsultaVersion2 ASC
        `);
        res.status(200).json(result.recordset.map((row) => ({
            // value: row["IdFinalidadConsulta"],
            value: row["Codigo"],
            text: row["NombreRIPSFinalidadConsultaVersion2"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA TODAS LAS CAUSAS MOTIVIO ATENCIÓN
router.get('/CausaMotivoAtencion', async (req, res) => {
    try {   
        const result = await pool.request()
        .query(`
            SELECT       [Id RIPS Causa Externa Version2], Codigo, 
              NombreRIPSCausaExternaVersion2, DescripcionRIPSCausaExternaVersion2, 
              RIPSCausaExternaVersion2, [Id Estado]
            FROM            [Cnsta Relacionador Causa Externa]
            ORDER BY 
                NombreRIPSCausaExternaVersion2 ASC
        `);

        res.status(200).json(result.recordset.map((row) => ({
            // value: row["Id RIPS Causa Externa Version2"],
            value: row["Codigo"],
            text: row["NombreRIPSCausaExternaVersion2"]
        })));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA TODOS LOS TIPOS DE DIAGNÓSTICOS PRINCIPALES
router.get('/TipoDiagnosticoPrincipal', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        IdTipodeDiagnósticoPrincipal, CódigoTipodeDiagnósticoPrincipal, 
              TipodeDiagnósticoPrincipal, DescripcionTipodeDiagnósticoPrincipal,
               ordenTipodeDiagnósticoPrincipal, [Id Estado]
                FROM            [Cnsta Relacionador Tipo Diagnostico Principal]  
                ORDER BY
                DescripcionTipodeDiagnósticoPrincipal ASC
        `);

        res.status(200).json(result.recordset.map((row) => ({
            // value: row["IdTipodeDiagnósticoPrincipal"],
            value: row["CódigoTipodeDiagnósticoPrincipal"],
            text: row["DescripcionTipodeDiagnósticoPrincipal"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSTULTA TODOS LOS CUPS DEPENDIENDO DEL TIPO
router.get('/Cups/AC', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        Codigo, Descripcion, Nombre, Tipo
            FROM            [Cnsta Relacionador Cups]
            WHERE        (Tipo = 'AC')
            ORDER BY
                Nombre ASC
        `);

        res.status(200).json(result.recordset.map((row) => ({
            value: row["Codigo"],
            text: row["Codigo"] + " - " + row["Nombre"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/Cups/AP', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT        Codigo, Descripcion, Nombre, Tipo
            FROM            [Cnsta Relacionador Cups]
            WHERE        (Tipo = 'AP')
            ORDER BY
                Nombre ASC
        `);

        res.status(200).json(result.recordset.map((row) => ({
            value: row["Codigo"],
            text: row["Codigo"] + " - " + row["Nombre"]
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// CONSULTA TODOS LOS CIE
router.get('/Cie', async (req, res) => {
    try {
        const result = await pool.request()
        .query(`
            SELECT  Codigo, Nombre, Descripcion, AplicaASexo, EdadMinima, EdadMaxima, 
                GrupoMortalidad, Extra_V, Extra_VI_Capitulo, SubGrupo, Sexo
            FROM    
                [Cnsta Relacionador Cie10] 
            ORDER BY
                Nombre ASC
        `);
        res.status(200).json(result.recordset.map((row) => ({
            value: row["Codigo"],
            text: row["Codigo"] + " - " + row["Nombre"]
        })));
        console.log('HOLA, CONSULTANDO... LOS CIE 10');
    } catch (error) {
        console.log(`HOLA, CONSULTANDO... ${error.message}`);
        res.status(500).json({ error: error.message });
    };
});

// TODA LA FUNCIONALIDAD PARA TRABAJAR CON LOS RIPS POR DEFECTO, TANTO AP COMO AC
router.post('/InsertarRipsPorDefecto', async (req, res) => {
    try {
        console.log(req.body);
        const result = await pool.request()
        .input('DocumentoProfesional', sql.NChar, req.body.DocumentoProfesional)
        .input('TipoRIPS', sql.Int, req.body.TipoRIPS ? parseInt(req.body.TipoRIPS) : null)
        .input('TipoDeUsuario', sql.NChar, req.body.TipoDeUsuario === '' ? null : req.body.TipoDeUsuario)
        .input('Entidad', sql.NChar, req.body.Entidad === '' ? null : req.body.Entidad)
        .input('ModalidadGrupoServicioTecSal', sql.NChar, req.body.ModalidadGrupoServicioTecSal)
        .input('GrupoServicios', sql.NChar, req.body.GrupoServicios === '' ? null : req.body.GrupoServicios)
        .input('CodigoServicio', sql.NChar, req.body.CodigoServicio === '' ? null : req.body.CodigoServicio)
        .input('FinalidadTecnologiaSalud', sql.NChar, req.body.FinalidadTecnologiaSalud === '' ? null : req.body.FinalidadTecnologiaSalud)
        .input('CausaMotivoAtencion', sql.NChar, req.body.CausaMotivoAtencion === '' ? null : req.body.CausaMotivoAtencion)
        .input('TipoDiagnosticoPrincipal', sql.NChar, req.body.TipoDiagnosticoPrincipal === '' ? null : req.body.TipoDiagnosticoPrincipal)
        .input('Diagnostico1', sql.NChar, req.body.Diagnostico1 === '' ? null : req.body.Diagnostico1)
        .input('Diagnostico2', sql.NChar, req.body.Diagnostico2 === '' ? null : req.body.Diagnostico2)
        .input('Procedimiento1', sql.NChar, req.body.Procedimiento1 === '' ? null : req.body.Procedimiento1)
        .input('Procedimiento2', sql.NChar, req.body.Procedimiento2 === '' ? null : req.body.Procedimiento2)
        .input('ViaIngresoServicioSalud', sql.NChar, req.body.ViaIngresoServicioSalud === '' ? null : req.body.ViaIngresoServicioSalud)
        .query(`
            INSERT INTO [dbo].[API_RIPS_POR_DEFECTO]
                ([DocumentoEntidad]
                ,[TipoDeRips]
                ,[TipoDeUsuario]
                ,[Entidad]
                ,[ViaIngresoServicioSalud]
                ,[ModalidadGrupoServicioTecnologiaEnSalud]
                ,[GrupoServicios]
                ,[CodigoServicio]
                ,[FinalidadTecnologiaSalud]
                ,[CausaMotivoAtencion]
                ,[TipoDiagnosticoPrincipal]
                ,[Diagnostico1]
                ,[Diagnostico2]
                ,[Procedimiento1]
                ,[Procedimiento2]
                )
            VALUES
                (@DocumentoProfesional,
                @TipoRIPS,
                @TipoDeUsuario,
                @Entidad,
                @ViaIngresoServicioSalud,
                @ModalidadGrupoServicioTecSal,
                @GrupoServicios,
                @CodigoServicio,
                @FinalidadTecnologiaSalud,
                @CausaMotivoAtencion,
                @TipoDiagnosticoPrincipal,
                @Diagnostico1,
                @Diagnostico2,
                @Procedimiento1,
                @Procedimiento2
                )
        `);
        res.status(200).json({mensaje: `EL RIPS AUTOMATICO SE GUARDÓ CORRECTAMENTE...`});
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`HOLA, ERROR AL GUARDAR... ${error.message}`);
    };
});

router.post('/ActualizarRipsPorDefecto', async (req, res) => {
    try {
        console.log(req.body);
        const result = await pool.request()
        .input('DocumentoProfesional', sql.NChar, req.body.DocumentoProfesional)
        .input('TipoRIPS', sql.Int, req.body.TipoRIPS ? parseInt(req.body.TipoRIPS) : null)
        // .input('TipoDeUsuario', sql.NChar, (req.body.TipoDeUsuario === '' || req.body.TipoDeUsuario === 'SinSeleccionar') ? null : req.body.TipoDeUsuario)
        .input('TipoDeUsuario', sql.NChar, req.body.TipoDeUsuario)
        .input('Entidad', sql.NChar, req.body.Entidad)
        .input('Diagnostico1', sql.NChar, req.body.Diagnostico1 === '' ? null : req.body.Diagnostico1)
        .input('Diagnostico2', sql.NChar, req.body.Diagnostico2 === '' ? null : req.body.Diagnostico2)
        .input('Procedimiento1', sql.NChar, req.body.Procedimiento1 === '' ? null : req.body.Procedimiento1)
        .input('Procedimiento2', sql.NChar, req.body.Procedimiento2 === '' ? null : req.body.Procedimiento2)
        .input('ViaIngresoServicioSalud', sql.NChar, req.body.ViaIngresoServicioSalud)
        .input('ModalidadGrupoServicioTecSal', sql.NChar, req.body.ModalidadGrupoServicioTecSal)
        .input('GrupoServicios', sql.NChar, req.body.GrupoServicios)
        .input('FinalidadTecnologiaSalud', sql.NChar, req.body.FinalidadTecnologiaSalud)
        .input('CausaMotivoAtencion', sql.NChar, req.body.CausaMotivoAtencion)
        .input('TipoDiagnosticoPrincipal', sql.NChar, req.body.TipoDiagnosticoPrincipal)
        .input('CodigoServicio', sql.NChar, req.body.CodigoServicio)
        .query(`
            UPDATE 
                [dbo].[API_RIPS_POR_DEFECTO]
            SET 
                --[DocumentoEntidad] = 
                --,[TipoDeRips] =
                [TipoDeUsuario] = @TipoDeUsuario
                ,[Entidad] = @Entidad
                ,[ViaIngresoServicioSalud] = @ViaIngresoServicioSalud
                ,[ModalidadGrupoServicioTecnologiaEnSalud] = @ModalidadGrupoServicioTecSal
                ,[GrupoServicios] = @GrupoServicios
                ,[CodigoServicio] = @CodigoServicio
                ,[FinalidadTecnologiaSalud] = @FinalidadTecnologiaSalud
                ,[CausaMotivoAtencion] = @CausaMotivoAtencion
                ,[TipoDiagnosticoPrincipal] = @TipoDiagnosticoPrincipal
                ,[Diagnostico1] = @Diagnostico1
                ,[Diagnostico2] = @Diagnostico2
                ,[Procedimiento1] = @Procedimiento1
                ,[Procedimiento2] = @Procedimiento2
            WHERE 
                ([DocumentoEntidad] = @DocumentoProfesional AND [TipoDeRips] = @TipoRIPS)
        `);

        res.status(200).json({mensaje: `EL RIPS AC HA SIDO ACTUALIZADO CORRECTAMENTE...\n :)`});
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`HOLA, ERROR AL ACTUALIZAR... ${error.message}`);
    }
})
router.post('/EliminarRipsPorDefecto', async (req, res) => {
    try {
        const { DocumentoProfesional, TipoRIPS } = req.body;

        // Verifica que los parámetros no sean nulos o indefinidos
        if (!DocumentoProfesional || !TipoRIPS) {
            return res.status(400).json({ error: "Faltan parámetros requeridos." });
        }

        const result = await pool.request()
            .input('DocumentoProfesional', DocumentoProfesional) // Asegúrate de que el tipo sea correcto
            .input('TipoRIPS', TipoRIPS) // Asegúrate de que el tipo sea correcto
            .query(`
                DELETE FROM [dbo].[API_RIPS_POR_DEFECTO]     
                WHERE [DocumentoEntidad] = @DocumentoProfesional AND [TipoDeRips] = @TipoRIPS
            `);
        res.status(200).json({mensaje: `EL RIPS SE ELIMINÓ CORRECTAMENTE...`});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CONSULTA TODOS LOS RIPS POR DEFECTO QUE TIENE EL PROFESIONAL 1 = AC Y 2 = AP
router.get('/ConsultarRipsPorDefecto', async (req, res) => {
    try {
        const { DocumentoProfesional, TipoRIPS } = req.query;
        const result = await pool.request()
        .input('DocumentoProfesional', DocumentoProfesional)
        .input('TipoRIPS', TipoRIPS)
        .query(`
                SELECT * FROM [dbo].[API_RIPS_POR_DEFECTO]     
                WHERE [DocumentoEntidad] = @DocumentoProfesional AND [TipoDeRips] = @TipoRIPS
        `);

        if (result.recordset.length >= 1) {
            console.log(result.recordset);
            res.status(200).json({ mensaje: `TODO MUY BIEN`, datos: result.recordset });
        } else {
            console.log(result.recordset);
            res.status(200).json({ mensaje: `NO SE ENCONTRARON DATOS`, datos: result.recordset });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
});
export default router;