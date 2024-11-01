import express from 'express';
import { sql, poolPromise } from '../../db.js';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import yauzl from 'yauzl';
import fsExtra from 'fs-extra';
import { promisify } from 'util';
const router = express.Router();
import { pipeline } from 'stream';
const pipelineAsync = promisify(pipeline);

router.get('/usuarios/rips', async (req, res) => {
    const fechaInicio = req.query.fechaInicio
    const fechaFin = req.query.fechaFin
    const ResolucionesRips = req.query.ResolucionesRips;
    const documentoEmpresaSeleccionada = req.query.documentoEmpresaSeleccionada;

    console.log(`La fechaInicio es: ${fechaInicio}`)
    console.log(`La fechaFin es: ${fechaFin}`)
    console.log(`La ResolucionesRips es: ${ResolucionesRips}`)
    console.log(`La documentoEmpresaSeleccionada es: ${documentoEmpresaSeleccionada}`)

    try {
        const pool = await poolPromise;

        const query = `
            SELECT 
                em.NroIDPrestador, 
                EmpV.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] AS [numFactura], 
                NULL AS [numNota], 
                NULL AS [tipoNota], 
                tpd.[Tipo de Documento] AS [tipoDocumentoIdentificacion],
                en.[Documento Entidad] AS [numDocumentoIdentificacion], 
                '0' + tpe.[Tipo Entidad] AS [tipoUsuario],
                CONVERT(VARCHAR, en3.[Fecha Nacimiento EntidadIII], 23) AS [fechaNacimiento], 
                Sexo.[Sexo] AS [codSexo], 
                País.País AS [codPaisResidencia], 
                Ciu.[Código Ciudad] AS [codMunicipioResidencia], 
                '0' + zr.[Código Zona Residencia] AS [codZonaTerritorialResidencia], 
                'NO' AS incapacidad,
                1 AS consecutivo, 
                pais2.País AS [codPaisOrigen], 
                eve.[Id Evaluación Entidad], 
                everips.[Id Tipo de Rips]
            FROM Entidad AS en
            LEFT JOIN [Tipo de Documento] AS tpd ON en.[Id Tipo de Documento] = tpd.[Id Tipo de Documento]
            LEFT JOIN [Evaluación Entidad] AS eve ON en.[Documento Entidad] = eve.[Documento Entidad]
            LEFT JOIN Empresa AS em ON eve.[Documento Empresa] = em.[Documento Empresa]
            INNER JOIN [Evaluación Entidad Rips] AS everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            INNER JOIN Factura AS fc ON everips.[Id Factura] = fc.[Id Factura]
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
            LEFT JOIN EmpresaV AS EmpV ON fc.[Id EmpresaV] = EmpV.[Id EmpresaV]
            WHERE CONVERT(DATE, eve.[Fecha Evaluación Entidad], 23) BETWEEN @fechaInicio AND @fechaFin
            AND eve.[Documento Empresa] = @documentoEmpresaSeleccionada
        `;

        const request = pool.request();
        request.input('fechaInicio', sql.Date, fechaInicio);
        request.input('fechaFin', sql.Date, fechaFin);
        request.input('documentoEmpresaSeleccionada', sql.VarChar, documentoEmpresaSeleccionada);

        const queryResult = await request.query(query);
        const resultData = queryResult.recordset;

        // Mapeo de resultados y procesamiento adicional
        const resultados = {};
        const facturasOriginales = [];

        resultData.forEach(row => {
            let numFactura = row['numFactura'];
            const originalNumFactura = numFactura;
            const idTipoRips = row['Id Tipo de Rips'];

            // Determina si se debe cambiar el numFactura a null
            if (numFactura === null || /000000/.test(numFactura)) {
                numFactura = null;
            }

            // Determina la clave de la factura
            let facturaKey;
            if (numFactura === null) {
                facturaKey = `null_${originalNumFactura}_${row['numDocumentoIdentificacion']}`;
            } else {
                facturaKey = numFactura;
            }

            if (!resultados[facturaKey]) {
                resultados[facturaKey] = {
                    numDocumentoIdObligado: row['NroIDPrestador'],
                    numFactura: numFactura,
                    numNota: row['numNota'],
                    tipoNota: row['tipoNota'],
                    usuarios: []
                };
            }

            const usuario = {
                tipoDocumentoIdentificacion: row['tipoDocumentoIdentificacion'],
                numDocumentoIdentificacion: row['numDocumentoIdentificacion'],
                tipoUsuario: row['tipoUsuario'],
                fechaNacimiento: row['fechaNacimiento'],
                codSexo: row['codSexo'],
                codPaisResidencia: row['codPaisResidencia'],
                codMunicipioResidencia: row['codMunicipioResidencia'],
                codZonaTerritorialResidencia: row['codZonaTerritorialResidencia'],
                incapacidad: row['incapacidad'],
                consecutivo: row['consecutivo'],
                codPaisOrigen: row['codPaisOrigen'],
                servicios: {
                    consultas: [],
                    procedimientos: []
                }
            };

            // Fusiona los servicios si ya existe el usuario
            const existingUser = resultados[facturaKey].usuarios.find(u => u.numDocumentoIdentificacion === usuario.numDocumentoIdentificacion);
            if (existingUser) {
                existingUser.servicios.consultas.push(...usuario.servicios.consultas);
                existingUser.servicios.procedimientos.push(...usuario.servicios.procedimientos);
            } else {
                resultados[facturaKey].usuarios.push(usuario);
            }

            facturasOriginales.push({ originalNumFactura, idTipoRips });
        });

        // Obtener servicios de consultas y procedimientos para cada usuario
        for (let facturaKey in resultados) {
            const consulta = resultados[facturaKey];
    
            // Buscar la factura en facturasOriginales
            const facturaData = facturasOriginales.find(f => `null_${f.originalNumFactura}_${consulta.usuarios[0].numDocumentoIdentificacion}` === facturaKey || f.originalNumFactura === facturaKey);
    
            if (facturaData) {
                const { originalNumFactura, idTipoRips } = facturaData;
    
                for (const usuario of consulta.usuarios) {
                    try {
                        const consultasResponse = await fetch(`http://localhost:3000/RIPS/servicios/rips/${originalNumFactura}/${usuario.numDocumentoIdentificacion}/${fechaInicio}/${fechaFin}/${ResolucionesRips}`);
                        const consultasData = await consultasResponse.json();
    
                        if (consultasData.length > 0) {
                            usuario.servicios.consultas.push(...consultasData);
                        } else {
                            delete usuario.servicios.consultas;
                        }
                    } catch (error) {
                        console.error('Error al obtener consultas:', error);
                    }
    
                    try {
                        const procedimientosResponse = await fetch(`http://localhost:3000/RIPS/serviciosAP/rips/${originalNumFactura}/${usuario.numDocumentoIdentificacion}/${fechaInicio}/${fechaFin}/${ResolucionesRips}`);
                        const procedimientosData = await procedimientosResponse.json();
    
                        if (procedimientosData.length > 0) {
                            usuario.servicios.procedimientos.push(...procedimientosData);
                        } else {
                            delete usuario.servicios.procedimientos;
                        }
                    } catch (error) {
                        console.error('Error al obtener procedimientos:', error);
                    }
                }
            } else {
                console.error(`Factura con clave ${facturaKey} no encontrada en facturasOriginales.`);
            }
        }

        res.json(Object.values(resultados));

    } catch (error) {
        console.error('Error inesperado:', error.message);
        res.status(500).send('Error inesperado');
    }
});

router.get('/servicios/rips/:numFactura/:numDocumentoIdentificacion/:fechaInicio/:fechaFin/:ResolucionesRips', async (req, res) => {
    const { numFactura, numDocumentoIdentificacion, fechaInicio, fechaFin, ResolucionesRips } = req.params;

    try {
        const pool = await poolPromise;

        const query = `
            SELECT 
                em2.[Código Empresa] AS codPrestador, 
                SUBSTRING(CONVERT(VARCHAR, eve.[Fecha Evaluación Entidad], 120), 1, 16) AS fechaInicioAtencion, 
                NULL AS numAutorizacion, everips.[Codigo RIPS] AS codConsulta,
                '01' AS modalidadGrupoServicioTecSal, '01' AS grupoServicios, '371' AS codServicio,
                fn.[Código Finalidad Consulta] AS finalidadTecnologiaSalud, ce.[Código Causa Externa] AS causaMotivoAtencion,
                everips.[Diagnostico Rips] AS codDiagnosticoPrincipal, 
                CASE WHEN everips.[Diagnostico Rips2] = 'Null' THEN NULL ELSE everips.[Diagnostico Rips2] END AS codDiagnosticoRelacionado1, 
                NULL AS codDiagnosticoRelacionado2, NULL AS codDiagnosticoRelacionado3, 
                tdp.[Código Tipo de Diagnóstico Principal] AS tipoDiagnosticoPrincipal,
                tp.[Tipo de Documento] AS tipoDocumentoIdentificacion, eve.[Documento Entidad] AS numDocumentoIdentificacion, 
                fc.[Total Factura] AS vrServicio, '05' AS tipoPagoModerador, '0' AS valorPagoModerador, 
                NULL AS numFEVPagoModerador, ROW_NUMBER() OVER (ORDER BY everips.[Id Evaluación Entidad RIPS]) AS consecutivo
            FROM 
                [Evaluación Entidad] AS eve
            INNER JOIN 
                [Evaluación Entidad Rips] AS everips ON eve.[Id Evaluación Entidad] = everips.[Id Evaluación Entidad]
            LEFT JOIN 
                Entidad ON eve.[Documento Entidad] = Entidad.[Documento Entidad]
            LEFT JOIN 
                [Tipo de Documento] AS tp ON Entidad.[Id Tipo de Documento] = tp.[Id Tipo de Documento]
            LEFT JOIN 
                Factura AS fc ON everips.[Id Factura] = fc.[Id Factura]
            LEFT JOIN 
                Empresa ON fc.[Documento Empresa] = Empresa.[Documento Empresa]
            LEFT JOIN 
                Empresa AS em2 ON eve.[Documento Empresa] = em2.[Documento Empresa]
            INNER JOIN 
                EmpresaV AS EmpV ON Empresa.[Documento Empresa] = EmpV.[Documento Empresa]
            LEFT JOIN 
                [Tipo de Diagnóstico Principal] AS tdp ON everips.[Id Tipo de Diagnóstico Principal] = tdp.[Id Tipo de Diagnóstico Principal]
            LEFT JOIN 
                [Finalidad Consulta] AS fn ON everips.[Id Finalidad Consulta] = fn.[Id Finalidad Consulta]
            LEFT JOIN 
                [Causa Externa] AS ce ON everips.[Id Causa Externa] = ce.[Id Causa Externa]
            WHERE 
                everips.[Id Acto Quirúrgico] = 1 
                AND EmpV.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] = @numFactura
                AND eve.[Documento Entidad] = @numDocumentoIdentificacion
                AND CONVERT(DATE, eve.[Fecha Evaluación Entidad]) BETWEEN @fechaInicio AND @fechaFin
                AND EmpV.[Resolución Facturación EmpresaV] = @ResolucionesRips
        `;

        const result = await pool.request()
            .input('numFactura', sql.VarChar, numFactura)
            .input('numDocumentoIdentificacion', sql.VarChar, numDocumentoIdentificacion)
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .input('ResolucionesRips', sql.VarChar, ResolucionesRips)
            .query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error en la consulta de servicios:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/serviciosAP/rips/:numFactura/:numDocumentoIdentificacion/:fechaInicio/:fechaFin/:ResolucionesRips', async (req, res) => {
    const { numFactura, numDocumentoIdentificacion, fechaInicio, fechaFin, ResolucionesRips } = req.params;

    try {
        const pool = await poolPromise;

        const query = `
            SELECT 
                em2.[Código Empresa] AS codPrestador, 
                SUBSTRING(CONVERT(VARCHAR, eve.[Fecha Evaluación Entidad], 120), 1, 16) AS fechaInicioAtencion, 
                NULL AS idMIPRES, 
                NULL AS numAutorizacion, 
                everips.[Codigo RIPS] AS codProcedimiento, 
                '01' AS viaIngresoServicioSalud, 
                '01' AS modalidadGrupoServicioTecSal, 
                '01' AS grupoServicios, 
                '371' AS codServicio, 
                fp.[Código Finalidad del Procedimiento] AS finalidadTecnologiaSalud, 
                tp.[Tipo de Documento] AS tipoDocumentoIdentificacion, 
                eve.[Documento Entidad] AS numDocumentoIdentificacion, 
                everips.[Diagnostico Rips] AS codDiagnosticoPrincipal, 
                CASE WHEN everips.[Diagnostico Rips2] = 'Null' THEN NULL ELSE everips.[Diagnostico Rips2] END AS codDiagnosticoRelacionado, 
                NULL AS codComplicacion, 
                fc.[Total Factura] AS vrServicio, 
                '05' AS tipoPagoModerador, 
                '0' AS valorPagoModerador, 
                NULL AS numFEVPagoModerador,  
                ROW_NUMBER() OVER (ORDER BY everips.[Id Evaluación Entidad RIPS]) AS consecutivo, 
                eve.[Id Evaluación Entidad]
            FROM  
                [Evaluación Entidad Rips] as everips
            INNER JOIN 
                [Evaluación Entidad] as eve ON everips.[Id Evaluación Entidad] = eve.[Id Evaluación Entidad]
            LEFT JOIN 
                [Finalidad del Procedimiento] as fp ON everips.[Id Causa Externa] = fp.[Id Finalidad del Procedimiento]
            LEFT JOIN 
                Entidad ON eve.[Documento Entidad] = Entidad.[Documento Entidad]
            LEFT JOIN 
                [Tipo de Documento] as tp ON Entidad.[Id Tipo de Documento] = tp.[Id Tipo de Documento]
            LEFT JOIN 
                Factura as fc ON fc.[Id Factura] = everips.[Id Factura]
            LEFT JOIN 
                Empresa ON fc.[Documento Empresa] = Empresa.[Documento Empresa]
            LEFT JOIN 
                Empresa as em2 ON eve.[Documento Empresa] = em2.[Documento Empresa]
            LEFT JOIN 
                EmpresaV as EmpV ON Empresa.[Documento Empresa] = EmpV.[Documento Empresa]
            WHERE 
                everips.[Id Acto Quirúrgico] <> 1 
                AND EmpV.[Prefijo Resolución Facturación EmpresaV] + fc.[No Factura] = @numFactura 
                AND eve.[Documento Entidad] = @numDocumentoIdentificacion
                AND CONVERT(DATE, eve.[Fecha Evaluación Entidad]) BETWEEN @fechaInicio AND @fechaFin
                AND EmpV.[Resolución Facturación EmpresaV] = @ResolucionesRips
        `;

        const result = await pool.request()
            .input('numFactura', sql.VarChar, numFactura)
            .input('numDocumentoIdentificacion', sql.VarChar, numDocumentoIdentificacion)
            .input('fechaInicio', sql.Date, fechaInicio)
            .input('fechaFin', sql.Date, fechaFin)
            .input('ResolucionesRips', sql.VarChar, ResolucionesRips)
            .query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error en la consulta de servicios:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

const descomprimirZip = async (rutaZips, rutaBaseDestino) => {
    try {
        for (const rutaZip of rutaZips) {
            const nombreArchivoZip = path.basename(rutaZip, '.zip');
            const rutaDestino = path.join(rutaBaseDestino, nombreArchivoZip);
            await fsExtra.ensureDir(rutaDestino);

            await new Promise((resolve, reject) => {
                yauzl.open(rutaZip, { lazyEntries: true }, (err, zipfile) => {
                    if (err) return reject(err);

                    zipfile.readEntry();

                    zipfile.on('entry', async (entry) => {
                        const filePath = path.join(rutaDestino, entry.fileName);

                        if (/\/$/.test(entry.fileName)) {
                            // Es un directorio
                            await fsExtra.ensureDir(filePath);
                            zipfile.readEntry();
                        } else {
                            // Es un archivo
                            zipfile.openReadStream(entry, async (err, readStream) => {
                                if (err) return reject(err);

                                // Asegura que el directorio exista
                                await fsExtra.ensureDir(path.dirname(filePath));

                                // Crea un stream de escritura
                                const writeStream = fs.createWriteStream(filePath);

                                // Utiliza pipeline para manejar el flujo de datos y errores
                                await pipelineAsync(readStream, writeStream);

                                zipfile.readEntry();
                            });
                        }
                    });

                    zipfile.on('end', () => {
                        console.log(`Se descomprimió el archivo => ${rutaZip} y se guardó en => ${rutaDestino}`);
                        resolve();
                    });

                    zipfile.on('error', (err) => {
                        console.error('Error al descomprimir:', err);
                        reject(err);
                    });
                });
            });
        }
    } catch (error) {
        console.error('Error durante el proceso de descompresión:', error);
    }
};

router.post('/generar-zip', async (req, res) => {
    // Extrae los parámetros de la URL
    const { fechaInicio, fechaFin, prefijo } = req.query;
    // Extrae `data` del cuerpo de la solicitud
    const data = req.body;
    console.log("Datos recibidos en /generar-zip:", data); // Imprime los datos recibidos
    // Cambia req.query por req.body si los datos vienen en el cuerpo de la petición
    const zip = new JSZip();

    // Agrupar por numFactura y combinar documentos
    const facturasAgrupadas = data.reduce((acc, consulta) => {
        const numFacturaConsulta = consulta.numFactura || 'SinFactura';
        if (!acc[numFacturaConsulta]) {
            acc[numFacturaConsulta] = [];
        }
        acc[numFacturaConsulta].push(consulta);
        return acc;
    }, {});

    // Generar archivos JSON combinados
    for (const [numFacturaConsulta, consultas] of Object.entries(facturasAgrupadas)) {
        if (numFacturaConsulta === 'SinFactura') {
            consultas.forEach((consulta, index) => {
                const documentos = consulta.usuarios ? consulta.usuarios.map(usuario => usuario.numDocumentoIdentificacion) : [];
                documentos.forEach((documento, docIndex) => {
                    const nombreArchivo = `${numFacturaConsulta}_${documento}_${docIndex + 1}.json`;
                    const contenidoJSON = JSON.stringify(consulta, null, 2); // Genera el JSON del objeto consulta en lugar de un array
                    zip.file(nombreArchivo, contenidoJSON);
                });
            });
        } else {
            const documentos = consultas.flatMap(consulta => consulta.usuarios ? consulta.usuarios.map(usuario => usuario.numDocumentoIdentificacion) : []);
            const nombreArchivoCombinado = `${numFacturaConsulta}_${documentos.join('_')}.json`;
            const contenidoJSONCombinado = JSON.stringify(consultas[0], null, 2); // Toma solo el primer elemento del array para generar el JSON
            zip.file(nombreArchivoCombinado, contenidoJSONCombinado);
        }
    }

    // Crear y enviar el archivo ZIP
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    const nombreArchivo = `${prefijo} --- ${fechaInicio} --- ${fechaFin}.zip`;
    const rutaArchivo = path.join('C:', 'CeereSio', 'RIPS_2275', 'ARCHIVOS_RIPS', nombreArchivo);
    const nombreCarpetaDeAlmacenadoJSON = `${fechaInicio} --- ${fechaFin}`;

    try {
        // Generar el archivo ZIP
        const content = await zip.generateAsync({ type: 'nodebuffer' });
        fs.writeFileSync(rutaArchivo, content);
        res.json({ mensaje: 'Archivo ZIP generado y almacenado', ruta: rutaArchivo });

        // Descomprimir los archivos ZIP
        const rutasZips = [rutaArchivo]; // Aquí se pueden agregar más rutas de archivos ZIP
        const rutaBaseDestino = path.join('C:', 'CeereSio', 'RIPS_2275', 'ARCHIVOS_RIPS_JSON');
        await descomprimirZip(rutasZips, rutaBaseDestino);

        // Crear carpeta para los XMLs
        const NombreArchivoIgualdadCarpetaParaXMLS = `${prefijo} --- ${fechaInicio} --- ${fechaFin}`;
        const IgualdadCarpetaParaXMLS = path.join('C:', 'CeereSio', 'RIPS_2275', 'XMLS', NombreArchivoIgualdadCarpetaParaXMLS);
        fs.mkdirSync(IgualdadCarpetaParaXMLS, { recursive: true });

    } catch (error) {
        console.error('Error al generar o almacenar el archivo ZIP:', error);
        res.status(500).send('Error interno al generar el archivo ZIP');
    }
});


export default router;
