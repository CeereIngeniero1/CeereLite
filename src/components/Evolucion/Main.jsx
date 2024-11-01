import { useState, useEffect, useRef } from 'react';
import { fetchData } from '../../services/apiService';
import Header from './Header'
import SweetAlert2 from 'sweetalert2';
import { usePaciente } from '../../config/PacienteContext';
import { useUsuario } from '../../config/UsuarioContext';
import { useEmpresa } from '../../config/EmpresaContext';
import { servidor } from '../../config/config';
import { port } from '../../config/config';
import { useEvolucion } from '../../config/EvolucionContext';
import styled from "styled-components";
import PrintContent from '../../utils/PrintContent';
import { useReactToPrint } from 'react-to-print';
import Diagnosticos from './Evolucion Medica/Diagnosticos';
import Formatos from './Formatos/Formatos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signatures from './Firmas/Firmas';


function Main({ insertarEvaluacionFormatos, footer, datosPaciente, setDatosPaciente, firmaPaciente, setFirmaPaciente, firmaProfesional, setFirmaProfesional }) {

    const { empresaSeleccionada } = useEmpresa();
    const { idEvaluacion, setIdEvaluacion, tipoHC, setTipoHC } = useEvolucion();
    const [datosEvolucion, setDatosEvolucion] = useState({});
    const { documentoPaciente } = usePaciente();
    const { documentoEntidad, nombreUsuario } = useUsuario();

    // Agrupar estados relacionados
    const [listas, setListas] = useState({
        evaluaciones: [],
        ciudades: [],
        unidadMedidas: [],
        sexos: [],
        estadoCiviles: [],
        ocupaciones: [],
        aseguradoras: [],
        tipoAfiliados: [],
        parentescos: [],
    });

    const [historiaClinica, setHistoriaClinica] = useState(null);
    const [formatos, setFormatos] = useState('');

    // Convertir la fecha al formato yyyy-mm-dd
    const fechaNacimientoBack = datosPaciente.fechaNacimiento;
    const fechaFormateada = fechaNacimientoBack ? fechaNacimientoBack.split('T')[0] : '';
    const [selectedValue, setSelectedValue] = useState('1');

    // Función para seleccionar URL basada en `tipoHC`
    const fetchEvaluacion = async (idEvaluacion, tipoHC) => {
        try {
            let url;

            if (tipoHC === 'Fórmula Médica') {
                url = `http://${servidor}:${port}/api/formula/${idEvaluacion}`;
            } else if (tipoHC === 'Historia Clínica Formato') {
                url = `http://${servidor}:${port}/api/formato-guardado/${idEvaluacion}`;
            } else {
                url = `http://${servidor}:${port}/api/evolucion/${idEvaluacion}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al cargar la evaluación');

            const data = await response.json();
            if (data.length === 0) {
                setDatosEvolucion(prevState => ({ ...prevState, idEvaluacion }));
                return;
            }

            const datosEvaluacion = data[0];

            // Convertir la firma en imagen base64 si existe
            if (datosEvaluacion['Firma Evaluación Entidad']) {
                const base64Data = datosEvaluacion['Firma Evaluación Entidad'];
                const firmaPacienteBase64 = base64Data.startsWith('data:image/png;base64,')
                    ? base64Data
                    : `data:image/png;base64,${base64Data}`;
                setFirmaPaciente(firmaPacienteBase64);
            } else {
                // Si no existe la firma, establecer firmaPaciente a null
                setFirmaPaciente(null);
            }


            if (tipoHC === 'Historia Clínica Formato') {
                const diagnosticoGeneral = datosEvaluacion['Diagnostico General'];
                const rutaFormato = `C:/CeereSio${diagnosticoGeneral.replace(/\\/g, '/')}`;
                const rutaFormatoCodificada = encodeURIComponent(rutaFormato);

                const responseFormato = await fetch(`http://${servidor}:${port}/api/evolucion/formatos/formato-archivo?path=${rutaFormatoCodificada}`);
                if (responseFormato.ok) {
                    const contenidoFormato = await responseFormato.text();
                    setDatosEvolucion({ ...datosEvaluacion, contenidoFormato });
                } else if (responseFormato.status === 404) {
                    setDatosEvolucion(prevState => ({
                        ...prevState,
                        idEvaluacion,
                        contenidoFormato: null,
                    }));
                    setFormatoNoEncontrado(true);
                    toast.error(`Formato no encontrado, contactese con administrador!`, { position: "top-center", autoClose: 1500 });
                } else {
                    console.warn('No se pudo obtener el archivo del formato');
                    setDatosEvolucion({ ...datosEvaluacion, contenidoFormato: null });
                }
            } else {
                setDatosEvolucion(datosEvaluacion);
            }
        } catch (error) {
            console.error('Error fetching evaluation data:', error);
            setDatosEvolucion(prevState => ({
                ...prevState,
                idEvaluacion,
                contenidoFormato: null,
            }));
        }
    };

    useEffect(() => {
        if (idEvaluacion) {
            fetchEvaluacion(idEvaluacion, tipoHC);
        }
    }, [idEvaluacion, tipoHC]);

    const fetchHistoriaClinica = async () => {
        try {
            setDatosEvolucion({});

            const endpoints = [
                { url: '/listas/evaluacion', key: 'evaluaciones' },
                { url: '/listas/ciudad', key: 'ciudades' },
                { url: '/listas/unidad-medida', key: 'unidadMedidas' },
                { url: '/listas/sexo', key: 'sexos' },
                { url: '/listas/estadoCivil', key: 'estadoCiviles' },
                { url: '/listas/ocupacion', key: 'ocupaciones' },
                { url: '/listas/aseguradora', key: 'aseguradoras' },
                { url: '/listas/tipoAfiliado', key: 'tipoAfiliados' },
                { url: '/listas/parentesco', key: 'parentescos' },
            ];

            for (const endpoint of endpoints) {
                const data = await fetchData(endpoint.url);
                setListas(prevListas => ({
                    ...prevListas,
                    [endpoint.key]: data
                }));
            }

            const response = await fetch(`http://${servidor}:${port}/api/datos/HC/${documentoPaciente}`);
            if (!response.ok) {
                throw new Error(`Error al obtener datos de: ${response.statusText}`);
            }
            const pacientes = await response.json();
            if (Array.isArray(pacientes) && pacientes.length > 0) {
                setHistoriaClinica(pacientes[0]); // Asegúrate de asignar el primer paciente
            } else {
                SweetAlert2.fire('No hay paciente seleccionado');
            }
        } catch (error) {
            console.error('Error al cargar historias clínicas:', error);
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    const [fechaHora, setFechaHora] = useState('');

    useEffect(() => {
        if (datosEvolucion && datosEvolucion['Fecha Evaluación Entidad']) {
            const fechaISO = datosEvolucion['Fecha Evaluación Entidad'];
            const fecha = new Date(fechaISO);
            const fechaHC = fecha.toISOString().slice(0, 16);
            setFechaHora(fechaHC);
        }
    }, [datosEvolucion]);

    const handleFechaHoraChange = (event) => {
        setFechaHora(event.target.value);
    };

    useEffect(() => {
        if (historiaClinica) {
            setDatosPaciente({
                ...datosPaciente,
                nombre: historiaClinica.nombrePaciente || '',
                identificacion: historiaClinica.documentoPaciente || '',
                direccion: historiaClinica.direccionPaciente || '',
                telefono: historiaClinica.celularPaciente || '',
                edad: historiaClinica.edadPaciente || '',
                unidadMedida: historiaClinica.idUnidad || '',
                sexo: historiaClinica.idSexoPaciente || '',
                ocupacion: historiaClinica.idOcupacion || '',
                residencia: historiaClinica.idListaCiudad || '',
                estadoCivil: historiaClinica.idEstadoCivil || '',
                aseguradora: historiaClinica.documentoAseguradora || '',
                tipoAfiliado: historiaClinica.idTipoAfiliado || '',
                parentescoResponsable: historiaClinica.idParentescoResponsable || '',
                fechaNacimiento: historiaClinica.nacimientoPaciente || '',
                nombreResponsable: historiaClinica.nombreResponsable || 'Sin Acompañante',
                telefonoResponsable: historiaClinica.telefonoResponsable || 'Sin Asignar',
                diagGeneral: '',  // Se resetean a valores en blanco
                diagEspecifico: '',  // Se resetean a valores en blanco

            });

            document.getElementById('nombrePacienteNavbar').textContent = historiaClinica.nombrePaciente || '';
        }
    }, [historiaClinica]);

    useEffect(() => {
        const textareas = document.querySelectorAll('.autoTextarea');

        textareas.forEach(textarea => {
            const adjustHeight = () => {
                textarea.style.height = 'auto'; // Reinicia la altura
                textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura al contenido
            };

            textarea.addEventListener('input', adjustHeight);

            // Inicializa el textarea ajustando su altura
            adjustHeight();

            // Cleanup function to remove the event listener
            return () => {
                textarea.removeEventListener('input', adjustHeight);
            };
        });
    }, []);

    useEffect(() => {
        const toggleButton = document.getElementById('toggleSidebar');

        if (toggleButton) {
            const sidebar = document.querySelector('#sidebar');
            const handleToggle = () => sidebar.classList.toggle('hidden');
            toggleButton.addEventListener('click', handleToggle);

            // Cleanup function to remove the event listener
            return () => {
                toggleButton.removeEventListener('click', handleToggle);
            };
        }
    }, []);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setDatosPaciente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resetAndLoad = async () => {
        try {
            setFirmaPaciente(null); // Reinicia la firma en cada carga de datos
            await fetchHistoriaClinica();
            // Resetear diagGeneral y diagEspecifico en el estado datosPaciente
            setDatosPaciente((prev) => ({
                ...prev,
                diagGeneral: '',
                diagEspecifico: ''
            }));

            setIdEvaluacion('');

            // Establecer la fecha y hora actuales
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            setFechaHora(formattedDateTime);

        } catch (error) {
            console.error('Error al cargar historias clínicas:', error);
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    const insertarEvaluacionEntidad = async () => {

        // Asegúrate de que hay al menos un elemento con el nombre 'tipoRIPS'
        const tipoRIPSInput = document.querySelector('input[name="tipoRIPS"]:checked');
        const tipoRIPS = tipoRIPSInput ? tipoRIPSInput.value : 99999;
        const listaEvaluacion = document.getElementById('listaEvaluacion').value

        console.log(`El id tipoRIPS es: ${tipoRIPS}`)
        console.log('tipoRIPS:', tipoRIPS);
        console.log(`El Id Evaluacion es: ${listaEvaluacion}`)
        if (listaEvaluacion === '1') {
            if (tipoRIPS === 99999) {
                SweetAlert2.fire({
                    title: "Seleccione el tipo de RIPS",
                    text: "Debe seleccionar un tipo de RIPS.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
        }


        const paciente = {
            docEmpresa: empresaSeleccionada.documentoEmpresa,
            documentoUsuario: documentoEntidad,
            listaEvaluacion: document.getElementById('listaEvaluacion').value,
            documentoPaciente: document.getElementById('identificacion').value,
            edadPaciente: document.getElementById('edad').value,
            nombreAcompanante: document.getElementById('nombreAcompanante').value,
            parentescoAcompanante: document.getElementById('listaParentescoAcompanante').value,
            telefonoAcompanante: document.getElementById('telefonoAcompanante').value,
            DiagGeneral: document.getElementById('DiagGeneral').value,
            DiagEspecifico: document.getElementById('DiagEspecifico').value,
            direccionPaciente: document.getElementById('direccion').value,
            ciudadPaciente: document.getElementById('listaResidencia').value,
            celularPaciente: document.getElementById('telefono').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            unidadMedida: document.getElementById('listaUnidadMedida').value,
            sexoPaciente: document.getElementById('listaSexo').value,
            estadoCivilPaciente: document.getElementById('listaEstadoCivil').value,
            ocupacionPaciente: document.getElementById('listaOcupacion').value,
            aseguradora: document.getElementById('listaAseguradora').value,
            tipoAfiliado: document.getElementById('listaTipoAfiliado').value,
            nombreResponsable: document.getElementById('nombreResponsable').value,
            parentescoResponsable: document.getElementById('listaParentescoResponsable').value,
            telefonoResponsable: document.getElementById('telefonoResponsable').value,
            firmaPaciente: firmaPaciente,

            // EVALUACIÓN ENTIDAD RIPS
            tipoRIPS: tipoRIPS,
            listaTipoRips: document.getElementById('listaTipoRips').value,
            listaEntidad: document.getElementById('listaEntidad').value,
            listaViaIngreso: document.getElementById('listaViaIngreso').value,
            listamodalidadAtencion: document.getElementById('listamodalidadAtencion').value,
            listaGrupoServicios: document.getElementById('listaGrupoServicios').value,
            listaServicios: document.getElementById('listaServicios').value,
            listaFinalidad: document.getElementById('listaFinalidad').value,
            listaCausaMotivo: document.getElementById('listaCausaMotivo').value,
            listaTipoDiag: document.getElementById('listaTipoDiag').value,
            listaCodConsulta: document.getElementById('listaCodConsulta').value,
            listaCodConsulta2: document.getElementById('listaCodConsulta2').value,
            listaDiag: document.getElementById('listaDiag').value,
            listaDiag2: document.getElementById('listaDiag2').value
        }



        if (paciente.tipoRIPS === '1') {
            if (!paciente.listaTipoRips || paciente.listaTipoRips === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione el tipo de RIPS",
                    text: "Debe seleccionar el tipo de RIPS de la lista.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaEntidad === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione la entidad",
                    text: "Debe seleccionar la entidad de la lista.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listamodalidadAtencion === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione la modalidad de atención",
                    text: "Debe seleccionar la modalidad de atención.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaGrupoServicios === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione el grupo de servicios",
                    text: "Debe seleccionar el grupo de servicios.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaServicios === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione los servicios",
                    text: "Debe seleccionar los servicios.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaFinalidad === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione la finalidad",
                    text: "Debe seleccionar la finalidad.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaCausaMotivo === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione la causa/motivo",
                    text: "Debe seleccionar la causa o motivo.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaTipoDiag === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione el tipo de diagnóstico",
                    text: "Debe seleccionar el tipo de diagnóstico.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.DiagGeneral || !paciente.DiagEspecifico) {
                SweetAlert2.fire({
                    title: "Ingrese evolución médica",
                    text: "Debe ingresar una evolución médica para el paciente.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaCodConsulta === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione el código de consulta",
                    text: "Debe seleccionar el código de consulta.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (paciente.listaDiag === 'Sin Seleccionar') {
                SweetAlert2.fire({
                    title: "Seleccione el diagnóstico",
                    text: "Debe seleccionar el diagnóstico.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
        }

        if (paciente.tipoRIPS === '2') {
            if (!paciente.listaTipoRips) {
                SweetAlert2.fire({
                    title: "Seleccione el tipo de RIPS",
                    text: "Debe seleccionar el tipo de RIPS.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaEntidad) {
                SweetAlert2.fire({
                    title: "Seleccione la entidad",
                    text: "Debe seleccionar la entidad de la lista.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listamodalidadAtencion) {
                SweetAlert2.fire({
                    title: "Seleccione la modalidad de atención",
                    text: "Debe seleccionar la modalidad de atención.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaGrupoServicios) {
                SweetAlert2.fire({
                    title: "Seleccione el grupo de servicios",
                    text: "Debe seleccionar el grupo de servicios.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaServicios) {
                SweetAlert2.fire({
                    title: "Seleccione los servicios",
                    text: "Debe seleccionar los servicios.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaFinalidad) {
                SweetAlert2.fire({
                    title: "Seleccione la finalidad",
                    text: "Debe seleccionar la finalidad.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaViaIngreso) {
                SweetAlert2.fire({
                    title: "Seleccione la vía de ingreso",
                    text: "Debe seleccionar la vía de ingreso.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.DiagGeneral || !paciente.DiagEspecifico) {
                SweetAlert2.fire({
                    title: "Ingrese evolución médica",
                    text: "Debe ingresar una evolución médica para el paciente.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaCodConsulta) {
                SweetAlert2.fire({
                    title: "Seleccione el código de consulta",
                    text: "Debe seleccionar el código de consulta.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
            if (!paciente.listaDiag) {
                SweetAlert2.fire({
                    title: "Seleccione el diagnóstico",
                    text: "Debe seleccionar el diagnóstico.",
                    icon: "warning",
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2c3e50'
                });
                return;
            }
        }

        try {
            const response = await fetch(`http://${servidor}:${port}/api/insert-evaluacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });

            const result = await response.json();
            if (response.ok) {
                SweetAlert2.fire({
                    title: "Éxito",
                    text: "Historia clinica guardada correctamente!",
                    icon: "success",
                    confirmButtonText: 'OK!',
                    confirmButtonColor: '#2c3e50'
                }).then(() => {
                    window.location.href = '/';
                });
            } else {
                throw new Error(result.error || 'Hubo un problema al insertar los datos');
            }
        } catch (error) {
            SweetAlert2.fire({
                title: "Error",
                text: 'Error al insertar: ' + error.message,
                icon: "error",
                confirmButtonText: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }
    };

    // Define los textos para los encabezados
    const headerTexts = {
        default: {
            header1: 'Diagnóstico General',
            header2: 'Evolución Médica'
        },

        2: {
            header1: 'Diagnóstico General',
            header2: 'Descripción Fórmula Médica'
        }
    };

    const handleSelectChangeHC = async (event) => {
        const selectedValue = event.target.value;
        setSelectedValue(selectedValue);
        setIdEvaluacion('');

        // console.log(`El tipoHC desde el select es: ${tipoHC}`)
        // console.log(`El SelecteValue desde el select es: ${selectedValue}`)

        let url;

        if (selectedValue === '2') {
            setTipoHC('Fórmula Médica');
            url = `http://${servidor}:${port}/api/formulas/${documentoPaciente}`;
        } else if (selectedValue === '4') {
            setTipoHC('Historia Clínica Formato');
            url = `http://${servidor}:${port}/api/formatos-guardado/${documentoPaciente}`;
        } else if (selectedValue === '1') {
            setTipoHC('Evolución');
            url = `http://${servidor}:${port}/api/evoluciones/${documentoPaciente}`;
        }

        // Mueve la lógica de fetching aquí
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Manejamos el caso específico para el historial de formatos
            if (selectedValue === '4') {
                setFormatos(data);  // Aquí almacenamos el historial de formatos
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderTipoEvaluacion = () => {
        if (datosEvolucion['Id Tipo de Evaluación']) {
            return (
                <select id="listaEvaluacion" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Tipo de Evaluación']} value={datosEvolucion['Id Tipo de Evaluación']}>
                        {datosEvolucion['Tipo de Evaluación']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaEvaluacion" className="inputCampos" onChange={handleSelectChangeHC}>
                    {listas.evaluaciones.map(evaluacion => (
                        <option key={evaluacion.idListaEvaluacion} value={evaluacion.idListaEvaluacion}>
                            {evaluacion.nombreListaEvaluacion}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderProfesional = () => {
        const profesionalValue = datosEvolucion['Nombre Profesional'] || nombreUsuario || '';

        return (
            <input
                type="text"
                id="Profesional"
                className="inputCampos"
                placeholder="Profesional"
                value={profesionalValue}
                readOnly
            />
        );
    };

    const renderPaciente = () => {
        const pacienteValue = datosEvolucion['Nombre Paciente'] || datosPaciente.nombre || '';

        return (
            <input
                type="text"
                id="namePaciente"
                className="inputCampos"
                placeholder="Paciente"
                value={pacienteValue}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, nombre: e.target.value }))}
            />
        );
    };

    const renderIdentifiacion = () => {
        const documentoValue = datosEvolucion['Documento Paciente'] || datosPaciente.identificacion || '';

        return (
            <input
                type="text"
                id="identificacion"
                className="inputCampos"
                placeholder="Identificación"
                value={documentoValue}
                readOnly
            />
        );
    };

    const renderHistoria = () => {
        const historiaValue = datosEvolucion['Documento Paciente'] || datosPaciente.identificacion || '';

        return (
            <input
                type="text"
                id="historia"
                className="inputCampos"
                placeholder="No. Historia"
                value={historiaValue}
                readOnly
            />
        );
    };

    const renderDireccion = () => {
        const direccionValue = datosEvolucion['Dirección Domicilio'] || datosPaciente.direccion || '';

        return (
            <input
                type="text"
                id="direccion"
                className="inputCampos"
                placeholder="Dirección Domicilio"
                value={direccionValue}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, direccion: e.target.value }))}
            />
        );
    };

    const renderCiudades = () => {
        if (datosEvolucion['Id Ciudad']) {
            return (
                <select id="listaResidencia" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Ciudad']} value={datosEvolucion['Id Ciudad']}>
                        {datosEvolucion['Ciudad']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaResidencia" className="inputCampos" name="residencia" value={datosPaciente.residencia} onChange={handleSelectChange}>
                    <option value="">Sin Seleccionar</option>
                    {listas.ciudades.map(ciudad => (
                        <option key={ciudad.idListaCiudad} value={ciudad.idListaCiudad}>
                            {ciudad.nombreCiudad}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderTelefono = () => {
        const telefonoValue = datosEvolucion['Teléfono Domicilio'] || datosPaciente.telefono || '';

        return (
            <input
                type="text"
                id="telefono"
                className="inputCampos"
                placeholder="Teléfono"
                value={telefonoValue}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, telefono: e.target.value }))}
            />
        );
    };

    const renderFechaNacimiento = () => {
        return (
            <input
                type="date"
                id="fechaNacimiento"
                className="inputCampos"
                placeholder="Fecha de Nacimiento"
                value={fechaFormateada}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
            />
        );
    };

    const renderEdad = () => {
        const edadValue = datosEvolucion['Edad Paciente'] || datosPaciente.edad || '';

        return (
            <input
                type="text"
                id="edad"
                className="inputCampos"
                placeholder="Edad"
                value={edadValue}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, edad: e.target.value }))}
            />
        );
    };

    const renderUnidadMedida = () => {
        if (datosEvolucion['Id Unidad de Medida Edad']) {
            return (
                <select id="listaUnidadMedida" className="inputCampos" style={{ width: '220px' }} disabled>
                    <option key={datosEvolucion['Id Unidad de Medida Edad']} value={datosEvolucion['Id Unidad de Medida Edad']}>
                        {datosEvolucion['Unidad Medida']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaUnidadMedida" className="inputCampos" style={{ width: '220px' }} value={datosPaciente.unidadMedida} onChange={handleSelectChange}>
                    <option value="">Sin Seleccionar</option>
                    {listas.unidadMedidas.map(unidadMedida => (
                        <option key={unidadMedida.idUnidadEdad} value={unidadMedida.idUnidadEdad}>
                            {unidadMedida.nombreUnidadEdad}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderSexo = () => {
        if (datosEvolucion['Id Sexo']) {
            return (
                <select id="listaSexo" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Sexo']} value={datosEvolucion['Id Sexo']}>
                        {datosEvolucion['Descripción Sexo']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaSexo" className="inputCampos" name="sexo" value={datosPaciente.sexo} onChange={handleSelectChange}>
                    <option value="">Sin Seleccionar</option>
                    {listas.sexos.map(sexo => (
                        <option key={sexo.idListaSexo} value={sexo.idListaSexo}>
                            {sexo.nombreSexo}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderEstadoCivil = () => {
        if (datosEvolucion['Id Estado Civil']) {
            return (
                <select id="listaEstadoCivil" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Estado Civil']} value={datosEvolucion['Id Estado Civil']}>
                        {datosEvolucion['Estado Civil']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaEstadoCivil" className="inputCampos" name="estadoCivil" value={datosPaciente.estadoCivil} onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {listas.estadoCiviles.map(estadoCivil => (
                        <option key={estadoCivil.idEstadoCivil} value={estadoCivil.idEstadoCivil}>
                            {estadoCivil.nombreEstadoCivil}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderOcupacion = () => {
        if (datosEvolucion['Id Ocupación']) {
            return (
                <select id="listaOcupacion" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Ocupación']} value={datosEvolucion['Id Ocupación']}>
                        {datosEvolucion['Ocupación']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaOcupacion" className="inputCampos" name="ocupacion" value={datosPaciente.ocupacion} onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {listas.ocupaciones.map(ocupacion => (
                        <option key={ocupacion.idOcupacion} value={ocupacion.idOcupacion}>
                            {ocupacion.nombreOcupacion}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderAseguradora = () => {
        if (datosEvolucion['Documento Aseguradora']) {
            return (
                <select id="listaAseguradora" className="inputCampos" disabled>
                    <option key={datosEvolucion['Documento Aseguradora']} value={datosEvolucion['Documento Aseguradora']}>
                        {datosEvolucion['Nombre Aseguradora']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaAseguradora" className="inputCampos" name="aseguradora" value={datosPaciente.aseguradora} onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {listas.aseguradoras.map(aseguradora => (
                        <option key={aseguradora.documentoAseguradora} value={aseguradora.documentoAseguradora}>
                            {aseguradora.nombreAseguradora}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderTipoVinculacion = () => {
        if (datosEvolucion['Id Tipo de Afiliado']) {
            return (
                <select id="listaTipoAfiliado" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Tipo de Afiliado']} value={datosEvolucion['Id Tipo de Afiliado']}>
                        {datosEvolucion['Tipo de Afiliado']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaTipoAfiliado" className="inputCampos" name="tipoAfiliado" value={datosPaciente.tipoAfiliado} onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {listas.tipoAfiliados.map(tipoAfiliado => (
                        <option key={tipoAfiliado.idTipoAfiliado} value={tipoAfiliado.idTipoAfiliado}>
                            {tipoAfiliado.nombreTipoAfiliado}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderAcompanante = () => {
        const acompananteValue = datosEvolucion['Acompanante'] || datosPaciente.nombreAcompanante || '';

        return (
            <input
                type="text"
                id="nombreAcompanante"
                className="inputCampos"
                placeholder="Acompañante"
                value={acompananteValue}
                onChange={(e) => setDatosPaciente(prev => ({ ...prev, nombreAcompanante: e.target.value }))}
            />
        );
    };

    const renderParentescoAcompa = () => {
        if (datosEvolucion['Id Parentesco']) {
            return (
                <select id="listaParentescoAcompanante" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Parentesco']} value={datosEvolucion['Id Parentesco']}>
                        {datosEvolucion['Parentesco Acompanante']}
                    </option>
                </select>
            );
        } else {
            return (
                <select
                    id="listaParentescoAcompanante"
                    className="inputCampos"
                    value={datosPaciente.parentescoAcompanante} // Para controlar el valor seleccionado
                    onChange={(e) => setDatosPaciente({
                        ...datosPaciente,
                        parentescoAcompanante: e.target.value // Actualiza solo el parentesco
                    })}
                >
                    {listas.parentescos.map(parentesco => (
                        <option key={parentesco.idParentesco} value={parentesco.idParentesco}>
                            {parentesco.nombreParentesco}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderTelAcompanante = () => {
        if (datosEvolucion['Teléfono Acompañante']) {
            return (
                <input
                    type="text"
                    id="telefonoAcompanante"
                    className="inputCampos"
                    placeholder="Teléfono"
                    value={datosEvolucion['Teléfono Acompañante']}
                    readOnly
                />
            );
        } else {
            return (
                <input
                    type="text"
                    id="telefonoAcompanante"
                    className="inputCampos"
                    placeholder="Teléfono"
                    value={datosPaciente.telefonoAcompanante}
                    onChange={(e) => setDatosPaciente(prev => ({ ...prev, telefonoAcompanante: e.target.value }))}
                />
            );
        }
    };

    const renderResponsable = () => {
        if (datosEvolucion['Responsable']) {
            return (
                <input
                    type="text"
                    id="nombreResponsable"
                    className="inputCampos"
                    placeholder="Responsable"
                    value={datosEvolucion['Responsable']}
                    readOnly
                />
            );
        } else {
            return (
                <input
                    type="text"
                    id="nombreResponsable"
                    className="inputCampos"
                    placeholder="Responsable"
                    value={datosPaciente.nombreResponsable}
                    onChange={(e) => setDatosPaciente(prev => ({ ...prev, nombreResponsable: e.target.value }))}
                />
            );
        }
    };

    const renderParentescoRes = () => {
        if (datosEvolucion['Id Parentesco Responsable']) {
            return (
                <select id="listaParentescoResponsable" className="inputCampos" disabled>
                    <option key={datosEvolucion['Id Parentesco Responsable']} value={datosEvolucion['Id Parentesco Responsable']}>
                        {datosEvolucion['Parentesco Responsable']}
                    </option>
                </select>
            );
        } else {
            return (
                <select
                    id="listaParentescoResponsable"
                    className="inputCampos"
                    value={datosPaciente.parentescoResponsable}
                    onChange={(e) => setDatosPaciente({
                        ...datosPaciente,
                        parentescoResponsable: e.target.value
                    })}

                >
                    {listas.parentescos.map(parentesco => (
                        <option key={parentesco.idParentesco} value={parentesco.idParentesco}>
                            {parentesco.nombreParentesco}
                        </option>
                    ))}
                </select>
            );
        }
    };

    const renderTelRes = () => {
        if (datosEvolucion['Teléfono Responsable']) {
            return (
                <input
                    type="text"
                    id="telefonoResponsable"
                    className="inputCampos"
                    placeholder="Teléfono"
                    value={datosEvolucion['Teléfono Responsable']}
                    readOnly
                />
            );
        } else {
            return (
                <input
                    type="text"
                    id="telefonoResponsable"
                    className="inputCampos"
                    placeholder="Teléfono"
                    value={datosPaciente.telefonoResponsable}
                    onChange={(e) => setDatosPaciente(prev => ({ ...prev, telefonoResponsable: e.target.value }))}
                />
            );
        }
    };

    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const tipoEvaluacion = datosEvolucion['Id Tipo de Evaluación'] || selectedValue || '1';
    const Paciente = datosEvolucion['Nombre Paciente'] || datosPaciente.nombre || '';
    const Identificacion = datosEvolucion['Documento Paciente'] || datosPaciente.identificacion || '';
    const Telefono = datosEvolucion['Teléfono Domicilio'] || datosPaciente.telefono || '';
    const Edad = datosEvolucion['Edad Paciente'] || datosPaciente.edad || '';
    const Profesional = datosEvolucion['Nombre Profesional'] || datosEvolucion['Nombre Profesional'] || '';
    const Acompanante = datosEvolucion['Acompanante'] || datosPaciente.nombreAcompanante || '';
    const ParentescoAcom = datosEvolucion['Parentesco Acompanante'] || datosPaciente.nombreParentesco || '';
    const DiagGeneral = datosEvolucion['Diagnostico General'] || datosPaciente.diagGeneral || '';
    const DiagEspecifico = datosEvolucion['Diagnostico especifico'] || datosPaciente.diagEspecifico || '';

    // ↓↓↓↓↓↓ ESTA PARTE DE ACÁ ES SOLO PARA EL MANEJO DE LOS FORMATOS ↓↓↓↓↓↓
    const [datosFormato, setDatosFormato] = useState('');
    const [formatoSeleccionado, setFormatoSeleccionado] = useState('');
    const formatoRef = useRef(null); // Ref para Formatos
    const [formatoNoEncontrado, setFormatoNoEncontrado] = useState(false);


    const collectData = (datos, formato) => {
        console.log('Datos recolectados en Main:', datos, formato); // Mostrar en consola los datos recolectados
        setDatosFormato(datos);
        setFormatoSeleccionado(formato);
        insertarEvaluacionFormatos(datos, formato, datosPaciente, footer); // Aquí iría la lógica de inserción
    };

    const handlePruebaDeFormatosClick = () => {
        if (formatoRef.current) {
            const resultado = formatoRef.current.recolectarDatos(); // Llama la función de recolección de datos del componente Formatos
            if (resultado) {
                const { datos, formato } = resultado;
                collectData(datos, formato); // Recolecta y pasa los datos a collectData
            }
        }
    };
    // ↑↑↑↑↑ESTA PARTE DE ACÁ ES SOLO PARA CAPTURAR LAS FIRMAS EN BASE64 ↑↑↑↑↑↑


    // Muestra las firmas en consola cuando se actualizan

    const prueba = () => {
        console.log("Firma Paciente (Base64):", firmaPaciente);
        console.log("Firma Profesional (Base64):", firmaProfesional);
    }


    // ↓↓↓↓↓↓ ESTA PARTE DE ACÁ ES SOLO PARA CAPTURAR LAS FIRMAS EN BASE64  ↓↓↓↓↓↓

    // ↑↑↑↑↑ESTA PARTE DE ACÁ ES SOLO PARA EL MANEJO DE LOS FORMATOS ↑↑↑↑↑↑

    return (
        <MainContainer>
            <Header
                onLoadHistoriaClick={fetchHistoriaClinica}
                resetAndLoad={resetAndLoad}
                insertarEvaluacionEntidad={insertarEvaluacionEntidad}
                insertarEvaluacionFormatos={collectData} // Pasar collectData a Header
                datosFormato={datosFormato} // Pasar los datos
                formatoSeleccionado={formatoSeleccionado} // Pasar el formato
                handlePrint={handlePrint}
                handlePruebaDeFormatosClick={handlePruebaDeFormatosClick} />

            <div className="campos">
                <div className="datos_hc">
                    <div className="inputGroupContainer">
                        <div className="inputGroup">
                            <label htmlFor="paciente">Evaluación</label>
                            {renderTipoEvaluacion()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="Profesional">Profesional</label>
                            {renderProfesional()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="FechaYHora">Fecha y hora</label>
                            <input type="datetime-local" id="fechaHoraActual" className="inputCampos" placeholder="Fecha y hora" value={fechaHora} onChange={handleFechaHoraChange} />
                        </div>
                    </div>
                </div>

                <div className="datos_paciente">
                    <div className="inputGroupContainer">
                        <div className="inputGroup">
                            <label htmlFor="paciente">Paciente</label>
                            {renderPaciente()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="identificacion">Identificación</label>
                            {renderIdentifiacion()}

                        </div>
                        <div className="inputGroup">
                            <label htmlFor="historia">No. Historia</label>
                            {renderHistoria()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="direccion">Dirección Domicilio</label>
                            {renderDireccion()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="residencia">Lugar Residencia</label>
                            {renderCiudades()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="telefono">Teléfono</label>
                            {renderTelefono()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            {renderFechaNacimiento()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="edad">Edad</label>
                            {renderEdad()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="sexo">Unidad Medida</label>
                            {renderUnidadMedida()}

                        </div>
                        <div className="inputGroup">
                            <label htmlFor="sexo">Sexo</label>
                            {renderSexo()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="estadoCivil">Estado Civil</label>
                            {renderEstadoCivil()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="ocupacion">Ocupación</label>
                            {renderOcupacion()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="aseguradora">Aseguradora</label>
                            {renderAseguradora()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="tipoVinculacion">Tipo Vinculación</label>
                            {renderTipoVinculacion()}
                        </div>
                    </div>
                </div>

                <div className="datos_acompanante">
                    <div className="inputGroupContainer">
                        <div className="inputGroup">
                            <label htmlFor="Acompañante">Acompañante</label>
                            {renderAcompanante()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="Parentesco">Parentesco</label>
                            {renderParentescoAcompa()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="Teléfono">Teléfono</label>
                            {renderTelAcompanante()}
                        </div>
                    </div>
                </div>

                <div className="datos_responsable">
                    <div className="inputGroupContainer">
                        <div className="inputGroup">
                            <label htmlFor="Responsable">Responsable</label>
                            {renderResponsable()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="Parentesco">Parentesco</label>
                            {renderParentescoRes()}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="Teléfono">Teléfono</label>
                            {renderTelRes()}
                        </div>
                    </div>
                </div>

            </div>

            <div className="body">
                {selectedValue === '1' || selectedValue === '2' ? (
                    <>
                        {/* Diagnóstico General */}
                        <Diagnosticos
                            id="DiagGeneral"
                            className="autoTextarea"
                            value={datosEvolucion['Diagnostico General'] || datosPaciente.diagGeneral}
                            onChange={(e) =>
                                setDatosPaciente((prev) => ({ ...prev, diagGeneral: e.target.value }))
                            }
                            selectedValue={selectedValue}
                            headerTexts={headerTexts}
                            headerType="header1" // Usar header1 para el diagnóstico general
                        />

                        {/* Diagnóstico Específico */}
                        <Diagnosticos
                            id="DiagEspecifico"
                            className="autoTextarea"
                            value={datosEvolucion['Diagnostico especifico'] || datosPaciente.diagEspecifico}
                            onChange={(e) =>
                                setDatosPaciente((prev) => ({ ...prev, diagEspecifico: e.target.value }))
                            }
                            selectedValue={selectedValue}
                            headerTexts={headerTexts}
                            headerType="header2" // Usar header2 para el diagnóstico específico
                        />
                    </>
                ) : selectedValue === '4' ? (
                    <Formatos ref={formatoRef} onCollectAllData={collectData} datosEvolucion={datosEvolucion} />
                ) : (
                    <div>Seleccione un tipo de evaluación para mostrar información.</div>
                )}
            </div>

            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    <PrintContent data={{ tipoEvaluacion, Paciente, Identificacion, Telefono, Edad, Profesional, Acompanante, ParentescoAcom, DiagGeneral, DiagEspecifico, fechaHora }} />
                </div>
            </div>

            <Signatures setFirmaPaciente={setFirmaPaciente} setFirmaProfesional={setFirmaProfesional} firmaPaciente={firmaPaciente} />
            <ToastContainer />

        </MainContainer>
    );
}

const MainContainer = styled.div`
    width: 100%;
    margin: auto;
    box-sizing: border-box;
    background: ${({ theme }) => theme.bgtotal};

    .campos {
        width: 100%;
        padding: 10px;
    }
        
    .datos_hc,
    .datos_paciente,
    .datos_acompanante,
    .datos_responsable {
        width: 100%;
        background: ${({ theme }) => theme.bgtotal};
        border-radius: 10px;
        box-sizing: border-box;
    }

    .inputGroupContainer {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .inputGroup label {
        display: block;
        font-weight: bold;
        color: ${({ theme }) => theme.text};
        font-size: 12px;
    }

    .inputGroup input {
        width: 220px;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
        font-size: 14px;
    }

    .inputGroup input:focus {
        border-color: #3498db;
        outline: none;
    }

    .inputGroup select {
        width: 220px;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
        font-size: 14px;

    }

    .inputGroup select:focus {
        border-color: #3498db;
        outline: none;
    }

    .body {
        width: 100%;
        text-align: center;
        margin-top: 10px;
        font-size: 15px;

        h3 {
            font-size: 18px;
            font-weight: bold;
        }
    }

    .body textarea {
        width: 96%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        resize: none;
        overflow: hidden;
        font-size: 15px;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
    }

}

`

export default Main;
