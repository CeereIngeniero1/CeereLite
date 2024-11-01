import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function SelectRips({ apiEndpoint, placeholder, label, onValueChange, options }) {
    const [items, setItems] = useState([]);

    // Fetch data from API endpoint if apiEndpoint is provided
    const fetchData = async () => {
        if (apiEndpoint) {
            try {
                const response = await axios.get(apiEndpoint);
                setItems(response.data); // Ajusta según la estructura de los datos que recibes
                console.log('Datos de Servicios obtenidos:', response.data); // Ver los datos que llegan

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (apiEndpoint) {
                fetchData();
            } else if (options) {
                setItems(options); // Utiliza datos proporcionados externamente
            }
        }, 1000); // Retrasar la ejecución de fetchData por 2 segundos

        return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta antes de que termine el tiempo
    }, [apiEndpoint, options]);

    // Manejo del cambio de selección
    const handleChange = (event) => {
        onValueChange(event.target.value); // Extrae solo el valor seleccionado
    };

    return (
        <Select placeholder={placeholder} className="max-w-xs" label={label} onChange={handleChange}>
            {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                    {item.text}
                </SelectItem>
            ))}
        </Select>
    );
}
