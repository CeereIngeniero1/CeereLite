import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import axios from 'axios';
import { servidor, port } from '../config/config';
import { useUsuario } from '../config/UsuarioContext';
import { useEmpresa } from '../config/EmpresaContext';

export function Home() {
    const { documentoEntidad, nombreUsuario } = useUsuario();
    const { setEmpresaSeleccionada, empresaSeleccionada } = useEmpresa();
    const [empresas, setEmpresas] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);


    // console.log(`El Documento del usuario que inició sesión es: ${documentoEntidad}`);
    // console.log(`El Nombre del usuario que inició sesión es: ${nombreUsuario}`);


    useEffect(() => {
        // Si ya existe una empresa seleccionada, no mostrar la alerta.
        if (empresaSeleccionada?.documentoEmpresa) {
            console.log(`Empresa seleccionada previamente: Documento = ${empresaSeleccionada.documentoEmpresa}, Nombre = ${empresaSeleccionada.nombreEmpresa}`);
            return; // Salir del useEffect si ya hay una empresa seleccionada
        }

        async function fetchEmpresas() {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/seleccionEmpresa`);
                const empresasData = response.data;
                setEmpresas(empresasData);

                Swal.fire({
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    icon: 'question',
                    title: '¿En qué empresa desea trabajar?',
                    html: ReactDOMServer.renderToStaticMarkup(
                        <select id="EmpresaATrabajar" className="swal2-input" style={{
                            border: '2px solid #2c3e50', // Color del borde
                            padding: '0.5rem', // Espaciado interno
                            borderRadius: '0.375rem', // Esquinas redondeadas
                            width: '100%' // Ajusta el ancho según sea necesario
                        }}>
                            <option value="">Seleccione una empresa</option>
                            {empresasData.map((empresa) => (
                                <option key={empresa.DocumentoEmpresa} value={empresa.DocumentoEmpresa}>
                                    {empresa.NombreComercialEmpresa}
                                </option>
                            ))}
                        </select>
                    ),
                    confirmButtonText: 'IR',
                    confirmButtonColor: '#2c3e50',
                    preConfirm: () => {
                        const empresaSeleccionada = document.getElementById('EmpresaATrabajar').value;
                        if (!empresaSeleccionada) {
                            Swal.showValidationMessage('Debe seleccionar una empresa');
                        }
                        return empresaSeleccionada;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const selectElement = document.getElementById('EmpresaATrabajar');
                        const documentoEmpresaSeleccionada = selectElement.value;
                        const nombreEmpresaSeleccionada = selectElement.options[selectElement.selectedIndex].text;

                        setEmpresaSeleccionada({ documentoEmpresa: documentoEmpresaSeleccionada, nombreEmpresa: nombreEmpresaSeleccionada });
                        sessionStorage.setItem("empresaTrabajarExecuted", documentoEmpresaSeleccionada);
                        sessionStorage.setItem("empresaTrabajarNombre", nombreEmpresaSeleccionada);

                        console.log(`Empresa seleccionada: Documento = ${documentoEmpresaSeleccionada}, Nombre = ${nombreEmpresaSeleccionada}`);
                    }
                });

            } catch (error) {
                console.error('Hubo un problema con la solicitud:', error);
            }
        }

        fetchEmpresas();
    }, [setEmpresaSeleccionada, empresaSeleccionada]);

    const docEmpresa = empresaSeleccionada.documentoEmpresa;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/get-image/${docEmpresa}`);
                const imageBase64 = response.data.image;
                if (imageBase64) {
                    setImageSrc(`data:image/jpeg;base64,${imageBase64}`); // Prepara la imagen en formato base64
                }
            } catch (err) {
                console.error('Error al obtener la imagen', err);
            }
        };

        fetchImage();
    }, [docEmpresa]);
    return (
        <div className="h-[100vh] p-8">
            <div>
                {imageSrc ? (
                    <img src={imageSrc} alt="Logo de Empresa" />
                ) : (
                    <p>No se pudo cargar la imagen.</p>

                )}

                    <h1>Home</h1>

            </div>
        </div>
    );
}


