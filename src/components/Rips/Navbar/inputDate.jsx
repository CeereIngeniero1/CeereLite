import React, { useState } from "react";
import { DatePicker } from "@nextui-org/react";

export default function InputDate({ onChange, labelFechaInicio, descripcion }) {
    const [fecha, setFecha] = useState(null);

    const handleDateChange = (newDate) => {
        setFecha(newDate); // Actualiza el estado local
        onChange(newDate); // Pasa el valor al componente padre
    };

    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <DatePicker
                label={labelFechaInicio}
                className="max-w-[284px] w-[180px]"
                description={descripcion}
                value={fecha} // Vincula el valor del estado
                onChange={handleDateChange} // Maneja el cambio de fecha
            />
        </div>
    );
}
