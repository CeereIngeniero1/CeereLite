import React from "react";
import { Textarea } from "@nextui-org/react";

export default function TextAreaCita({ onValueChange }) {
    const handleChange = (event) => {
        onValueChange(event.target.value); // Asegúrate de pasar solo el valor del evento
    };

    return (
        <Textarea
            label="Asunto"
            placeholder="Ingrese el asunto del compromiso"
            className="max-w-xs"
            onChange={handleChange}
        />
    );
}
