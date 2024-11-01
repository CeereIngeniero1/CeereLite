import React, { useState } from "react";
import styled from 'styled-components';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { BotonesModals } from '../Navbar/Boton';
import SelectModal from '../Navbar/Select'
import { servidor, port } from '../../../config/config'
import { useEmpresa } from "../../../config/EmpresaContext";
import InputDate from "../Navbar/inputDate";
import Swal from "sweetalert2";
import axios from 'axios'
import { MensajeDeCarga } from '../../Alerts/MensajeDeCarga'


export function ModalJSON() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState('opaque');
    const [size, setSize] = React.useState('lg');
    const backdrops = ["blur"];
    const [resolucion, setResolucion] = useState("");
    const [textoResolucion, setTextoResolucion] = useState("");
    const { empresaSeleccionada } = useEmpresa();
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);

    // EXTRAER PREFIJO DE RESOLUCION
    let TextoPrefijo = "";
    const match = textoResolucion.match(/^[A-Za-z]+/);
    if (match) {
        TextoPrefijo = match[0];
    }

    // console.log(`El prefijo de la resolución es: ${TextoPrefijo}`);
    // console.log(`El texto de la resolución es: ${textoResolucion}`);
    // console.log(`El value de la resolución es: ${resolucion}`);

    const handleOpen = ({ backdrop = '', size = '' }) => {
        if (backdrop) {
            setBackdrop(backdrop);
        }
        if (size) {
            setSize(size);
        }
        onOpen();
    };



    const DescargarJSON = async () => {
        if (!empresaSeleccionada.documentoEmpresa || !resolucion || !fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de agendar la cita.',
                confirmButtonColor: '#2c3e50',
            });
            return;
        }

        if (fechaInicio >= fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha Invalida!',
                text: 'La Fecha de inicio debe ser menor que la fecha de fin.',
                confirmButtonColor: '#2c3e50',
            });
            return;
        }

        try {
            const response = await axios.get(`http://${servidor}:${port}/api/usuarios/rips`, {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    ResolucionesRips: resolucion,
                    documentoEmpresaSeleccionada: empresaSeleccionada.documentoEmpresa
                }
            });

            const data = response.data;
            console.log('Enviando datos al servidor para generar archivo ZIP...');
            console.log("Datos que se envían al servidor:", data);

            const zipResponse = await axios.post(`http://${servidor}:${port}/api/generar-zip`, data, {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    prefijo: TextoPrefijo
                }
            });

            const zipData = zipResponse.data;
            console.log('Archivo ZIP generado y almacenado en el servidor:', zipData);

            Swal.fire({
                icon: 'success',
                text: 'El archivo RIPS JSON se descargó correctamente',
                confirmButtonColor: '#2c3e50',
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Hubo un error al generar el archivo ZIP o al obtener los datos.',
                confirmButtonColor: '#2c3e50',

            });
            console.error('Error al obtener datos o generar ZIP:', error);
        }

    };


    const DescargarArchivosJSON = async () => {
        MensajeDeCarga("Descargando JSON...");
        // await Esperar(1000);
        DescargarJSON();
    }


    return (
        <Container>
            <div className="flex flex-wrap gap-3">
                {backdrops.map((b, index) => (
                    <BotonesModals
                        key={index}
                        onPress={() => handleOpen({ backdrop: b })}
                        className="capitalize"
                        nombreBoton="Descargar RIPS JSON"
                    />
                ))}
            </div>
            <Modal isDismissable={false} backdrop={backdrop} isOpen={isOpen} onClose={onClose} size={size} className="custom-modal">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Seleccione el rango de fechas en el que desea descargar los archivos RIPS-JSON</ModalHeader>
                            <ModalBody className="flex flex-col gap-1 !w-full mb-5">

                                <div className="resoluciones mx-auto w-[250px] mb-4">
                                    <SelectModal
                                        label="Seleccione una resolución"
                                        apiEndpoint={`http://${servidor}:${port}/api/mostrar-resoluciones-vigentes-segun-empresa-seleccionada/${empresaSeleccionada.documentoEmpresa}`}
                                        placeholder="Seleccione un profesional"
                                        onValueChange={setResolucion}
                                        onValueChangeText={setTextoResolucion}
                                    />
                                </div>

                                <div className="rango-fechas flex gap-[30px]">
                                    <InputDate onChange={setFechaInicio}
                                        labelFechaInicio='Fecha Inicio'
                                        descripcion='Fecha Inicio'
                                    />

                                    <InputDate onChange={setFechaFin}
                                        labelFechaInicio='Fecha Fin'
                                        descripcion='Fecha Fin'
                                    />
                                </div>

                            </ModalBody>
                            <ModalFooter className="mb-0">
                                <Button color="danger" variant="light" >
                                    Cerrar
                                </Button>
                                <Button color="primary" onClick={DescargarArchivosJSON}>
                                    Descargar JSON
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Container>
    );
}

const Container = styled.div`
  // Estilos de tu contenedor aquí
`;