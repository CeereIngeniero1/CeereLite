import { Input, DatePicker, Button, DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { useEmpresa } from "../../../config/EmpresaContext";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { servidor, port } from "../../../config/config";

export default function CrearResolucion({ onInsert }) {
    const { empresaSeleccionada } = useEmpresa();
    const [prefijo, setPrefijo] = useState('');
    const [resolucion, setResolucion] = useState('');
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState('');
    const [noInicio, setNoInicio] = useState('');
    const [noFin, setNoFin] = useState('');

    const formatFecha = (fecha) => {
        if (fecha && fecha.year && fecha.month && fecha.day) {
            const year = fecha.year;
            const month = String(fecha.month).padStart(2, '0'); // Añadir cero si es necesario
            const day = String(fecha.day).padStart(2, '0');
            return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
        }
        return null; // Retorna null si no hay fecha válida
    };

    const InsertarResolucion = async () => {
        console.log('Ingresando al insertar')

        const formattedFechaInicio = formatFecha(fechaInicio);
        const formattedFechaFin = formatFecha(fechaFin);
        // Intentar la inserción de la factura
        try {
            const response = await axios.post(`http://${servidor}:${port}/api/resolucion/insertarResolucion`, {
                docEmpresa: empresaSeleccionada.documentoEmpresa,
                prefijo: prefijo,
                resolucion: resolucion,
                fechaInicio: formattedFechaInicio,
                fechaFin: formattedFechaFin,
                noInicio: noInicio,
                noFin: noFin,
            });

            // Si la inserción es exitosa
            Swal.fire({
                icon: 'success',
                title: 'Resolución creada',
                text: 'La resolución ha sido creada exitosamente.',
                confirmButtonColor: '#2c3e50'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Resolución creada exitosamente", response.data);
                    if (onInsert) onInsert();
                }
            });

        } catch (error) {
            // Si hay un error en la inserción
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al crear la resolución. Inténtelo nuevamente.',
            });

            console.error('Error al crear la resolución:', error);
        }
    }


    return (
        <div className="shadow-md mb-7 p-4 rounded-2xl mt-4">
            <span>Crear Resolución</span>
            <div className="flex flex-wrap gap-4 mb-3">
                <Input
                    type="text"
                    label="Prefijo"
                    placeholder="Ingrese el Prefijo"
                    className="w-full md:w-[130px]"
                    onChange={(event) => setPrefijo(event.target.value)}
                />

                <Input
                    type="text"
                    label="Número de resolución"
                    placeholder="Ingrese el número de resolución"
                    className="w-full md:w-[230px]"
                    onChange={(event) => setResolucion(event.target.value)}
                />

                <DatePicker
                    label={"Fecha Inicio Resolucion"}
                    placeholderValue={new CalendarDate(1995, 11, 6)}
                    className="w-full md:w-[200px]"
                    onChange={setFechaInicio}
                    isRequired
                />

                <DatePicker
                    label={"Fecha Fin Resolucion"}
                    placeholderValue={new CalendarDate(1995, 11, 6)}
                    className="w-full md:w-[200px]"
                    onChange={setFechaFin}
                    isRequired
                />

                <Input
                    type="text"
                    label="Número Inicio Resolución"
                    placeholder="Ingrese el número de Inicio"
                    className="w-full md:w-[200px]"
                    onChange={(event) => setNoInicio(event.target.value)}
                />

                <Input
                    type="text"
                    label="Número Fin Resolución"
                    placeholder="Ingrese el número de Fin"
                    className="w-full md:w-[200px]"
                    onChange={(event) => setNoFin(event.target.value)}
                />
            </div>

            <Button color="success" onPress={InsertarResolucion}>
                Agregar resolución
            </Button>
        </div>
    );
}
