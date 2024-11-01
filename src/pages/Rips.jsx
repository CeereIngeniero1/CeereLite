import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Rips/Navbar';
import PacienteForm from '../components/Rips/PacienteForm';
import TablaFactura from '../components/Rips/TablaFactura';
import TablaHC from '../components/Rips/TablaHC';
import { BotonesRips } from '../components/Rips/Botones';
import { FacturaCero } from '../components/Rips/FacturaCero';
import { useEmpresa } from '../config/EmpresaContext';
import axios from 'axios';
import { servidor, port } from '../config/config';
import Swal from 'sweetalert2';
import '../styles/EstilosBotonesAlert.css';

export function Rips() {
    const { empresaSeleccionada } = useEmpresa();

    const [key, setKey] = useState(0);
    const [documento, setDocumento] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [evaluacionesSeleccionadas, setEvaluacionesSeleccionadas] = useState([]);
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
    const [isFacturaCeroChecked, setIsFacturaCeroChecked] = useState(false);

    const handleDocumentoChange = (newDocumento) => setDocumento(newDocumento);
    const handleFechasChange = (newFechaInicio, newFechaFin) => {
        setFechaInicio(newFechaInicio);
        setFechaFin(newFechaFin);
    };

    const handleEvaluacionesSeleccionadas = (ids) => setEvaluacionesSeleccionadas(ids);
    const handleFacturasSeleccionadas = (ids) => setFacturasSeleccionadas(ids);

    const handleRelacionarClick = async () => {
        // Validación de la selección según el estado del checkbox
        if (isFacturaCeroChecked) {
            if (evaluacionesSeleccionadas.length === 0) {
                alert('Por favor, selecciona al menos una evaluación para relacionar.');
                return;
            }
        } else {
            if (evaluacionesSeleccionadas.length === 0 || facturasSeleccionadas.length === 0) {
                alert('Por favor, selecciona al menos una evaluación y una factura para relacionar.');
                return;
            }
        }

        const idHC = evaluacionesSeleccionadas.join(', ');
        const idFactura = facturasSeleccionadas.join(', ');

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel',
            },
            buttonsStyling: false
        });

        const mensaje = `<span style="color: #000;">¿Quieres relacionar la Factura (${idFactura}) con la Historia Clínica (${idHC})?</span>`;

        const result = await swalWithBootstrapButtons.fire({
            title: '¿Está seguro de querer relacionar?',
            html: mensaje,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No relacionar',
            confirmButtonText: 'Sí, realizar la relación de RIPS',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                if (isFacturaCeroChecked) {
                    const response = await axios.post(`http://${servidor}:${port}/api/facturaCero/${empresaSeleccionada.documentoEmpresa}`, {
                        evaluacion: evaluacionesSeleccionadas[0]
                    });
                    console.log("Factura Cero relacionada", response.data);
                } else {
                    for (const idEvaluacion of evaluacionesSeleccionadas) {
                        for (const idFactura of facturasSeleccionadas) {
                            await axios.post(`http://${servidor}:${port}/api/relacionar`, {
                                evaluacion: idEvaluacion,
                                factura: idFactura
                            });
                        }
                    }
                }

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Historia relacionada correctamente!",
                    showConfirmButton: false,
                    timer: 2000
                });

                setKey(prevKey => prevKey + 1);
                setDocumento('');
                setFechaInicio('');
                setFechaFin('');
                setEvaluacionesSeleccionadas([]);
                setFacturasSeleccionadas([]);
                setIsFacturaCeroChecked(false); // Desmarca el checkbox después de la acción
                
            } catch (error) {
                Swal.fire('Error', 'Ocurrió un problema al realizar la relación.', 'error');
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: 'Cancelado',
                text: 'La relación de RIPS ha sido cancelada.',
                icon: 'error'
            });
        }
    };

    const handleCheckboxChange = (event) => {
        setIsFacturaCeroChecked(event.target.checked);
    };

    return (
        <Container key={key}>
            <div className="container">
                <Navbar />
                <main>
                    <label style={{ fontWeight: "bold" }}>
                        Empresa de Trabajo: <span id="EmpresaDeTrabajo" style={{ fontWeight: "normal" }}>{empresaSeleccionada ? empresaSeleccionada.nombreEmpresa : 'No hay empresa seleccionada'}</span>
                    </label>
                    <PacienteForm onDocumentoChange={handleDocumentoChange} onFechasChange={handleFechasChange} />
                    <div className="tabla">
                        <TablaHC documento={documento} fechaInicio={fechaInicio} fechaFin={fechaFin} onEvaluacionesSeleccionadas={handleEvaluacionesSeleccionadas} />
                        <TablaFactura documento={documento} onFacturasSeleccionadas={handleFacturasSeleccionadas} />
                    </div>
                    <FacturaCero onCheckboxChange={handleCheckboxChange} />
                    <BotonesRips onRelacionarClick={handleRelacionarClick} />
                </main>
            </div>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    margin: 0;
    height: 100vh;
    padding: 8px;
    box-sizing: border-box;

    .container {
        display: grid;
        width: 100%;
        margin: 0;
        padding: 10px;
        box-sizing: border-box;
    }

    .tabla {
        width: 100%;
        display: flex;
    }
`;
