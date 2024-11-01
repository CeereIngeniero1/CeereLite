import React, { useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { servidor, port } from './src/config/config';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, CheckboxGroupProvider } from "@nextui-org/react";
import { SelectFacturacion } from "./src/components/Facturacion/Select";
import { useEmpresa } from './src/config/EmpresaContext'

const Invoice = () => {
    const { empresaSeleccionada } = useEmpresa();
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5; // Cantidad de filas por página
    const [resolucion, setResolucion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, SetFechaFin] = useState('');

    // Estado para el ordenamiento
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' o 'desc'

    // Calcular el número de páginas totales
    const pages = Math.ceil(data.length / rowsPerPage);

    // Obtener los datos paginados
    const paginatedData = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    }, [page, data]);

    // Función para manejar el ordenamiento
    const handleSort = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        const sortedData = [...data].sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sortedData);
    };

    const handleLogin = async () => {
        try {
            // Mostrar el mensaje de carga antes de la solicitud
            Swal.fire({
                title: 'Generando token...',
                text: 'Por favor, espere.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.post(`http://${servidor}:${port}/api/Auth/LoginSISPRO`);

            if (response.status === 200) {
                setToken(response.data.token);

                // Cerrar el mensaje de carga y mostrar éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Token generado',
                    text: 'Su token ha sido generado correctamente',
                    confirmButtonColor: '#2c3e50',
                });
            }
        } catch (error) {
            // Cerrar el mensaje de carga y mostrar el error
            Swal.fire("Error", error.response?.data?.message || 'Error al generar token', "error");
        }
    };

    const handleSendData = async (row) => {
        const numDocumentoIdObligado = row.NroIDPrestador;
        const numFactura = row.numFactura;
        const numDocumentoIdentificacion = row['Documento Paciente'];
        const tipoDocumentoIdentificacion = row.tipoDocumentoIdentificacion;
        const tipoUsuario = row.tipoUsuario;
        const fechaNacimiento = row.fechaNacimiento;
        const codSexo = row.codSexo;
        const codPaisResidencia = row.codPaisResidencia;
        const codMunicipioResidencia = row.codMunicipioResidencia;
        const codZonaTerritorialResidencia = row.codZonaTerritorialResidencia;
        const incapacidad = row.incapacidad;
        const consecutivo = row.consecutivo;
        const codPaisOrigen = row.codPaisOrigen;
        const xmlFevFile = row.XML;

        try {

            // Mostrar el mensaje de carga antes de la solicitud
            Swal.fire({
                title: 'Enviando JSON...',
                text: 'Por favor, espere.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            let consultasData = null;
            let procedimientosData = null;

            // Obtener datos de consulta (AC)
            const consultaResponse = await axios.get(`http://${servidor}:${port}/api/ministerio/RipsAC/${numFactura}/${numDocumentoIdentificacion}`);
            if (consultaResponse.data.length > 0) {
                consultasData = consultaResponse.data[0]; // Asumiendo que solo hay un resultado
            }

            // Obtener datos de procedimiento (AP)
            const procedimientosResponse = await axios.get(`http://${servidor}:${port}/api/ministerio/RipsAP/${numFactura}/${numDocumentoIdentificacion}`);
            if (procedimientosResponse.data.length > 0) {
                procedimientosData = procedimientosResponse.data[0]; // Asumiendo que solo hay un resultado
            }

            // Estructura base del cuerpo del JSON
            const bodyData = {
                rips: {
                    numDocumentoIdObligado: numDocumentoIdObligado,
                    numFactura: numFactura,
                    numNota: null,
                    tipoNota: null,
                    usuarios: [
                        {
                            tipoDocumentoIdentificacion: tipoDocumentoIdentificacion,
                            numDocumentoIdentificacion: numDocumentoIdentificacion,
                            tipoUsuario: tipoUsuario,
                            fechaNacimiento: fechaNacimiento,
                            codSexo: codSexo,
                            codPaisResidencia: codPaisResidencia,
                            codMunicipioResidencia: codMunicipioResidencia,
                            codZonaTerritorialResidencia: codZonaTerritorialResidencia,
                            incapacidad: incapacidad,
                            consecutivo: consecutivo,
                            codPaisOrigen: codPaisOrigen,
                            servicios: {}
                        }
                    ]
                },
                xmlFevFile: "NULL" // Como mencionaste
            };

            // Solo agregar "consultas" si hay datos de consulta
            if (consultasData) {
                bodyData.rips.usuarios[0].servicios.consultas = [
                    {
                        codPrestador: consultasData.codPrestador,
                        fechaInicioAtencion: consultasData.fechaInicioAtencion,
                        numAutorizacion: consultasData.numAutorizacion,
                        codConsulta: consultasData.codConsulta,
                        modalidadGrupoServicioTecSal: consultasData.modalidadGrupoServicioTecSal,
                        grupoServicios: consultasData.grupoServicios,
                        // Verificar si codServicio es un valor válido antes de incluirlo
                        ...(consultasData.codServicio ? { codServicio: parseInt(consultasData.codServicio, 10) } : {}),
                        finalidadTecnologiaSalud: consultasData.finalidadTecnologiaSalud,
                        causaMotivoAtencion: consultasData.causaMotivoAtencion,
                        codDiagnosticoPrincipal: consultasData.codDiagnosticoPrincipal,
                        codDiagnosticoRelacionado1: consultasData.codDiagnosticoRelacionado1,
                        codDiagnosticoRelacionado2: consultasData.codDiagnosticoRelacionado2,
                        codDiagnosticoRelacionado3: consultasData.codDiagnosticoRelacionado3,
                        tipoDiagnosticoPrincipal: consultasData.tipoDiagnosticoPrincipal,
                        tipoDocumentoIdentificacion: consultasData.tipoDocumentoIdentificacion,
                        numDocumentoIdentificacion: consultasData.numDocumentoIdentificacion,
                        vrServicio: consultasData.vrServicio,
                        conceptoRecaudo: consultasData.tipoPagoModerador,
                        valorPagoModerador: consultasData.valorPagoModerador,
                        numFEVPagoModerador: consultasData.numFEVPagoModerador,
                        // Verificar si consecutivo es un valor válido antes de incluirlo
                        ...(consultasData.consecutivo ? { consecutivo: parseInt(consultasData.consecutivo, 10) } : {}),
                    }
                ];
            }

            // Solo agregar "procedimientos" si hay datos de procedimiento
            if (procedimientosData) {
                bodyData.rips.usuarios[0].servicios.procedimientos = [
                    {
                        codPrestador: procedimientosData.codPrestador,
                        fechaInicioAtencion: procedimientosData.fechaInicioAtencion,
                        idMIPRES: procedimientosData.idMIPRES,
                        numAutorizacion: procedimientosData.numAutorizacion,
                        codProcedimiento: procedimientosData.codProcedimiento,
                        viaIngresoServicioSalud: procedimientosData.viaIngresoServicioSalud,
                        modalidadGrupoServicioTecSal: procedimientosData.modalidadGrupoServicioTecSal,
                        grupoServicios: procedimientosData.grupoServicios,
                        // Verificar si codServicio es un valor válido antes de incluirlo
                        ...(procedimientosData.codServicio ? { codServicio: parseInt(procedimientosData.codServicio, 10) } : {}),
                        finalidadTecnologiaSalud: procedimientosData.finalidadTecnologiaSalud,
                        tipoDocumentoIdentificacion: procedimientosData.tipoDocumentoIdentificacion,
                        numDocumentoIdentificacion: procedimientosData.numDocumentoIdentificacion,
                        codDiagnosticoPrincipal: procedimientosData.codDiagnosticoPrincipal,
                        codDiagnosticoRelacionado: procedimientosData.codDiagnosticoRelacionado,
                        codComplicacion: procedimientosData.codComplicacion,
                        vrServicio: procedimientosData.vrServicio,
                        conceptoRecaudo: procedimientosData.tipoPagoModerador,
                        valorPagoModerador: procedimientosData.valorPagoModerador,
                        numFEVPagoModerador: procedimientosData.numFEVPagoModerador,
                        // Verificar si consecutivo es un valor válido antes de incluirlo
                        ...(procedimientosData.consecutivo ? { consecutivo: parseInt(procedimientosData.consecutivo, 10) } : {}),
                    }
                ];
            }

            // Enviar JSON a la API
            const response = await axios.post(`http://${servidor}:${port}/api/PaquetesFevRips/CargarFevRips`, {
                token,
                bodyData
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'JSON Y XML Enviados',
                    text: 'Su archivo ha sido enviado correctamente al ministerio.',
                    confirmButtonColor: '#2c3e50'
                });
            }
        } catch (error) {
            console.log("Error completo:", error);
            const errorResponse = error.response?.data || {};
            const mensajeError = typeof errorResponse === 'object' ? JSON.stringify(errorResponse) : errorResponse;

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${mensajeError}`,
                confirmButtonColor: '#2c3e50'
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/ministerio/consultar`, {
                params: {
                    docEmpresa: empresaSeleccionada.documentoEmpresa,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    const handleChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleVencimiento = (event) => {
        SetFechaFin(event.target.value)
    }

    const HandleConsultar = async () => {
        console.log(`La fecha inicio es: ${fechaInicio}`)
        console.log(`La fecha fin es: ${fechaFin}`)
        console.log(`La resolución es: ${resolucion}`)

        await fetchData();

    }

    return (
        <div className="h-[100vh] flex flex-col justify-between p-4">
            <div className="sec">
                <div className="flex justify-between items-center mb-4 gap-4">
                    {/* Contenedor de selects e inputs */}
                    <div className="flex items-center gap-4">
                        <div className="grid items-center gap-2">
                            <label className="text-gray-700 font-medium">Seleccionar Resolución:</label>
                            <SelectFacturacion
                                apiEndpoint={`http://${servidor}:${port}/api/facturacion/resolucion/${empresaSeleccionada.documentoEmpresa}`}
                                style="p-2 bg-[#fff] border border-gray-600 rounded 
                        2xl:w-[200px] 2xl:text-lg 2xl:h-[36px]
                        xl:w-[150px] xl:text-sm"
                                onValueChange={setResolucion}
                                defaultValue={resolucion}
                                showDefaultOption={false}
                            />
                        </div>
                        <div className="grid items-center gap-2">
                            <label className="text-gray-700 font-medium">Fecha Inicio:</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid items-center gap-2">
                            <label className="text-gray-700 font-medium">Fecha Fin:</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-md p-2"
                                onChange={handleVencimiento}
                            />
                        </div>
                        <div className="grid items-center gap-2">
                            <label className="text-gray-700 font-medium">.</label>
                            <button
                                className="py-2 px-4 rounded-md transition-colors bg-green-500 hover:bg-green-600 text-white"
                                onClick={HandleConsultar}
                            >
                                Consultar
                            </button>
                        </div>
                    </div>

                    {/* Botón Enviar Datos a la derecha */}
                    <div className="flex items-center gap-2">
                        <button
                            className="py-2 px-4 rounded-md transition-colors bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleLogin}
                        >

                            Generar token
                        </button>
                        <button
                            className="py-2 px-4 rounded-md transition-colors bg-green-500 hover:bg-green-600 text-white"
                        >
                            Enviar Datos
                        </button>
                    </div>

                </div>

                {/* Tabla NextUI */}
                <Table
                    aria-label="Tabla de productos"
                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn onClick={() => handleSort('Id')}>
                            Id {sortColumn === 'Id' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableColumn>
                        <TableColumn onClick={() => handleSort('Documento Paciente')}>
                            Documento Paciente {sortColumn === 'Documento Paciente' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableColumn>
                        <TableColumn onClick={() => handleSort('Nombre Paciente')}>
                            Nombre Paciente {sortColumn === 'Nombre Paciente' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableColumn>
                        <TableColumn onClick={() => handleSort('Fecha Atencion')}>
                            Fecha Atención {sortColumn === 'Fecha Atencion' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableColumn>
                        <TableColumn onClick={() => handleSort('No Factura')}>
                            No Factura {sortColumn === 'No Factura' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableColumn>
                        <TableColumn>Enviar</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.Id}</TableCell>
                                <TableCell>{row['Documento Paciente']}</TableCell>
                                <TableCell>{row['Nombre Paciente']}</TableCell>
                                <TableCell>{row['Fecha Atencion'].split('T')[0]}</TableCell>
                                <TableCell>{row['No Factura']}</TableCell>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        onClick={() => handleSendData(row)}
                                    >
                                        Enviar JSON
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Invoice;