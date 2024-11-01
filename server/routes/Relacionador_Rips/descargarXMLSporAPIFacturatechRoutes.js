import express from 'express';
import { sql, poolPromise } from '../../db.js';
import fs from 'fs';
import path from 'path';
import soap from 'soap'
const router = express.Router();

router.get('/mostrar-empresas-con-resoluciones-vigentes', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtener la conexión al pool de SQL Server

        const query = `
            SELECT
                Emp.[Nombre Comercial Empresa] AS NombreComercialEmpresa,
                Emp.[Documento Empresa] AS DocumentoEmpresa,
                EmpV.[Id EmpresaV] AS IdEmpresaV,
                EmpV.[Prefijo Resolución Facturación EmpresaV] + EmpV.[Resolución Facturación EmpresaV] AS ResolucionFacturacion
            FROM
                Empresa Emp
            INNER JOIN 
                EmpresaV EmpV ON Emp.[Documento Empresa] = EmpV.[Documento Empresa]
            WHERE 
                EmpV.[Id Estado] = 7
        `;

        const result = await pool.request().query(query); // Ejecutar la consulta

        res.json(result.recordset); // Devolver el resultado como JSON
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

router.get('/mostrar-resoluciones-vigentes-segun-empresa-seleccionada/:empresa', async (req, res) => {
    const EmpresaSeleccionadaPorElCliente = req.params.empresa;

    if (!EmpresaSeleccionadaPorElCliente) {
        return res.status(400).send('Debe seleccionar una empresa');
    }

    try {
        const pool = await poolPromise; // Obtener la conexión al pool de SQL Server

        const query = `
            SELECT 
                EmpV.[Resolución Facturación EmpresaV] as Resolucion,
                EmpV.[Prefijo Resolución Facturación EmpresaV] + EmpV.[Resolución Facturación EmpresaV] AS ResolucionVigente,
                EmpV.[Prefijo Resolución Facturación EmpresaV] AS PrefijoResolucionVigente
            FROM 
                EmpresaV EmpV
            INNER JOIN
                Empresa Emp ON EmpV.[Documento Empresa] = Emp.[Documento Empresa]
            WHERE
                EmpV.[Id Estado] = 7 AND EmpV.[Documento Empresa] = @EmpresaSeleccionada
        `;

        const result = await pool.request()
            .input('EmpresaSeleccionada', sql.NVarChar, EmpresaSeleccionadaPorElCliente) // Añadir el parámetro a la consulta
            .query(query);

        res.json(result.recordset); // Devolver el resultado como JSON
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

// router.post('/descargarxmls-api-facturatech/:prefijo/:fechainicial/:fechafinal', async (req, res) => {
//     const { prefijo, fechainicial, fechafinal } = req.params;
//     console.log(`Prefijo: ${prefijo}, Fecha Inicial: ${fechainicial}, Fecha Final: ${fechafinal}`);

//     try {
//         const pool = await poolPromise; // Obtener la conexión al pool de SQL Server

//         const query = `
//             SELECT 
//                 Fac.[No Factura] AS NoFactura, 
//                 CONVERT(VARCHAR, Fac.[Fecha Factura], 103) AS FechaFactura, 
//                 EmpV.[Prefijo Resolución Facturación EmpresaV] AS Prefijo
//             FROM 
//                 Factura Fac
//             INNER JOIN 
//                 EmpresaV EmpV ON Fac.[Id EmpresaV] = EmpV.[Id EmpresaV]
//             INNER JOIN 
//                 Empresa Emp ON EmpV.[Documento Empresa] = Emp.[Documento Empresa]
//             WHERE 
//                 EmpV.[Id Estado] = 7 AND
//                 Fac.EstadoFacturaElectronica = 1 AND
//                 CAST(Fac.[Fecha Factura] AS DATE) BETWEEN @FechaInicial AND @FechaFinal AND 
//                 EmpV.[Prefijo Resolución Facturación EmpresaV] = @Prefijo
//         `;

//         const facturas = [];
//         const result = await pool.request()
//             .input('Prefijo', sql.NVarChar, prefijo)
//             .input('FechaInicial', sql.Date, new Date(fechainicial))
//             .input('FechaFinal', sql.Date, new Date(fechafinal))
//             .query(query);

//         facturas.push(...result.recordset);

//         if (facturas.length === 0) {
//             return res.status(404).send('No se encontraron facturas');
//         }

//         let processedCount = 0;
//         const facturasWithPaths = [];

//         const processNextFactura = async (factura) => {
//             if (!factura) {
//                 if (facturasWithPaths.length > 0) {
//                     return res.status(200).json({ message: 'XMLS descargados con éxito', facturas: facturasWithPaths });
//                 } else {
//                     return res.status(200).json({ message: 'No se descargó ningún XML nuevo' });
//                 }
//             }

//             const carpetaPath = path.join('C:', 'CeereSio', 'RIPS_2275', 'XMLS', `${prefijo} --- ${fechainicial} --- ${fechafinal}`);
//             const filePath = path.join(carpetaPath, `${factura.Prefijo}${factura.NoFactura}.xml`);

//             if (fs.existsSync(filePath)) {
//                 console.log('El archivo XML ya existe:', filePath);
//                 processedCount++;
//                 processNextFactura(facturas[processedCount]);
//                 return;
//             }

//             const soapUrl = 'https://ws.facturatech.co/v2/pro/index.php?wsdl';
//             const args = {
//                 username: '890941638',
//                 password: 'd63e3771ae7cba422236949ea5826f984e8ea626331104a8a822c9a7333dc04e',
//                 prefijo: factura.Prefijo,
//                 folio: factura.NoFactura
//             };

//             soap.createClient(soapUrl, (err, client) => {
//                 if (err) {
//                     console.error('Error creating SOAP client:', err);
//                     processedCount++;
//                     processNextFactura(facturas[processedCount]);
//                     return;
//                 }

//                 client['SERVICES-FACTURATECH']['SERVICES-FACTURATECHPort']['FtechAction.downloadXMLFile'](args, (err, result) => {
//                     if (err) {
//                         console.error('Error calling FtechAction.downloadXMLFile:', err);
//                         processedCount++;
//                         processNextFactura(facturas[processedCount]);
//                         return;
//                     }

//                     if (result && result.return && result.return.resourceData && result.return.resourceData.$value) {
//                         const base64Data = result.return.resourceData.$value;
//                         const xmlData = Buffer.from(base64Data, 'base64').toString('utf8');

//                         fs.mkdirSync(carpetaPath, { recursive: true });

//                         fs.writeFile(filePath, xmlData, { encoding: 'utf8' }, (err) => {
//                             if (err) {
//                                 console.error('Error guardando archivo XML:', err);
//                                 processedCount++;
//                                 processNextFactura(facturas[processedCount]);
//                                 return;
//                             } else {
//                                 console.log('Archivo XML guardado exitosamente:', filePath);
//                                 factura.filePath = filePath;
//                                 facturasWithPaths.push(factura);
//                                 processedCount++;
//                                 processNextFactura(facturas[processedCount]);
//                             }
//                         });
//                     } else {
//                         console.log('No se recibió ningún dato válido del servicio.');
//                         processedCount++;
//                         processNextFactura(facturas[processedCount]);
//                     }
//                 });
//             });
//         };

//         processNextFactura(facturas[0]);
//     } catch (error) {
//         console.error('Error inesperado:', error);
//         res.status(500).send('Error inesperado');
//     }
// });

router.post('/descargarxmls-api-facturatech/:prefijo/:fechainicial/:fechafinal/:documentoempresa', async (req, res) => {
    const { prefijo, fechainicial, fechafinal, documentoempresa } = req.params;
    console.log(`Prefijo: ${prefijo}, Fecha Inicial: ${fechainicial}, Fecha Final: ${fechafinal}, Documento Empresa: ${documentoempresa}`);

    const ResultadoPeticionHTTP = `Prefijo: ${prefijo}, Fecha Inicial: ${fechainicial}, Fecha Final: ${fechafinal}, Documento Empresa: ${documentoempresa}`;
    // res.json(ResultadoPeticionHTTP.recordset); // Devolver el resultado como JSON

    // const resultado = {
    //     prefijo,
    //     fechainicial,
    //     fechafinal,
    //     documentoempresa
    // };
    
    // res.json(resultado);
    // return;
    try {
        const pool = await poolPromise; // Obtener la conexión al pool de SQL Server

        // Consulta de facturas
        const queryFacturas = `
            SELECT 
                Fac.[No Factura] AS NoFactura, 
                CONVERT(VARCHAR, Fac.[Fecha Factura], 103) AS FechaFactura, 
                EmpV.[Prefijo Resolución Facturación EmpresaV] AS Prefijo
            FROM 
                Factura Fac
            INNER JOIN 
                EmpresaV EmpV ON Fac.[Id EmpresaV] = EmpV.[Id EmpresaV]
            INNER JOIN 
                Empresa Emp ON EmpV.[Documento Empresa] = Emp.[Documento Empresa]
            WHERE 
                EmpV.[Id Estado] = 7 AND
                Fac.EstadoFacturaElectronica = 1 AND
                CAST(Fac.[Fecha Factura] AS DATE) BETWEEN @FechaInicial AND @FechaFinal AND 
                EmpV.[Prefijo Resolución Facturación EmpresaV] = @Prefijo AND
                EXISTS (SELECT 1 FROM [Evaluación Entidad Rips] RIPS WHERE RIPS.[Id Factura] = Fac.[Id Factura])
        `;

        const facturas = [];
        const resultFacturas = await pool.request()
            .input('Prefijo', sql.NVarChar, prefijo)
            .input('FechaInicial', sql.Date, new Date(fechainicial))
            .input('FechaFinal', sql.Date, new Date(fechafinal))
            .query(queryFacturas);

        facturas.push(...resultFacturas.recordset);

        if (facturas.length === 0) {
            return res.status(200).send({ message: 'No se encontraron facturas aptas en el rango de fechas ingresado.' });
        }

        // Consulta de credenciales
        const queryCredenciales = `
            SELECT 
                [Usuario], [Contrasena], [Documento Empresa], [URL SOAP] AS 'URLSOAP'
            FROM
                [CredencialesWSDLFacturaTech]
            WHERE
                [Documento Empresa] = @DocumentoEmpresa
        `;

        const ContenidoCredenciales = [];
        const resultCredenciales = await pool.request()
            .input('DocumentoEmpresa', sql.NVarChar, documentoempresa)
            .query(queryCredenciales);

        ContenidoCredenciales.push(...resultCredenciales.recordset);

        if (ContenidoCredenciales.length === 0) {
            return res.status(500).send({ message: 'No se encontraron credenciales de WSDL asociadas a la empresa de trabajo.' });
        }

        // Procesar facturas
        let processedCount = 0;
        const resultadosFinales = [];

        const processNextFactura = async (factura) => {
            if (!factura) {
                return res.status(200).json({
                    message: 'PROCESO FINALIZADO',
                    facturas: resultadosFinales,
                });
            }

            const RutaVerificarSiExisteElXML = path.join('C:', 'CeereSio', 'RIPS_2275', 'XMLS', `${prefijo} --- ${fechainicial} --- ${fechafinal}`, `${factura.Prefijo}${factura.NoFactura}.xml`);

            if (fs.existsSync(RutaVerificarSiExisteElXML)) {
                console.log('El archivo XML ya existe:', RutaVerificarSiExisteElXML);
                factura.estado = 'El archivo XML ya existe';
                factura.filePath = RutaVerificarSiExisteElXML;
                resultadosFinales.push(factura);
                processedCount++;
                processNextFactura(facturas[processedCount]);
                return;
            }

            let soapUrl = ContenidoCredenciales[0].URLSOAP || 'https://ws.facturatech.co/v2/pro/index.php?wsdl';

            const args = {
                username: ContenidoCredenciales[0].Usuario,
                password: ContenidoCredenciales[0].Contrasena,
                prefijo: factura.Prefijo,
                folio: factura.NoFactura
            };

            soap.createClient(soapUrl, async (err, client) => {
                if (err) {
                    console.error('Error creando el cliente SOAP:', err);
                    factura.estado = 'Error creando el cliente SOAP';
                    resultadosFinales.push(factura);
                    processedCount++;
                    processNextFactura(facturas[processedCount]);
                    return;
                }

                client['SERVICES-FACTURATECH']['SERVICES-FACTURATECHPort']['FtechAction.downloadXMLFile'](args, (err, result) => {
                    if (err) {
                        console.error('Error llamando a FtechAction.downloadXMLFile:', err);
                        factura.estado = 'Error en la llamada SOAP';
                        resultadosFinales.push(factura);
                        processedCount++;
                        processNextFactura(facturas[processedCount]);
                        return;
                    }

                    if (!result || !result.return) {
                        console.error('Respuesta del servicio incompleta o nula:', result);
                        factura.estado = 'Respuesta del servicio incompleta o nula';
                        resultadosFinales.push(factura);
                        processedCount++;
                        processNextFactura(facturas[processedCount]);
                        return;
                    }

                    const code = result.return.code.$value;
                    const error = result.return.error?.$value || '';

                    const NotificarProblemasConAPI = false;

                    if (code !== "201" && (error.toLowerCase().includes('password') || error.toLowerCase().includes('usuario'))) {
                        if (NotificarProblemasConAPI) {
                            console.error(`Error en la respuesta SOAP: Código ${code}, Error: ${error}`);
                        }
                        return res.status(200).send({ message: `Error en la respuesta SOAP: Código ${code}, Error: ${error}` });
                    }

                    if (code === "409" || error.toLowerCase().includes('no ha sido procesado')) {
                        factura.estado = error;
                    } else {
                        factura.estado = 'XML guardado exitosamente';
                    }

                    const resourceData = result.return.resourceData;

                    if (!resourceData || !resourceData.$value) {
                        console.log('No se recibió ningún dato válido del servicio.');
                        factura.estado = error;
                        resultadosFinales.push(factura);
                        processedCount++;
                        processNextFactura(facturas[processedCount]);
                        return;
                    }

                    try {
                        const base64Data = resourceData.$value;
                        const xmlData = Buffer.from(base64Data, 'base64').toString('utf8');
                        const carpetaPath = path.join('C:', 'CeereSio', 'RIPS_2275', 'XMLS', `${prefijo} --- ${fechainicial} --- ${fechafinal}`);
                        fs.mkdirSync(carpetaPath, { recursive: true });
                        const filePath = path.join(carpetaPath, `${args.prefijo}${args.folio}.xml`);

                        fs.writeFile(filePath, xmlData, { encoding: 'utf8' }, (err) => {
                            if (err) {
                                console.error('Error guardando archivo XML:', err);
                                factura.estado = 'Error guardando archivo XML';
                            } else {
                                console.log('Archivo XML guardado exitosamente:', filePath);
                                factura.filePath = filePath;
                                factura.estado = 'XML guardado exitosamente';
                            }
                            resultadosFinales.push(factura);
                            processedCount++;
                            processNextFactura(facturas[processedCount]);
                        });
                    } catch (error) {
                        console.error('Error procesando los datos recibidos:', error);
                        factura.estado = 'Error procesando los datos recibidos';
                        resultadosFinales.push(factura);
                        processedCount++;
                        processNextFactura(facturas[processedCount]);
                    }
                });
            });
        };

        processNextFactura(facturas[0]);
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).send('Error inesperado');
    }
});

export default router;