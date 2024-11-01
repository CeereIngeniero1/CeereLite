import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaciente } from '../config/PacienteContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { servidor } from '../config/config';
import { port } from '../config/config';
import { ModalAgendarCita } from '../components/Agenda/ModalAgendarCita';
import { useUsuario } from '../config/UsuarioContext';
import axios from 'axios';

const localizer = momentLocalizer(moment);

export function Agenda() {
    const [events, setEvents] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, event: null });
    const navigate = useNavigate();
    const { setDocumentoPaciente } = usePaciente();
    const { documentoEntidad, nombreUsuario } = useUsuario();


    const handleAddCita = (newCita) => {
        setEvents(prevEvents => [...prevEvents, newCita]);
    };

    const fetchCitas = async (start, end) => {
        console.log('Fetching citas from:', start, 'to:', end); // Debugging log
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/citas`, {
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    docUsuario: documentoEntidad
                }
            });

            // Verifica si el estado de la respuesta es exitoso (aunque axios lanza un error si no lo es)
            if (response.status !== 200) {
                throw new Error('Error al obtener las citas');
            }

            const data = response.data;
            console.log('Data received:', data); // Debugging log
            const citas = data.map(cita => {
                return {
                    id: cita.id,
                    title: cita.title,
                    doc: cita.doc,
                    start: new Date(cita.start),
                    end: new Date(cita.end)
                };
            });
            setEvents(citas);
        } catch (error) {
            console.error('Error obteniendo las citas:', error);
        }
    };

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        fetchCitas(start, end);
    }, []);

    // Aquí manejamos el evento del botón para ir a la evolución del paciente
    const handleEvolucion = (documentoPaciente) => {
        setDocumentoPaciente(documentoPaciente);
        navigate('/Evolucion');
    };

    // Componente personalizado para mostrar los eventos en la vista de agenda
    const CustomAgendaEvent = ({ event }) => (
        <EventContainer>
            <span>{event.title}</span>
            <StyledButton onClick={() => handleEvolucion(event.doc)}>
                Ir a evolución
            </StyledButton>
        </EventContainer>
    );

    const messages = {
        allDay: 'Todo el día',
        previous: 'Anterior',
        next: 'Siguiente',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango',
        showMore: total => `+ Ver más (${total})`
    };

    const handleEventClick = (event, e) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            event
        });
    };

    const handleMenuOption = (option) => {
        if (option === 'Evaluación Entidad') {
            const documentoPaciente = contextMenu.event.doc;
            setDocumentoPaciente(documentoPaciente);
            navigate('/Evolucion');
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleClickOutside = (e) => {
        if (contextMenu.visible && !e.target.closest('.context-menu') && !e.target.closest('.rbc-event')) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu.visible]);

    const handleRangeChange = (range) => {
        let start, end;
        if (range.start && range.end) {
            start = new Date(range.start);
            start.setHours(-5, 0, 0, 0);
            end = new Date(range.end);
            end.setHours(18, 59, 59, 0);
        } else if (Array.isArray(range)) {
            start = new Date(range[0]);
            start.setHours(-5, 0, 0, 0);
            end = new Date(range[range.length - 1]);
            end.setHours(18, 59, 59, 0);
        } else if (range instanceof Date) {
            start = new Date(range);
            start.setHours(-5, 0, 0, 0);
            end = new Date(range);
            end.setHours(18, 59, 59, 0);
        } else {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            start.setHours(0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(18, 59, 59, 0);
        }

        // Asegúrate de que el rango para el día sea correcto
        if (range.start instanceof Date && range.start.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) {
            // Si es un día, el rango se establece al día completo
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        fetchCitas(start, end);
    };

    return (
        <Container>
            <ModalAgendarCita onAddCita={handleAddCita} />
            <StyledCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                onRangeChange={handleRangeChange}
                onSelectEvent={handleEventClick}
                components={{
                    agenda: {
                        event: CustomAgendaEvent // Aquí definimos el componente personalizado para la vista de agenda
                    }
                }}
            />

            {contextMenu.visible && (
                <ContextMenu style={{ top: contextMenu.y + 10, left: contextMenu.x - 350 }} className="context-menu">
                    <MenuItem onClick={() => handleMenuOption('Evaluación Entidad')}>Evaluación Entidad</MenuItem>
                </ContextMenu>
            )}
        </Container>
    );
}

const Container = styled.div`
    padding: 20px;
    position: relative;
    height: 100vh;
`;

const ContextMenu = styled.div`
    position: absolute;
    background: ${({ theme }) => theme.bgtotal};
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1000;
    padding: 5px;
`;

const MenuItem = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    &:hover {
        background: #f0f0f0;
    }
`;

const StyledCalendar = styled(Calendar)`
    height: 95%;
    .rbc-toolbar {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
    }
    
    .rbc-toolbar button {
        color: #000000;
        &:hover {
            background-color: #e9ecef;
        }
    }

    .rbc-event {
        background-color: #007bff;
        color: white;
    }

    .rbc-day-slot .rbc-time-slot {
        border-top: 1px solid #dee2e6;
    }

    .rbc-time-view .rbc-time-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
    }
    
    .rbc-time-header-cell {
        border-left: 1px solid #dee2e6;
    }
`;

// Estilos usando styled-components
const EventContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
`;

const StyledButton = styled.button`
    background-color: #007bff; /* Color primario */
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
        background-color: #0056b3; /* Color más oscuro al pasar el ratón */
        transform: translateY(-2px); /* Efecto de elevación */
    }

    &:active {
        background-color: #004085; /* Color cuando se hace clic */
        transform: translateY(0); /* Reseteo del efecto de elevación */
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* Efecto de foco */
    }
`;
