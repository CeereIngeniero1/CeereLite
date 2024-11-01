import React from "react";
import styled from 'styled-components';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { TablaPacientes } from "./TablaPacientes/TablaPacientes";


export function ModalPacientesCita({ isOpen, onClose }) {
    const [backdrop, setBackdrop] = React.useState('opaque');
    const [size, setSize] = React.useState('5xl');

    return (
        <Container>
            <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size={size}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Pacientes Ingresados</ModalHeader>
                        <ModalBody>
                            <div className="info-compromiso">
                                <TablaPacientes onClose={onClose} /> {/* Pasar onClose */}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </Container>
    );
}

const Container = styled.div`
    // Estilos de tu contenedor aquí
`;
