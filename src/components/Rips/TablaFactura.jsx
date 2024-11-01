import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios'
import { servidor, port } from '../../config/config'

const TablaFactura = ({ documento, onFacturasSeleccionadas }) => {
    const [facturas, setFacturas] = useState([]);
    const [selectedFacturas, setSelectedFacturas] = useState(new Set());

    useEffect(() => {
        const getFacturas = async () => {
            if (documento) {
                try {
                    const response = await axios.get(`http://${servidor}:${port}/api/facturas/${documento}`);
                    setFacturas(response.data)
                } catch (error) {
                    console.error("Error al obtener los datos de las facturas:", error);
                    alert(`Error: ${error.message}`);
                }
            } 
        }

        getFacturas();
    }, [documento]);

    const handleCheckboxChange = (id) => {
        setSelectedFacturas((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            onFacturasSeleccionadas(Array.from(newSelected));
            return newSelected;
        });
    };

    useEffect(() => {
        // Reiniciar las facturas seleccionadas cuando se reinicie el componente
        setSelectedFacturas([]);
        onFacturasSeleccionadas([]);
    }, [documento]);

    return (
        <TablaFacturaContainer>
            <table>
                <thead>
                    <tr>
                        <th className="ColumnaCheckBox">Seleccionar</th>
                        <th>Id Factura</th>
                        <th>Factura realizada por</th>
                        <th>Factura a relacionar</th>
                        <th>Fecha Factura</th>
                    </tr>
                </thead>
                <tbody>
                    {facturas.length > 0 ? (
                        facturas.map((factura) => (
                            <tr key={factura.idFactura}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkboxColumn"
                                        onChange={() => handleCheckboxChange(factura.idFactura)}
                                    />
                                </td>
                                <td>{factura.idFactura}</td>
                                <td>{factura.nombreUsuario}</td>
                                <td>{factura.prefijo}{factura.noFactura}</td>
                                <td>{new Date(factura.fechaFactura).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay facturas disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </TablaFacturaContainer>
    );
};

export default TablaFactura;

const TablaFacturaContainer = styled.div`
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
`
