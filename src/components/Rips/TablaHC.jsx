import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';
import { servidor, port } from "../../config/config";

const TablaHC = ({ documento, fechaInicio, fechaFin, onEvaluacionesSeleccionadas }) => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [selectedEvaluaciones, setSelectedEvaluaciones] = useState(new Set());

    useEffect(() => {
        const getEvaluaciones = async () => {
            if (documento && fechaInicio && fechaFin) {
                try {
                    const response = await axios.get(`http://${servidor}:${port}/api/evaluaciones/${documento}/${fechaInicio}/${fechaFin}`);
                    setEvaluaciones(response.data);
                } catch (error) {
                    console.error("Error al obtener los datos de evaluaciones:", error);
                    alert(`Error: ${error.message}`);
                }
            }
        };

        getEvaluaciones();
    }, [documento, fechaInicio, fechaFin]);

    const handleCheckboxChange = (id) => {
        setSelectedEvaluaciones((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            onEvaluacionesSeleccionadas(Array.from(newSelected));
            return newSelected;
        });
    };

    return (
        <TablaHCContainer>
            <table>
                <thead>
                    <tr>
                        <th className="ColumnaCheckBox">Seleccionar</th>
                        <th>Id HC</th>
                        <th>HC Realizada por</th>
                        <th>Fecha de la HC</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluaciones.length > 0 ? (
                        evaluaciones.map((evaluacion) => (
                            <tr key={evaluacion.idEvaluacion}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkboxColumn"
                                        onChange={() => handleCheckboxChange(evaluacion.idEvaluacion)}
                                    />
                                </td>
                                <td>{evaluacion.idEvaluacion}</td>
                                <td>{evaluacion.nombreUsuario}</td>
                                <td>{new Date(evaluacion.fechaEvaluacion).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay evaluaciones disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </TablaHCContainer>
    );
};

export default TablaHC;

const TablaHCContainer = styled.div`
    width: 50%;

    table {
        width: 100%;
        border-collapse: separate !important;
        border-spacing: 10px;
        border: 1px solid #ddd;
    }

    th, td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #f5f5f5;
        cursor: pointer;
    }

    .checkboxColumn {
        width: 30px;
        height: 30px;
    }

    .ColumnaCheckBox {
        width: 20px;
    }
`;
