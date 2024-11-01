import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import axios from "axios";
import { servidor } from '../../config/config'
import { port } from '../../config/config'

export default function TablaDisponibilidad({ fecha, profesional }) {
    const [disponibilidad, setDisponibilidad] = useState([]);

    // Función para obtener la disponibilidad desde el backend
    const fetchDisponibilidad = async () => {
        if (!fecha || !profesional) return; // Solo realiza la llamada si hay fecha y profesional seleccionados

        try {
            const response = await axios.get(`http://${servidor}:${port}/api/disponibilidad`, {
                params: { fecha, profesional }
            });
            console.log("Disponibilidad recibida:", response.data); // Agrega este log
            setDisponibilidad(response.data);
        } catch (error) {
            console.error("Error fetching disponibilidad:", error);
        }
    };

    useEffect(() => {
        fetchDisponibilidad();
    }, [fecha, profesional]); // Llama a la función cuando cambien la fecha o el profesional

    return (
        <Table removeWrapper aria-label="Disponibilidad del profesional">
            <TableHeader>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>HORA INICIO</TableColumn>
                <TableColumn>HORA FIN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
            </TableHeader>
            <TableBody>
                {disponibilidad.map((dispo, index) => (
                    <TableRow key={index}>
                        <TableCell>{dispo.fecha}</TableCell>
                        <TableCell>{dispo.horaInicio}</TableCell>
                        <TableCell>{dispo.horaFin}</TableCell>
                        <TableCell>Disponible</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
