import { useState, useEffect } from "react";
import axios from "axios";

export function SelectFacturacion({ apiEndpoint, style, onValueChange, onOptionSelect, options, defaultValue, showDefaultOption = true }) {
    const [items, setItems] = useState([]);
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    // Fetch data when component mounts or apiEndpoint changes
    const fetchData = async () => {
        if (apiEndpoint) {
            try {
                const response = await axios.get(apiEndpoint);
                setItems(response.data);

                // Si existe un valor por defecto, se selecciona
                if (defaultValue && response.data.length > 0) {
                    setSelectedValue(defaultValue);
                    if (onValueChange) {
                        onValueChange(defaultValue); // Notifica al componente padre con el valor por defecto
                    }
                } else if (!showDefaultOption && response.data.length > 0) {
                    // Si no hay "Seleccionar opción" y no hay defaultValue, selecciona el primer valor
                    const firstItemValue = response.data[0].value;
                    setSelectedValue(firstItemValue);
                    if (onValueChange) {
                        onValueChange(firstItemValue); // Notifica al componente padre con el primer valor
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        if (apiEndpoint) {
            fetchData();
        } else if (options) {
            setItems(options);
            if (options.length > 0) {
                setSelectedValue(defaultValue || (showDefaultOption ? "" : options[0].value));
                if (onValueChange) {
                    onValueChange(defaultValue || (showDefaultOption ? "" : options[0].value));
                }
            }
        }
    }, [apiEndpoint, options]);

    // Si el valor por defecto cambia después de la carga inicial
    useEffect(() => {
        if (defaultValue && items.length > 0 && selectedValue === "") {
            setSelectedValue(defaultValue);
            if (onValueChange) {
                onValueChange(defaultValue);
            }
        }
    }, [defaultValue, items]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);

        const selectedOption = items.find(item => item.value === newValue);

        if (selectedOption && onOptionSelect) {
            onOptionSelect({
                value: selectedOption.value,
                text: selectedOption.text,
                precio: selectedOption.precio
            });
        } else if (onValueChange) {
            onValueChange(newValue); // Notifica el valor cambiado
        }
    };

    return (
        <select className={style} value={selectedValue} onChange={handleChange}>
            {/* Mostrar la opción "Seleccionar opción" solo si showDefaultOption es true */}
            {showDefaultOption && <option value="">Seleccionar opción</option>}
            {items.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.text}
                </option>
            ))}
        </select>
    );
}
