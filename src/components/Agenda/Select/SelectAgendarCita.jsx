import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function SelectCita({ apiEndpoint, placeholder, label, onValueChange }) {
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(apiEndpoint);
            setItems(response.data); // Ajusta según la estructura de los datos que recibes
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiEndpoint]);

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
