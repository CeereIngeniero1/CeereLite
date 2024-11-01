import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import SelectRips from "./SelectRips";
import axios from "axios"; // Para hacer las peticiones HTTP
import { servidor, port } from "../../config/config";
import Swal from 'sweetalert2';
import InputRips from './InputRips'

export function ModalConfigRips() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = useState('opaque');
    const [size, setSize] = useState('5xl');

    const [insertDisabled, setInsertDisabled] = useState(false);


    // Estados de los Select's
    const [tipoRips, setTipoRips] = useState('');
    const [entidad, setEntidad] = useState('');
    const [modalidadAtencion, setModalidadAtencion] = useState('');
    const [grupoServicios, setGrupoServicios] = useState('');
    const [servicios, setServicios] = useState('');
    const [finalidadConsulta, setFinalidadConsulta] = useState('');
    const [finalidadProcedimiento, setFinalidadProcedimiento] = useState('');
    const [causaExterna, setCausaExterna] = useState('');
    const [tipoDiag, setTipoDiag] = useState('');
    const [viaIngreso, setViaIngreso] = useState('');
    const [entidades, setEntidades] = useState([]);
    const [codigoProcedimiento, setCodigoProcedimiento] = useState('');
    const [codigoDiagnostico, setCodigoDiagnostico] = useState('');


    const tipoRipsMap = {
        '1': '1',
        '2': '17',
        '3': '24',
        '4': '23'
    };

    const codigoTipoRips = tipoRipsMap[tipoRips];

    useEffect(() => {
        // Función para obtener las entidades desde la API
        const fetchEntidades = async () => {
            if (tipoRips) {
                const codigoTipoRips = tipoRipsMap[tipoRips];
                try {
                    const response = await axios.get(`http://${servidor}:${port}/api/Rips/tipoEntidad/${codigoTipoRips}`);
                    console.log(`El codigo rips enviado es: ${codigoTipoRips}`)
                    setEntidades(response.data);
                } catch (error) {
                    console.error('Error al obtener las entidades:', error);
                }
            }
        };

        fetchEntidades();
    }, [tipoRips]);

    // useEffect para verificar si ya existe un registro cuando se abre el modal
    const checkIfExists = async () => {
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/rips/exists`);
            console.log("Valor de exists:", response.data.exists); // Log para verificar el valor recibido
            if (response.data.exists !== undefined) {
                setInsertDisabled(response.data.exists);
            } else {
                setInsertDisabled(false); // Habilita el botón si no hay datos
            }
        } catch (error) {
            console.error('Error al verificar la existencia del registro:', error);
            setInsertDisabled(false); // En caso de error, habilita el botón
        }
    };

    const handleOpen = async ({ backdrop = '', size = '' }) => {
        if (backdrop) setBackdrop(backdrop);
        if (size) setSize(size);
        onOpen(); // Abrir el modal después de la verificación
        checkIfExists();

    };

    const handleInsert = async () => {
        try {
            const response = await axios.post(`http://${servidor}:${port}/api/rips/insert`, {
                tipoRips, entidad, modalidadAtencion, grupoServicios, servicios, finalidadConsulta, finalidadProcedimiento, causaExterna, tipoDiag, viaIngreso, codigoProcedimiento, codigoDiagnostico
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro insertado correctamente!",
                showConfirmButton: false,
                timer: 1500
            });

            console.log('Registro insertado:', response.data);
        } catch (error) {
            console.error('Error al insertar:', error);

            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al insertar el registro!",
                text: error.message,
                showConfirmButton: true
            });
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://${servidor}:${port}/api/rips/update`, {
                tipoRips, entidad, modalidadAtencion, grupoServicios, servicios, finalidadConsulta, finalidadProcedimiento, causaExterna, tipoDiag, viaIngreso, codigoProcedimiento, codigoDiagnostico
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Rips actualizados correctamente!",
                showConfirmButton: false,
                timer: 1500
            });

            console.log('Registro actualizado:', response.data);
        } catch (error) {
            console.error('Error al actualizar:', error);

            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al actualizar los Rips!",
                text: error.message,
                showConfirmButton: true
            });
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://${servidor}:${port}/api/rips/delete`, {
                data: { tipoRips }
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro eliminado correctamente!",
                showConfirmButton: false,
                timer: 1500
            });

            console.log('Registro eliminado:', response.data);
        } catch (error) {
            console.error('Error al eliminar:', error);

            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al eliminar el registro!",
                text: error.message,
                showConfirmButton: true
            });
        }
    };


    return (
        <Container>
            <div className="flex justify-center items-center mt-3">
                <Button onClick={() => handleOpen({ backdrop: 'blur' })} color="success">
                    Configurar Rips Defectos
                </Button>
            </div>
            <Modal isDismissable={false} backdrop={backdrop} isOpen={isOpen} onClose={onClose} size={size}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader>Seleccione los rips que desea tener por defecto al cargar la HC</ModalHeader>
                            <ModalBody>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/tipoRips`}
                                        label="Tipo Rips"
                                        placeholder="Seleccione un tipo de rips"
                                        onValueChange={setTipoRips}
                                    />
                                    <SelectRips
                                        label="Entidad"
                                        placeholder="Seleccione una entidad"
                                        options={entidades} // Pasar las entidades obtenidas desde la API
                                        onValueChange={setEntidad}

                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/modalidadAtencion`}
                                        label="Modalidad atención"
                                        placeholder="Seleccione una modalidad de atención"
                                        onValueChange={setModalidadAtencion}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/grupoServicios`}
                                        label="Grupo Servicios"
                                        placeholder="Seleccione un Grupo de servicio"
                                        onValueChange={setGrupoServicios}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/Servicios`}
                                        label="Servicio"
                                        placeholder="Seleccione un servicio"
                                        onValueChange={setServicios}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/finalidadConsulta`}
                                        label="Finalidad Consulta"
                                        placeholder="Seleccione finalidad consulta"
                                        onValueChange={setFinalidadConsulta}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/finalidadProcedimiento`}
                                        label="Finalidad del Procedimiento"
                                        placeholder="Seleccione finalidad del procedimiento"
                                        onValueChange={setFinalidadProcedimiento}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/causaExterna`}
                                        label="Causa Externa"
                                        placeholder="Seleccione una causa externa"
                                        onValueChange={setCausaExterna}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/tipoDiagnostico`}
                                        label="Tipo Diagnóstico Principal"
                                        placeholder="Seleccione un tipo de diagnóstico"
                                        onValueChange={setTipoDiag}
                                    />
                                    <SelectRips
                                        apiEndpoint={`http://${servidor}:${port}/api/Rips/viaIngresoUsuario`}
                                        label="Via de Ingreso"
                                        placeholder="Seleccione una via de ingreso"
                                        onValueChange={setViaIngreso}
                                    />
                                    <InputRips
                                        label="Código procedimiento"
                                        placeholder="Codigo de procedimiento o consulta"
                                        value={codigoProcedimiento}
                                        onChange={(e) => setCodigoProcedimiento(e.target.value)}
                                    />
                                    <InputRips
                                        label="Código diagnóstico"
                                        placeholder="Codigo de diagnóstico"
                                        value={codigoDiagnostico}
                                        onChange={(e) => setCodigoDiagnostico(e.target.value)} 
                                    />

                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={onClose}>Cerrar</Button>
                                <Button color="primary" onClick={handleInsert} isDisabled={insertDisabled}>
                                    Insertar
                                </Button>
                                <Button color="secondary" onClick={handleUpdate}>Actualizar</Button>
                                <Button color="danger" onClick={handleDelete}>Eliminar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Container>
    );
}

const Container = styled.div`
  // Estilos personalizados
`;
