import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

export default function SelectsRegistroDeUsuario({
  apiEndpoint,
  placeholder,
  label,
  onChange,
  options = [], // Asegúrate de que options se pueda pasar
  value, // Añadido para controlar el valor seleccionado
  setValue, // Añadido para permitir que el componente controle el valor
  isRequired
}) {
  const [items, setItems] = useState([]);
  const OpcionPorDefecto = "SinSeleccionar";

  // Solo buscar datos de la API si no se pasan opciones
  const fetchData = async () => {
    if (!options.length && apiEndpoint) {
      try {
        const response = await axios.get(apiEndpoint);
        console.log("Datos recibidos:", response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  return (
    <Select
      isRequired={isRequired}
      variant="bordered"
      labelPlacement={"outside"}
      placeholder={placeholder}
      className="max-w-xs"
      label={label}
      // value={value} // Controla el valor seleccionado desde el estado padre
      // value={value || OpcionPorDefecto} // Controla el valor seleccionado desde el estado padre
      onChange={onChange} // Usar onChange
      defaultSelectedKeys={[OpcionPorDefecto]}
    >
      <SelectItem key={OpcionPorDefecto} value={OpcionPorDefecto}>
        Seleccionar
      </SelectItem>
      {/* Usar options si están disponibles, de lo contrario usar items */}
      {(options.length ? options : items).map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.text}
        </SelectItem>
      ))}
    </Select>
  );
}