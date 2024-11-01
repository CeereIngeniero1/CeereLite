import React, { useState } from "react";
import styled from 'styled-components';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { BtnAsignarCita } from "./btnAsignarCita";
import SelectCita from './Select/SelectAgendarCita';
import { servidor } from '../../config/config';
import { port } from '../../config/config';
import { useEmpresa } from "../../config/EmpresaContext";
import InputDisabled from "./inputDisabled";
import InputDateCita from "./inputDateCita";
import InputTimeCita from "./InputTimeCita";
import TextAreaCita from "./TextAreaCita";
import axios from "axios";
import Swal from "sweetalert2";
import TablaDisponibilidad from "./TablaDisponibilidad";


export function ModalAgendarCita({ onAddCita }) { // Acepta la prop onAddCita

    const { empresaSeleccionada } = useEmpresa();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState('opaque');
    const [size, setSize] = React.useState('5xl');
    const backdrops = ["blur"];
    const [scrollBehavior, setScrollBehavior] = useState("inside");


    const handleOpen = ({ backdrop = '', size = '' }) => {
        if (backdrop) {
            setBackdrop(backdrop);
        }
        if (size) {
            setSize(size);
        }
        onOpen();
    };

    // Estados para capturar los valores de los componentes
    const [fechaCompromiso, setFechaCompromiso] = useState(null);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [asunto, setAsunto] = useState("");
    const [profesional, setProfesional] = useState("");
    const [tipoAtencion, setTipoAtencion] = useState("");
    const [pacienteId, setPacienteId] = useState(""); // Estado para almacenar el ID del paciente

    const docEmpresa = empresaSeleccionada.documentoEmpresa;

    const handleAgendarCompromiso = async () => {
        if (!fechaCompromiso || !horaInicio || !horaFin || !asunto || !profesional || !tipoAtencion || !pacienteId) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de agendar la cita.',
                confirmButtonColor: '#2c3e50',
            });
            return;
        }

        const horaInicioTotal = horaInicio.hour * 60 + horaInicio.minute;
        const horaFinTotal = horaFin.hour * 60 + horaFin.minute;

        if (horaInicioTotal >= horaFinTotal) {
            Swal.fire({
                icon: 'warning',
                title: 'Hora inválida',
                text: 'La hora de inicio debe ser menor que la hora de fin.',
                confirmButtonColor: '#2c3e50',
            });
            return;
        }

        try {
            // Verificar disponibilidad del horario
            const responseDisponibilidad = await axios.get(`http://${servidor}:${port}/api/agenda/compromisoDisponible`, {
                params: {
                    fecha: fechaCompromiso,
                    profesional,
                    horaInicio: `${horaInicio.hour.toString().padStart(2, '0')}:${horaInicio.minute.toString().padStart(2, '0')}`,
                    horaFin: `${horaFin.hour.toString().padStart(2, '0')}:${horaFin.minute.toString().padStart(2, '0')}`
                }
            });

            if (!responseDisponibilidad.data.disponible) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Horario ocupado',
                    text: 'El profesional ya tiene una cita asignada en ese horario.',
                    confirmButtonColor: '#2c3e50',
                });
                return;
            }

            // Insertar la cita si el horario está disponible
            const data = {
                fechaCompromiso,
                horaInicio,
                horaFin,
                asunto,
                profesional,
                tipoAtencion,
                pacienteId,
                docEmpresa
            };

            const response = await axios.post(`http://${servidor}:${port}/api/insertarCompromiso`, data);

            Swal.fire({
                icon: 'success',
                title: 'Cita agendada correctamente',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // Restablecer los valores de los componentes
                setFechaCompromiso(null);
                setHoraInicio('');
                setHoraFin('');
                setAsunto('');
                setProfesional('');
                setTipoAtencion('');
                setPacienteId('');

                // Llama a la función onAddCita para actualizar el calendario
                const nuevaCita = {
                    id: response.data.id,  // Asume que el servidor devuelve el ID de la nueva cita
                    title: asunto,
                    start: new Date(fechaCompromiso + 'T' + horaInicio.hour + ':' + horaInicio.minute),
                    end: new Date(fechaCompromiso + 'T' + horaFin.hour + ':' + horaFin.minute),
                    doc: pacienteId
                };
                onAddCita(nuevaCita); // Agrega la cita al calendario

                onClose(); // Cierra el modal después de que desaparezca el alert
            });
        } catch (error) {
            console.error("Error al agendar el compromiso:", error);

            Swal.fire({
                icon: 'error',
                title: 'Error al agendar el compromiso',
                text: 'Por favor, intenta de nuevo.',
                confirmButtonColor: '#2c3e50',
            });
        }
    };


    return (
        <Container>
            <div className="flex flex-wrap gap-3">
                {backdrops.map((b, index) => (
                    <BtnAsignarCita
                        key={index}
                        onPress={() => handleOpen({ backdrop: b })}
                        className="capitalize" />
                ))}
            </div>
            <Modal isDismissable={false} backdrop={backdrop} isOpen={isOpen} onClose={onClose} size={size} className="custom-modal" scrollBehavior={scrollBehavior}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Agendar Compromiso</ModalHeader>
                            <ModalBody className="flex flex-col gap-1 !w-full">

                                <div className="modal-body flex !w-full">
                                    <div className="info-compromiso w-1/2">
                                        <SelectCita
                                            label="Seleccione un profesional"
                                            apiEndpoint={`http://${servidor}:${port}/api/agenda/profesionales`}
                                            placeholder="Seleccione un profesional"
                                            onValueChange={setProfesional}
                                        />
                                        <br />
                                        <br />
                                        <InputDisabled onPacienteIdChange={setPacienteId} /> {/* Capturar el ID del paciente */}
                                        <br />
                                        <InputDateCita onChange={setFechaCompromiso} />
                                        <br />
                                        <InputTimeCita
                                            onHoraInicioChange={setHoraInicio}
                                            onHoraFinChange={setHoraFin}
                                        />
                                        <br />
                                        <TextAreaCita onValueChange={setAsunto} />
                                        <br />
                                        <SelectCita
                                            label="Seleccionar Tipo/Atención"
                                            apiEndpoint={`http://${servidor}:${port}/api/agenda/tipoAtencion`}
                                            placeholder="Seleccionar tipo de cita"
                                            onValueChange={setTipoAtencion} // Captura el valor del tipo de atención
                                        />
                                    </div>

                                    <div className="tabla-disponibilidad w-1/2 overflow-auto max-h-[500px]">
                                        <TablaDisponibilidad fecha={fechaCompromiso} profesional={profesional} />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" onPress={handleAgendarCompromiso}>
                                    Agendar compromiso
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
    .custom-modal {
        background-color: black !important;
    }

    .modal-body {
        width: 100% !important;
        display: flex !important;
        flex-direction: row !important;  /* Asegúrate de que se aplique flex-direction */
    }

    .info-compromiso {
        width: 50% !important;
    }

    .tabla-disponibilidad {
        width: 50% !important;
    }
    
    #modal-body {
        display: flex;
    }
`;

