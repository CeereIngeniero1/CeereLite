import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useEmpresa } from "../../config/EmpresaContext";
import Swal from 'sweetalert2';
import axios from 'axios';
import { servidor, port } from "../../config/config";

const PacienteForm = ({ onDocumentoChange, onFechasChange }) => {
    const { empresaSeleccionada } = useEmpresa();
    const documentoEmpresaSeleccionada = empresaSeleccionada?.documentoEmpresa;
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');

    const updatePacientesSelect = (pacientes) => {
        const opciones = [
            { value: "", text: "Sin Seleccionar" },
            ...pacientes.map((paciente) => ({
                value: paciente.documento,
                text: `${paciente.nombre} - ${paciente.tipoDocumento} ${paciente.documento}`,
            })),
        ];
        return opciones;
    };

    const getPacientes = async (fechaInicio, fechaFin) => {
        try {
            // Mostrar el mensaje de carga antes de la solicitud
            Swal.fire({
                title: 'Cargando pacientes...',
                text: 'Por favor, espere.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.get(`http://${servidor}:${port}/api/pacientes/${fechaInicio}/${fechaFin}/${documentoEmpresaSeleccionada}`);
            const pacientes = response.data;
            setPacientes(updatePacientesSelect(pacientes));

            // Cerrar el mensaje de carga y mostrar éxito
            Swal.fire({
                title: "Pacientes cargados correctamente",
                confirmButtonColor: '#2c3e50',
            });
        } catch (error) {
            console.error(error);
            // Cerrar el mensaje de carga y mostrar el error
            Swal.fire("Error", `Error: ${error.message}`, "error");
        }
    };

    const alerta = async () => {
        const storedFechaInicio = localStorage.getItem("fechaInicio") || "";
        const storedFechaFin = localStorage.getItem("fechaFin") || "";

        const { value: formValues } = await Swal.fire({
            title: "Seleccione el rango de fecha para cargar los pacientes",
            html: `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <label style="color: black;">FECHA INICIO</label>
                    <input type="date" id="swal-input1" class="swal2-input" value="${storedFechaInicio}" style="width: 90%; margin: 0;">
                    <label style="color: black;">FECHA FIN</label>
                    <input type="date" id="swal-input2" class="swal2-input" value="${storedFechaFin}" style="width: 90%; margin: 0;">
                </div>
            `,
            confirmButtonColor: '#2c3e50',
            preConfirm: () => {
                const fechaInicio = document.getElementById("swal-input1").value;
                const fechaFin = document.getElementById("swal-input2").value;

                if (fechaInicio && fechaFin) {
                    localStorage.setItem("fechaInicio", fechaInicio);
                    localStorage.setItem("fechaFin", fechaFin);
                    onFechasChange(fechaInicio, fechaFin);  // Actualiza las fechas en Rips.jsx

                    getPacientes(fechaInicio, fechaFin);
                } else {
                    Swal.showValidationMessage("Por favor, seleccione ambas fechas");
                }
            }
        });
    };

    useEffect(() => {
        const checkboxParticular = document.getElementById('checkbox1');

        const handleCheckboxChange = () => {
            if (checkboxParticular.checked) {
                alerta();
            }
        };

        if (checkboxParticular) {
            checkboxParticular.addEventListener('change', handleCheckboxChange);
        }

        return () => {
            if (checkboxParticular) {
                checkboxParticular.removeEventListener('change', handleCheckboxChange);
            }
        };
    }, []);

    const handlePacienteChange = (event) => {
        const nuevoPaciente = event.target.value;
        setSelectedPaciente(nuevoPaciente);
        onDocumentoChange(nuevoPaciente);  // Actualiza el documento en Rips.jsx
    };

    return (
        <ContainerMain>
            <div className="paciente">
                <div className="divBuscar">
                    <input type="text" id="documentoInput" placeholder="Buscar Paciente" />
                </div>
                <div className="check" style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "0px" }}>Particular</span>
                    <input type="checkbox" id="checkbox1" className="checkbox" style={{ marginRight: "20px", width: "10px !important" }} />
                    <span style={{ marginRight: "10px" }}>Prepagada</span>
                    <input type="checkbox" id="checkbox2" className="checkbox" style={{ width: "10px !important" }} />
                </div>
                <span id="span_paciente">Seleccionar paciente:</span>
                <select id="listaPaciente" value={selectedPaciente} onChange={handlePacienteChange}>
                    {pacientes.map((paciente, index) => (
                        <option key={index} value={paciente.value}>
                            {paciente.text}
                        </option>
                    ))}
                </select>
            </div>
        </ContainerMain>
    );
};

export default PacienteForm;

const ContainerMain = styled.div`
    display: grid;
    margin: auto;
    width: 80%;
    margin-bottom: 10px;

    .paciente {
        width: 100%;
        display: grid;
        text-align: center;
        align-content: center;
        font-size: 30px;

        select {
            width: 100%;
            height: 40px;
            border-radius: 8px;
            outline-color: ${({ theme }) => theme.bgAtencionGroup};
            border: 1px solid ${({ theme }) => theme.bgAtencionGroup};
            text-align: center;
            font-size: 20px;
        }
    }

    .check input {
        width: 8%;
        height: 30px;
        border: 1px solid ${({ theme }) => theme.bgAtencionGroup};
        border-radius: 5px;
        font-size: 16px;
        padding: 4px;
        outline: none;
    }

    .divBuscar {
        display: flex;
        width: 100%;
        justify-content: flex-end;

        input {
            width: 25%;
            height: 30px;
            border: 1px solid ${({ theme }) => theme.bgAtencionGroup};
            border-radius: 5px;
            font-size: 16px;
            padding: 4px;
            outline: none;
        }

        input:focus {
            border: 2px solid ${({ theme }) => theme.bgAtencionGroup};
        }
    }
`;
