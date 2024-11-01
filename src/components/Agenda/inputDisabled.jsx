import React, { useState, useEffect } from "react";
import { Input, Button, ButtonGroup } from "@nextui-org/react";
import styled from "styled-components"; 
import { ModalPacientesCita } from "./ModalPacientesCita";
import { useIdPacienteCita } from "../../config/IdPacienteCitasContext";

export default function InputDisabled({  onPacienteIdChange }) {

    
    // Estado para controlar el modal
    const [isOpen, setIsOpen] = useState(false);
    const { idPacienteCita } = useIdPacienteCita(); // Obtén el ID del paciente del contexto

    useEffect(() => {
        // Notificar al componente padre sobre el cambio de ID de paciente
        onPacienteIdChange(idPacienteCita);
    }, [idPacienteCita, onPacienteIdChange]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <Container>
            <Input
                value={idPacienteCita}
                isDisabled
                type="email"
                label="Paciente"
                placeholder="Documento Paciente"
                className="max-w-xs"
            />
            <ButtonGroup>
                <Button onPress={handleOpen}>...</Button>
            </ButtonGroup>

            <ModalPacientesCita isOpen={isOpen} onClose={handleClose} />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    gap: 5px;

    button {
        width: 5px;
    }
`;
