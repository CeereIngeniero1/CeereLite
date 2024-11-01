import React, { useEffect, useState } from 'react';
import { servidor } from '../../config/config';
import { port } from '../../config/config';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { usePaciente } from '../../config/PacienteContext';
import { useEvolucion } from '../../config/EvolucionContext';
import styled from 'styled-components';

function Sidebar() {
    const [atencionReciente, setAtencionReciente] = useState(null);
    const [primeraAtencion, setPrimeraAtencion] = useState(null);
    const { documentoPaciente } = usePaciente();
    const [evoluciones, setEvoluciones] = useState([]);
    const [imagenSrc, setImagenSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { setIdEvaluacion, tipoHC } = useEvolucion();
    const [namePaciente, setNamePaciente] = useState('');
    const [formatos, setFormatos] = useState([]);


    useEffect(() => {
        const fetchData = async () => {

            // console.log("El tipoHC actual es:", tipoHC); // Agregado para depurar

            if (!documentoPaciente) return;
            try {
                if (tipoHC === 'Historia Clínica Formato') {
                    const responseFormatos = await fetch(`http://${servidor}:${port}/api/formatos-guardado/${documentoPaciente}`);
                    if (responseFormatos.ok) {
                        const dataFormatos = await responseFormatos.json();
                        setFormatos(dataFormatos);
                    } else {
                        console.warn('No se pudieron obtener los formatos guardados');
                    }
                } else if (tipoHC === 'Fórmula Médica') {
                    const responseFormulas = await fetch(`http://${servidor}:${port}/api/formulas/${documentoPaciente}`);
                    if (responseFormulas.ok) {
                        const dataFormulas = await responseFormulas.json();
                        setEvoluciones(dataFormulas);
                    } else {
                        console.warn('No se pudieron obtener las fórmulas');
                    }
                } else {
                    const responseEvoluciones = await fetch(`http://${servidor}:${port}/api/evoluciones/${documentoPaciente}`);
                    if (responseEvoluciones.ok) {
                        const dataEvoluciones = await responseEvoluciones.json();
                        setEvoluciones(dataEvoluciones);
                    } else {
                        console.warn('No se pudo obtener evoluciones');
                    }
                }

                // Obtener atención reciente
                try {
                    const responseAtencion = await fetch(`http://${servidor}:${port}/api/atencion-reciente/${documentoPaciente}`);
                    if (responseAtencion.ok) {
                        const dataAtencion = await responseAtencion.json();
                        if (dataAtencion.fecha) {
                            setAtencionReciente(dataAtencion);
                        } else {
                            console.warn('No se encontró la fecha de atención reciente');
                        }
                    } else {
                        console.warn('No se pudo obtener atención reciente');
                    }
                } catch (error) {
                    console.error('Error fetching atención reciente:', error);
                }

                // Obtener nombre del paciente
                try {
                    const responseNamePaciente = await fetch(`http://${servidor}:${port}/api/nombre-paciente/${documentoPaciente}`);
                    if (responseNamePaciente.ok) {
                        const dataNombre = await responseNamePaciente.json();
                        setNamePaciente(dataNombre.nombrePaciente || '');
                    } else {
                        console.warn('No se pudo obtener el nombre del paciente');
                    }
                } catch (error) {
                    console.error('Error fetching nombre paciente:', error);
                }

                // Obtener primera atención
                try {
                    const responsePrimera = await fetch(`http://${servidor}:${port}/api/atencion-primera/${documentoPaciente}`);
                    if (responsePrimera.ok) {
                        const dataPrimera = await responsePrimera.json();
                        if (dataPrimera.fecha) {
                            setPrimeraAtencion(dataPrimera);
                        } else {
                            console.warn('No se encontró la fecha de la primera atención');
                        }
                    } else {
                        console.warn('No se pudo obtener la primera atención');
                    }
                } catch (error) {
                    console.error('Error fetching primera atención:', error);
                }

                // Cargar imagen usando el objeto Image
                const imagenUrl = `http://${servidor}:${port}/api/imagenes/${documentoPaciente}`;
                const formatos = ['jpg', 'jpeg', 'png', 'gif'];
                let imagenValida = false;

                for (const formato of formatos) {
                    const url = `${imagenUrl}.${formato}`;
                    const img = new Image();
                    img.src = url;

                    // Controlador para cuando la imagen se carga correctamente
                    img.onload = () => {
                        setImagenSrc(url);
                        imagenValida = true;
                    };

                    // Controlador para cuando la imagen falla al cargar
                    img.onerror = () => {
                        if (!imagenValida && formato === formatos[formatos.length - 1]) {
                            // Si después de probar todos los formatos no se encuentra una imagen válida
                            setImagenSrc(`http://${servidor}:${port}/api/imagenes/AvatarPorDefecto.png`);
                        }
                    };
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [documentoPaciente, tipoHC]);

    const handleEvolucionClick = (idEvaluacion) => {
        setIdEvaluacion(idEvaluacion);
    };

    const handleFormatoClick = async (idEvaluacion) => {
        setIdEvaluacion(idEvaluacion); // Asegúrate de establecer idEvaluacion aquí
        try {
            const response = await fetch(`http://${servidor}:${port}/api/formato-guardado/${idEvaluacion}`);
            if (response.ok) {
                const dataFormato = await response.json();
                setEvoluciones(dataFormato); // Aquí puedes ajustar lo que necesites hacer con los datos del formato
            } else {
                console.warn('No se pudo obtener el formato guardado');
            }
        } catch (error) {
            console.error('Error fetching formato guardado:', error);
        }
    };

    return (
        <SidebarContainer id="sidebar">
            <div className="sidebar">
                <div className="nameUsuario">
                    <span>{namePaciente || 'Cargando...'}</span>
                </div>
                <div className="imagen">
                    <img src={imagenSrc} alt="Imagen del paciente" />
                </div>
                <div className="atencionesUsuario">
                    <div className="atencionGroup">
                        <h4>ATENCIÓN MÁS RECIENTE</h4>
                        {atencionReciente && atencionReciente.fecha ? (
                            <span>
                                {`${formatDistanceToNow(parseISO(atencionReciente.fecha), { addSuffix: true, locale: es })}, el ${format(parseISO(atencionReciente.fecha), 'dd/MM/yyyy')}`}
                            </span>
                        ) : (
                            <span>Cargando...</span>
                        )}
                    </div>

                    <div className="atencionGroup">
                        <h4>PRIMER ATENCIÓN</h4>
                        {primeraAtencion && primeraAtencion.fecha ? (
                            <span>
                                {`${formatDistanceToNow(parseISO(primeraAtencion.fecha), { addSuffix: true, locale: es })} , el ${format(parseISO(primeraAtencion.fecha), 'dd/MM/yyyy')}`}
                            </span>
                        ) : (
                            <span>Cargando...</span>
                        )}
                    </div>

                    <div className="evolucionGroup overflow-x-hidden">
                        <h4>{tipoHC === 'Historia Clínica Formato' ? 'Formatos Guardados' : 'Evoluciones'}</h4>
                        <span>Total: {tipoHC === 'Historia Clínica Formato' ? formatos.length : evoluciones.length}</span>

                        {tipoHC === 'Historia Clínica Formato' && formatos.length > 0 ? (
                            formatos.map((item) => (
                                <div
                                    className="w-[165px]"
                                    key={item.idEvolucion}
                                    onClick={() => handleFormatoClick(item.idEvolucion)}
                                >
                                    <h4 className="w-[160px] break-words whitespace-normal">{item.nombreFormato}</h4>

                                    {/* Verifica si fechaGuardado es una fecha válida antes de formatearla */}
                                    <span>
                                        {item.fechaEvolucion ? format(parseISO(item.fechaEvolucion), 'dd/MM/yyyy') : 'Fecha no disponible'}
                                    </span>
                                </div>
                            ))
                        ) : tipoHC !== 'Historia Clínica Formato' && evoluciones.length > 0 ? (
                            evoluciones.map((item) => (
                                <div
                                    key={item.idEvolucion}
                                    onClick={() => handleEvolucionClick(item.idEvolucion)}
                                >
                                    <h4>{tipoHC === 'Fórmula Médica' ? 'Fórmula Médica' : 'Evolución'}</h4>
                                    {/* Solo formatea si la fecha es válida */}
                                    <span>
                                        {item.fechaEvolucion
                                            ? `${item.pacienteEvolucion} - ${format(parseISO(item.fechaEvolucion), 'dd/MM/yyyy')}`
                                            : `${item.pacienteEvolucion} - Fecha no disponible`}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>{tipoHC === 'Historia Clínica Formato' ? 'No hay formatos guardados disponibles.' : 'No hay evoluciones disponibles.'}</p>
                        )}
                    </div>
                </div>
            </div>
        </SidebarContainer>
    );
}


const SidebarContainer = styled.div`
    width: 250px;
    background: ${({ theme }) => theme.bgSidebarYeison}; /* Ajusta el color de fondo según el tema */
    color: #ecf0f1;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &.hidden {
    transform: translateX(-100%);
    position: absolute;
    }

    .sidebar {
    width: 250px;
    background: ${({ theme }) => theme.bgSidebarYeison}; /* Ajusta el color de fondo según el tema */
    color: #ecf0f1;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    }

    .nameUsuario {
    width: 100%;
    text-align: center;
    padding: 10px;
    background: ${({ theme }) => theme.bgAtencionGroup}; /* Ajusta el color de fondo según el tema */
    border-radius: 5px;
    margin-bottom: 20px;

    & span {
        font-size: 16px;
        font-weight: bold;
        color: #ecf0f1;
        }
    }

    .imagen {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
        justify-content: center;
        display: flex;

            & img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid #ecf0f1;
        }
    }

    .atencionesUsuario {
        width: 100%;
    }

    .atencionGroup {
        background: ${({ theme }) => theme.bgAtencionGroup};
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 15px;
        text-align: center;

        & h4 {
            font-size: 14px;
            margin-bottom: 5px;
            color: #ecf0f1;
        }

        & span {
            font-size: 12px;
            color: #bdc3c7;
        }
    }

    .evolucionGroup {
        display: flex;
        flex-direction: column;
        gap: 1rem; /* Espacio entre cada sección */
        padding: 1rem;
        background: ${({ theme }) => theme.bgAtencionGroup};
        border-radius: 8px;
        max-height: 300px; /* Altura máxima del contenedor */
        overflow-y: auto; /* Habilitar el scroll vertical */
    }

    .evolucionGroup > div {
        background: ${({ theme }) => theme.bgSidebarYeison}; /* Ajusta el color de fondo según el tema */
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

    .evolucionGroup h4 {
        margin: 0 0 0.1rem 0;
        font-size: 1.0rem;
        color: #ecf0f1;
        }

    .evolucionGroup span {
        font-size: 0.8rem;
        color: #ecf0f1;
        }
    }

`;

export default Sidebar;
