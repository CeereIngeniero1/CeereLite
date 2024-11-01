import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { servidor, port } from '../../../config/config';
import FormatoConShadowDOM from './FormatoConShadowDOM';

function Formatos({ onCollectAllData, datosEvolucion }, ref) {
    const [formatos, setFormatos] = useState([]);
    const [selectedFormato, setSelectedFormato] = useState('');
    const [contenido, setContenido] = useState('');
    const [loading, setLoading] = useState(false);
    const [formatoNoEncontrado, setFormatoNoEncontrado] = useState(false);
    const formRef = useRef(null);

    // Obtener lista de formatos al montar el componente
    useEffect(() => {
        axios.get(`http://${servidor}:${port}/api/evolucion/formatos/formatos`)
            .then(response => setFormatos(response.data))
            .catch(error => console.error('Error al obtener los formatos:', error));
    }, []);

    const handleSelectChange = async (e) => {
        const fileName = e.target.value;
        setSelectedFormato(fileName);
        setContenido('');
        setFormatoNoEncontrado(false); // Reiniciar el estado de error
        setLoading(true); // Mostrar estado de carga

        if (fileName) {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/evolucion/formatos/formatos/${fileName}`);
                setContenido(response.data);
                setFormatoNoEncontrado(false);
            } catch (error) {
                console.error('Error al cargar el formato:', error);
                setFormatoNoEncontrado(true); // Mostrar mensaje de error
                setContenido(''); // Limpiar el contenido
            } finally {
                setLoading(false); // Finalizar el estado de carga
            }
        } else {
            setContenido('');
            setFormatoNoEncontrado(false);
            setLoading(false);
        }
    };

    // Actualizar contenido cuando `datosEvolucion` cambia o `selectedFormato` se modifica
    useEffect(() => {
        if (datosEvolucion && datosEvolucion.contenidoFormato) {
            setContenido(datosEvolucion.contenidoFormato);
            setFormatoNoEncontrado(false);
        } else if (!selectedFormato) {
            setFormatoNoEncontrado(true);
            setContenido('');
        }
    }, [datosEvolucion, selectedFormato]);

// Cargar los valores de Diagnóstico Específico en los campos cuando el contenido o datosEvolucion se actualiza
useEffect(() => {
    if (datosEvolucion?.['Diagnostico especifico'] && formRef.current) {
        const diagnostico = datosEvolucion['Diagnostico especifico'].split('||');
        diagnostico.forEach(dato => {
            const [name, value, isChecked] = dato.split('|'); // Extrae el estado (True/False) del dato
            const field = formRef.current.querySelector(`[name="${name}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = isChecked === 'True'; // Marcar si el estado es 'True'
                } else {
                    field.value = value; // Para otros campos, simplemente establecer el valor
                }
            }
        });
    }
}, [contenido, datosEvolucion]); // Ejecutar cuando `contenido` o `datosEvolucion` cambie


    React.useImperativeHandle(ref, () => ({
        recolectarDatos: () => {
            if (formRef.current) {
                const inputs = formRef.current.querySelectorAll('input, select, textarea');
                const datosFormato = Array.from(inputs).map((input) => {
                    const inputName = input.getAttribute('name') || `T${Math.random().toString(36).substr(2, 9)}`;

                    // Revisar si es checkbox o radio y ajustar el valor según si está 'checked'
                    const isChecked = (input.type === 'checkbox' || input.type === 'radio') && input.checked;
                    const value = isChecked ? 'on' : input.value; // Usa 'on' si está checked, o el valor del input

                    // Devuelve el string en el formato requerido
                    return `${inputName}|${value}|${isChecked ? 'True' : 'False'}`; // Cambia False por True cuando está checked
                }).join('||');

                if (datosFormato && selectedFormato) {
                    // Añadir '||||||' al final de los datos recolectados
                    return { datos: `${datosFormato}||||||`, formato: selectedFormato };
                } else {
                    console.error('Datos o formato no válidos');
                    return null;
                }
            } else {
                console.error("No hay contenido de formato cargado.");
                return null;
            }
        }
    }));




    return (
        <div>
            <select
                value={selectedFormato}
                onChange={handleSelectChange}
                className="w-[40%] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-4"
            >
                <option value="">Seleccione un formato</option>
                {formatos.map(formato => (
                    <option key={formato} value={formato}>{formato}</option>
                ))}
            </select>

            <div className="max-h-[600px] overflow-y-auto border border-gray-200 p-4 rounded-lg shadow-sm">
                {loading ? (
                    <p>Cargando formato...</p>
                ) : formatoNoEncontrado ? (
                    <p>Formato no encontrado.</p>
                ) : contenido ? (
                    <FormatoConShadowDOM ref={formRef} htmlContent={contenido} />
                ) : (
                    <p>Seleccione un formato para mostrar su contenido.</p>
                )}
            </div>
        </div>
    );
}

export default React.forwardRef(Formatos);
