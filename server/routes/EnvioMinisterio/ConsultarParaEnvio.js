import express from 'express';
import { sql, poolPromise } from '../../db.js';

const router = express.Router();


router.get('/ministerio/consultar', async (req, res) => {
    const { docEmpresa, fechaInicio, fechaFin } = req.query;

    console.log('Parametros obtenidos son:', req.query)

    try {
        const pool = await poolPromise;

        const query = `
                        SELECT DISTINCT em.NroIDPrestador, tpd.[Tipo de Documento] as tipoDocumentoIdentificacion, en.[Documento Entidad] as [Documento Paciente], en.[Nombre Completo Entidad] as [Nombre Paciente],
                        CONVERT(DATE, eve.[Fecha Evaluación Entidad], 120) as [Fecha Atencion], em5.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] AS [numFactura], 
                        fc.[No Factura], everips.[Id Factura], '0' + tpe.[Tipo Entidad] AS tipoUsuario, CONVERT(VARCHAR, en3.[Fecha Nacimiento EntidadIII], 23) AS [fechaNacimiento], 
                        Sexo.[Sexo] AS [codSexo], País.País AS [codPaisResidencia], Ciu.[Código Ciudad] AS [codMunicipioResidencia], 
                        '0' + zr.[Código Zona Residencia] AS [codZonaTerritorialResidencia], 'NO' AS incapacidad, pais2.País AS [codPaisOrigen], fc.XML

                        FROM Entidad as en 

                        INNER JOIN [Evaluación Entidad] as eve ON en.[Documento Entidad] = eve.[Documento Entidad]
                        INNER JOIN [Evaluación Entidad Rips] as everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
                        INNER JOIN Factura as fc ON everips.[Id Factura] = fc.[Id Factura]
                        LEFT JOIN Empresa as em ON eve.[Documento Empresa] = em.[Documento Empresa]
                        LEFT JOIN [Tipo de Documento] as tpd ON en.[Id Tipo de Documento] = tpd.[Id Tipo de Documento]
                        INNER JOIN EmpresaV as em5 ON fc.[Id EmpresaV] = em5.[Id EmpresaV]
                        LEFT JOIN EntidadII AS en2 ON en.[Documento Entidad] = en2.[Documento Entidad]
                        LEFT JOIN EntidadIII AS en3 ON en.[Documento Entidad] = en3.[Documento Entidad]
                        LEFT JOIN [Tipo Entidad] AS tpe ON en3.[Id Tipo Entidad] = tpe.[Id Tipo Entidad]
                        LEFT JOIN Sexo ON en3.[Id Sexo] = Sexo.[Id Sexo]
                        LEFT JOIN Ciudad AS Ciu ON en2.[Id Ciudad] = Ciu.[Id Ciudad] 
                        LEFT JOIN Departamento AS Depart ON Ciu.[Id Departamento] = Depart.[Id Departamento] 
                        LEFT JOIN País ON Depart.[Id País] = País.[Id País] 
                        LEFT JOIN [Zona Residencia] AS zr ON en3.[Id Zona Residencia] = zr.[Id Zona Residencia]
                        LEFT JOIN Ciudad AS ciu2 ON en2.[Id Ciudad] = ciu2.[Id Ciudad]
                        LEFT JOIN Departamento AS Depart2 ON ciu2.[Id Departamento] = Depart2.[Id Departamento]
                        LEFT JOIN País AS pais2 ON Depart2.[Id País] = pais2.[Id País]

                        WHERE everips.[Id Factura] IS NOT NULL
                        AND fc.XML IS NOT NULL
                        AND eve.[Documento Empresa] = @docEmpresa
                        AND CONVERT(DATE, eve.[Fecha Evaluación Entidad], 23) BETWEEN @fechaInicio AND @fechaFin
                            `;
        // Ejecutar la consulta con el parámetro
        const result = await pool.request()
            .input('fechaInicio', fechaInicio)
            .input('fechaFin', fechaFin)
            .input('docEmpresa', docEmpresa)
            .query(query);

        // Enviar los datos como respuesta JSON
        res.json(result.recordset);

    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/ministerio/RipsAC/:numFactura/:numDocumentoIdentificacion', async (req, res) => {
    const { numFactura, numDocumentoIdentificacion } = req.params;

    console.log('Parametros obtenidos son:', req.params)
    try {
        const pool = await poolPromise;

        // Definir la consulta con parámetros
        const query = `
            SELECT eve.[Id Evaluación Entidad], em.[Código Empresa] AS codPrestador, 
            SUBSTRING(CONVERT(VARCHAR, eve.[Fecha Evaluación Entidad], 120), 1, 16) AS fechaInicioAtencion, NULL AS numAutorizacion, everips.[Codigo RIPS] AS codConsulta,
            moda.Codigo AS modalidadGrupoServicioTecSal, gs.Codigo as grupoServicios, servicios.[Código Servicios] as codServicio,
            fn.[Código Finalidad Consulta] AS finalidadTecnologiaSalud, ce.[Código Causa Externa] AS causaMotivoAtencion, everips.[Diagnostico Rips] AS codDiagnosticoPrincipal, 
            CASE WHEN everips.[Diagnostico Rips2] = 'Null' THEN NULL ELSE everips.[Diagnostico Rips2] END AS codDiagnosticoRelacionado1, NULL AS codDiagnosticoRelacionado2, 
            NULL AS codDiagnosticoRelacionado3, tdp.[Código Tipo de Diagnóstico Principal] AS tipoDiagnosticoPrincipal, tp.[Tipo de Documento] AS tipoDocumentoIdentificacion, 
            eve.[Documento Entidad] AS numDocumentoIdentificacion, fc.[Total Factura] AS vrServicio, '05' AS tipoPagoModerador, '0' AS valorPagoModerador, 
            NULL AS numFEVPagoModerador, ROW_NUMBER() OVER (ORDER BY everips.[Id Evaluación Entidad RIPS]) AS consecutivo

            FROM [Evaluación Entidad] as eve

            INNER JOIN Empresa as em ON eve.[Documento Empresa] = em.[Documento Empresa]
            INNER JOIN [Evaluación Entidad Rips] as everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            LEFT JOIN [RIPS Modalidad Atención] as moda ON everips.[Id Modalidad Atencion] = moda.[Id Modalidad Atencion]
            LEFT JOIN [RIPS Grupo Servicios] as gs ON everips.[Id Grupo Servicios] = gs.[Id Grupo Servicios]
            LEFT JOIN [RIPS Servicios] as servicios ON everips.[Id Servicios] = servicios.[Id Servicios]
            LEFT JOIN [Finalidad Consulta] as fn ON everips.[Id Finalidad Consulta] = fn.[Id Finalidad Consulta]
            LEFT JOIN [Causa Externa] AS ce ON everips.[Id Causa Externa] = ce.[Id Causa Externa]
            LEFT JOIN [Tipo de Diagnóstico Principal] AS tdp ON everips.[Id Tipo de Diagnóstico Principal] = tdp.[Id Tipo de Diagnóstico Principal]
            LEFT JOIN Entidad ON eve.[Documento Entidad] = Entidad.[Documento Entidad]
            LEFT JOIN [Tipo de Documento] AS tp ON Entidad.[Id Tipo de Documento] = tp.[Id Tipo de Documento]
            INNER JOIN Factura AS fc ON everips.[Id Factura] = fc.[Id Factura]
            INNER JOIN EmpresaV as em5 ON fc.[Id EmpresaV] = em5.[Id EmpresaV]

            WHERE
            everips.[Id Acto Quirúrgico] = 1 
            AND em5.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] = @numFactura
            AND eve.[Documento Entidad] = @numDocumentoIdentificacion
            --AND CONVERT(DATE, eve.[Fecha Evaluación Entidad]) BETWEEN @fechaInicio AND @fechaFin
            --AND em5.[Resolución Facturación EmpresaV] = @ResolucionesRips
                    `;

        // Ejecutar la consulta con el parámetro
        const result = await pool.request()
            .input('numFactura', numFactura)
            .input('numDocumentoIdentificacion', numDocumentoIdentificacion)
            .query(query);

        // Enviar los datos como respuesta JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/ministerio/RipsAP/:numFactura/:numDocumentoIdentificacion', async (req, res) => {
    const { numFactura, numDocumentoIdentificacion } = req.params;

    console.log('Parametros obtenidos son:', req.params)
    try {
        const pool = await poolPromise;

        // Definir la consulta con parámetros
        const query = `
            SELECT eve.[Id Evaluación Entidad], em.[Código Empresa] AS codPrestador, 
            SUBSTRING(CONVERT(VARCHAR, eve.[Fecha Evaluación Entidad], 120), 1, 16) AS fechaInicioAtencion, NULL AS idMIPRES, NULL AS numAutorizacion, everips.[Codigo RIPS] AS codProcedimiento, vi.Codigo AS viaIngresoServicioSalud,
            moda.Codigo AS modalidadGrupoServicioTecSal, gs.Codigo as grupoServicios, servicios.[Código Servicios] as codServicio, fp.[Código Finalidad del Procedimiento] AS finalidadTecnologiaSalud,
            tp.[Tipo de Documento] AS tipoDocumentoIdentificacion, eve.[Documento Entidad] AS numDocumentoIdentificacion, everips.[Diagnostico Rips] AS codDiagnosticoPrincipal, 
            CASE WHEN everips.[Diagnostico Rips2] = 'Null' THEN NULL ELSE everips.[Diagnostico Rips2] END AS codDiagnosticoRelacionado, NULL AS codComplicacion, fc.[Total Factura] AS vrServicio, '05' AS tipoPagoModerador, 
            '0' AS valorPagoModerador, NULL AS numFEVPagoModerador, ROW_NUMBER() OVER (ORDER BY everips.[Id Evaluación Entidad RIPS]) AS consecutivo

            FROM [Evaluación Entidad] as eve

            INNER JOIN Empresa as em ON eve.[Documento Empresa] = em.[Documento Empresa]
            INNER JOIN [Evaluación Entidad Rips] as everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            LEFT JOIN [RIPS Modalidad Atención] as moda ON everips.[Id Modalidad Atencion] = moda.[Id Modalidad Atencion]
            LEFT JOIN [RIPS Grupo Servicios] as gs ON everips.[Id Grupo Servicios] = gs.[Id Grupo Servicios]
            LEFT JOIN [RIPS Servicios] as servicios ON everips.[Id Servicios] = servicios.[Id Servicios]
            LEFT JOIN [Finalidad del Procedimiento] as fp ON everips.[Id Causa Externa] = fp.[Id Finalidad del Procedimiento]
            LEFT JOIN [Causa Externa] AS ce ON everips.[Id Causa Externa] = ce.[Id Causa Externa]
            LEFT JOIN [RIPS Via Ingreso Usuario] as vi ON everips.[Id Via Ingreso Usuario] = vi.[Id Via Ingreso Usuario]
            LEFT JOIN Entidad ON eve.[Documento Entidad] = Entidad.[Documento Entidad]
            LEFT JOIN [Tipo de Documento] AS tp ON Entidad.[Id Tipo de Documento] = tp.[Id Tipo de Documento]
            LEFT JOIN Factura AS fc ON everips.[Id Factura] = fc.[Id Factura]
            LEFT JOIN EmpresaV as em5 ON em.[Documento Empresa] = em5.[Documento Empresa]

            WHERE
            everips.[Id Acto Quirúrgico] <> 1 
            AND em5.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] = @numFactura 
            AND eve.[Documento Entidad] = @numDocumentoIdentificacion
            --AND CONVERT(DATE, eve.[Fecha Evaluación Entidad]) BETWEEN @fechaInicio AND @fechaFin
            AND em5.[Id EmpresaV] = 147
                    `;

        // Ejecutar la consulta con el parámetro
        const result = await pool.request()
            .input('numFactura', numFactura)
            .input('numDocumentoIdentificacion', numDocumentoIdentificacion)
            .query(query);

        // Enviar los datos como respuesta JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});


export default router;
