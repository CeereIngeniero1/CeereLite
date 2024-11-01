import React, { useState } from "react";
import { TimeInput } from "@nextui-org/react";
import styled from "styled-components";

export default function InputTimeCita({ onHoraInicioChange, onHoraFinChange }) {
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');

    const handleHoraInicioChange = (value) => {
        setHoraInicio(value);
        onHoraInicioChange(value); // Pasa el valor al componente padre
    };

    const handleHoraFinChange = (value) => {
        setHoraFin(value);
        onHoraFinChange(value); // Pasa el valor al componente padre
    };

    return (
        <ContainerInputTime>
            <div className="flex-wrap gap-4">
                <TimeInput
                    label="Hora Inicio"
                    className="width-components"
                    value={horaInicio}
                    onChange={handleHoraInicioChange}
                />
                <br />
                <TimeInput
                    label="Hora Fin"
                    className="width-components"
                    value={horaFin}
                    onChange={handleHoraFinChange}
                />
            </div>
        </ContainerInputTime>
    );
}

const ContainerInputTime = styled.div`
    .width-components {
        width: 300px;
    }
`;
