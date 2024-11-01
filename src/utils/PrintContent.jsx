import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { servidor } from '../config/config'
import { port } from '../config/config';
import { useEmpresa } from '../config/EmpresaContext'
import axios from 'axios';


const PrintContent = ({ data }) => {

    const { empresaSeleccionada } = useEmpresa();


    const [datosEmpresa, setDatosEmpresa] = useState({
        nombre: '',
        identificacion: '',
        direccion: '',
        telefono: '',
        correo: '',
    });

    // Fecha en formato ISO 8601
    const fechaOriginal = data.fechaHora;

    // Convertir la cadena a un objeto Date
    const fecha = new Date(fechaOriginal);

    // Configuración para mostrar la fecha en formato personalizado
    const opcionesFecha = {
        weekday: 'long', // Nombre completo del día
        year: 'numeric', // Año con 4 dígitos
        month: 'long', // Nombre completo del mes
        day: 'numeric', // Día del mes
    };

    const opcionesHora = {
        hour: 'numeric', // Hora en formato 12 horas
        minute: 'numeric', // Minutos
        hour12: true, // Formato AM/PM
    };

    // Convertir la fecha al formato deseado
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    // Combinar fecha y hora
    const fechaHoraFormateada = `${fechaFormateada} - ${horaFormateada}`;


    // useEffect(() => {

    //     const fetchEmpresa = async () => {
    //         try {
    //             const response = await fetch(`http://${servidor}:${port}/api/empresa`);
    //             if (!response.ok) {
    //                 throw new Error('Error al cargar la información de la empresa');
    //             }
    //             const data = await response.json();
    //             setDatosEmpresa(data[0]);

    //         } catch (error) {
    //             console.error('Error fetching evaluation data:', error);
    //             SweetAlert2.fire('Error', error.message, 'error');
    //         }
    //     };

    //     fetchEmpresa();
    // }, []);

    // Obtener el prefijo y número de factura desde el servidor
    
    
    useEffect(() => {
        const infoEmpresa = async () => {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/empresa`, {
                    params: {
                        docEmpresa: empresaSeleccionada.documentoEmpresa
                    }
                });
    
                if (response.data.length > 0) {
                    setDatosEmpresa(response.data[0]);
                    console.log('La empresa seleccionada es', datosEmpresa['Nombre Empresa']);
                }
            } catch (error) {
                console.error("Error al obtener la información de la empresa:", error);
            }
        };
    
        infoEmpresa();
    }, [servidor, port, empresaSeleccionada]);
    


    const headerTexts = {
        default: {
            header1: 'DIAGNÓSTICO',
            header2: 'EVOLUCIÓN DE HISTORIA CLINICA'
        },

        2: {
            header1: 'DIAGNÓSTICO',
            header2: 'Descripción Fórmula Médica'
        }

    };

    return (
        <ImprimirContainer>
            <div className="containerPrint">
                <div className="head">
                    <div className="info-empresa">
                        <p><strong>{datosEmpresa['Nombre Empresa']}</strong></p>
                        <p>{datosEmpresa['[Documento Empresa']}</p>
                        <p>{datosEmpresa['Direccion Empresa']}</p>
                        <p>{datosEmpresa['Telefono Empresa']}</p>
                        <p>{datosEmpresa['Correo Empresa']}</p>
                    </div>
                    <div className="title">
                        <h2>HISTORIA CLÍNICA</h2>
                    </div>
                </div>
                <div className="main">
                    <div className="info-paciente">
                        <p>PACIENTE: <span>{data.Paciente}</span></p>
                        <p>No HISTORIA: <span>{data.Identificacion}</span></p>
                        <p>TELÉFONO: <span>{data.Telefono}</span></p>
                    </div>
                    <div className="info-hc">
                        <div className="info-1">
                            <p>FECHA: <span>{fechaHoraFormateada}</span></p>
                            <p>EDAD: <span>{data.Edad}</span></p>
                            <p>PROFESIONAL: <span>{data.Profesional}</span></p>
                        </div>
                        <div className="info-2">
                            <p>ACOMPAÑANTE: <span>{data.Acompanante}</span></p>
                            <p style={{ marginLeft: '220px' }}>PARENTESCO: <span>{data.ParentescoAcom}</span></p>
                        </div>
                    </div>
                    <div className="evolucion">

                        <div className="diagGeneral">
                            <p style={{ height: '24px' }}>{data.tipoEvaluacion == '2' ? headerTexts[2].header1 : headerTexts.default.header1}:</p>
                            <span>{data.DiagGeneral}</span>
                        </div>
                        <div className="diagEspe">
                            <p style={{ height: '24px' }}>{data.tipoEvaluacion == '2' ? headerTexts[2].header2 : headerTexts.default.header2}</p>
                            <span>{data.DiagEspecifico}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ImprimirContainer>
    );
};

export default PrintContent;

const ImprimirContainer = styled.div`
    .containerPrint, .containerPrint * {
        font-family: 'Times New Roman', Times, serif !important;
    }

    /* Resto del código CSS */
    .containerPrint {
        width: 100%; 
        max-width: 1200px; 
        margin: auto;
        padding: 20px;
        box-sizing: border-box;

        .head {
            display: flex;
            border-bottom: 1px solid #000;
        }

        .info-empresa {
            width: 50%;
            text-align: center;
        }

        .title {
            text-align: center;
            width: 50%;
            justify-content: center;
            align-items: center;
            display: flex;
            font-weight: 800;
        }

        .title h2 {
            margin: 0;
            font-size: 18px;
            text-decoration: underline;
        }

        .main {
            width: 100%;
            margin-top: 10px;
        }

        .main .info-paciente {
            display: flex;
            width: 100%;
            justify-content: space-between;
            height: 21px;
        }

        .main .info-hc {
            display: grid;
            width: 100%;
        }

        .main .info-hc .info-1 {
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 24px;
        }

        .main .info-hc .info-2 {
            width: 100%;
            display: flex;
            height: 24px;
        }

        .evolucion {
            margin-top: 10px;
        }

        .diagEspe {
            margin-top: 10px;
        }
    }
`;

