import { useEffect, useState } from 'react';
import Sidebar from '../components/Evolucion/Sidebar';
import Main from '../components/Evolucion/Main';
import Footer from '../components/Evolucion/Footer';
import '../styles/Evolucion.css';
import Swal from 'sweetalert2';
import { useEmpresa } from '../config/EmpresaContext';
import { usePaciente } from '../config/PacienteContext';
import { EvolucionProvider } from '../config/EvolucionContext';
import { GlobalProvider } from '../config/GlobalContext';
import { MensajeDeCarga } from '../components/Alerts/MensajeDeCarga';
import { servidor, port } from '../config/config';
import { useUsuario } from '../config/UsuarioContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Importa useLocation

export function Evolucion() {
    // const { documentoPaciente, setDocumentoPaciente } = usePaciente();
    // const { empresaSeleccionada } = useEmpresa();

    // const docEmpresa = empresaSeleccionada.documentoEmpresa;

    const { documentoPaciente, setDocumentoPaciente } = usePaciente();
    const { empresaSeleccionada } = useEmpresa();

    const docEmpresa = empresaSeleccionada.documentoEmpresa;


    const location = useLocation(); // Obtén la ubicación
    const { documentoPaciente: documentoDesdeTabla } = location.state || {}; // Extrae el documento

    // const { setDocumentoPaciente } = usePaciente();

    // Usa el documento pasado para establecer el estado
    useEffect(() => {
        if (documentoDesdeTabla) {
            setDocumentoPaciente(documentoDesdeTabla); // Establece el documento en el contexto
        }
    }, [documentoDesdeTabla, setDocumentoPaciente]);

    // CONSTANTES DEL LOS VALORES DE LAS LISTAS SELECCIONADAS EN EL FOOTER
    const [tipoRIPS, setTipoRIPS] = useState('');
    const [selectedTipoRips, setSelectedTipoRips] = useState('');
    const [selectedEntidad, setSelectedEntidad] = useState('Sin Seleccionar');
    const [selectedViaIngreso, setSelectedViaIngreso] = useState([]);
    const [selectedModalidad, setSelectedModalidad] = useState([]);
    const [selectedGrupoServicios, setSelectedGrupoServicios] = useState([]);
    const [selectedServicio, setSelectedServicio] = useState([]);
    const [selectedFinalidad, setSelectedFinalidad] = useState([]);
    const [selectedCausa, setSelectedCausa] = useState([]);
    const [selectedTipoDiag, setSelectedTipoDiag] = useState([]);
    const [selectedCUPS, setSelectedCUPS] = useState([]);
    const [selectedCUPS2, setSelectedCUPS2] = useState([]);
    const [selectedCIE, setSelectedCIE] = useState([]);
    const [selectedCIE2, setSelectedCIE2] = useState([]);

    //CONSTANTE DE MAIN
    const { documentoEntidad, nombreUsuario } = useUsuario();
    const [datosPaciente, setDatosPaciente] = useState({
        nombre: '',
        identificacion: '',
        direccion: '',
        telefono: '',
        edad: '',
        unidadMedida: '',
        sexo: '',
        ocupacion: '',
        residencia: '',
        estadoCivil: '',
        aseguradora: '',
        tipoAfiliado: '',
        parentescoResponsable: '',
        fechaNacimiento: '',
        nombreAcompanante: 'Sin Acompañante',
        telefonoAcompanante: 'Sin Asignar',
        parentescoAcompanante: '',
        nombreResponsable: 'Sin Acompañante',
        telefonoResponsable: 'Sin Asignar',
        diagGeneral: '',
        diagEspecifico: '',
    });

    // CONSTANTES DE ALMACENAN LA FIRMA EN BASE64
    const [firmaPaciente, setFirmaPaciente] = useState(null);
    const [firmaProfesional, setFirmaProfesional] = useState(null);

    const footer = { tipoRIPS, selectedTipoRips, selectedEntidad, selectedViaIngreso, selectedModalidad, selectedGrupoServicios, selectedServicio, selectedFinalidad, selectedCausa, selectedTipoDiag, selectedCUPS, selectedCUPS2, selectedCIE, selectedCIE2 }

    const insertarEvaluacionFormatos = (diagnosticoGeneral, formatoData, datosPaciente, footer) => {
        if (!diagnosticoGeneral || !formatoData) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos antes de continuar.',
                confirmButtonColor: '#2c3e50',
            });
            return;
        }
        console.log('Footer:', footer); // Verifica el contenido del footer

        const rutaArchivo = `\\Formatos HC\\${formatoData}`;
        const payload = {
            diagnosticoGeneral,
            rutaArchivo,
            docEmpresa,
            documentoEntidad,
            ...datosPaciente,
            firmaPaciente,
            ...footer
        };

        axios.post(`http://${servidor}:${port}/api/evolucion/formatos/insertar`, payload)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Insertado correctamente',
                    text: 'El formato ha sido insertado exitosamente.',
                    confirmButtonColor: '#2c3e50',
                });
                console.log('Insertado correctamente:', response);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al insertar',
                    text: 'Ocurrió un error al intentar insertar el formato. Inténtalo nuevamente.',
                    confirmButtonColor: '#2c3e50',
                });
                console.error('Error al insertar:', error);
            });
    };

    // console.log(`Las constantes del MAIN son: ${JSON.stringify(datosPaciente, null, 2)}`);

    // Este useEffect se ejecuta solo una vez cuando se monta el componente
    useEffect(() => {
        // Mostrar el mensaje de carga cuando el componente se monta
        MensajeDeCarga('Cargando información del paciente...');

        // // Cerrar el mensaje de carga después de 5 segundos
        // const timer = setTimeout(() => {
        //     Swal.close();

        //     // Ejecutar el segundo Swal después de que se cierra el mensaje de carga
        //     if (!documentoPaciente) {
        //         Swal.fire({
        //             title: 'Ingresar Documento',
        //             input: 'text',
        //             inputPlaceholder: 'Ingrese el documento del paciente',
        //             inputValue: documentoPaciente || '', // Aquí se establece el valor del input
        //             showCancelButton: false,
        //             confirmButtonText: 'Cargar Paciente',
        //             confirmButtonColor: '#2c3e50',
        //             inputValidator: (value) => {
        //                 if (!value) {
        //                     return 'Debe ingresar un documento!';
        //                 }
        //             }
        //         }).then((result) => {
        //             if (result.isConfirmed) {
        //                 setDocumentoPaciente(result.value);
        //             }
        //         });
        //     } else {
        //         console.log("El documento ya está morr, se pasó desde la tabla de usuairos..");
        //     }
        // }, 2000);
        // Ejecutar el SweetAlert después de que se cierra el mensaje de carga

        const timer = setTimeout(() => {
            Swal.close();

            // Mostrar el SweetAlert solo si no hay documento
            if (!documentoPaciente) {
                Swal.fire({
                    title: 'Ingresar Documento',
                    input: 'text',
                    inputPlaceholder: 'Ingrese el documento del paciente',
                    inputValue: '', // Aquí se establece el valor del input
                    showCancelButton: false,
                    confirmButtonText: 'Cargar Paciente',
                    confirmButtonColor: '#2c3e50',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debe ingresar un documento!';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setDocumentoPaciente(result.value);
                    }
                });
            } else {
                console.log("El documento ya está, se pasó desde la tabla de usuarios.");
            }
        }, 2000); // Ajusta el tiempo según sea necesario

        // Limpiar el temporizador en caso de que el componente se desmonte antes
        return () => clearTimeout(timer);
    }, [documentoPaciente, setDocumentoPaciente]);

    return (
        <EvolucionProvider>
            <GlobalProvider>
                <div className="containerEvolucion">
                    <Sidebar />
                    <div className="content">
                        <Main
                            documentoPaciente={documentoPaciente}
                            insertarEvaluacionFormatos={insertarEvaluacionFormatos}
                            footer={footer}
                            datosPaciente={datosPaciente}
                            setDatosPaciente={setDatosPaciente}
                            firmaPaciente={firmaPaciente}
                            setFirmaPaciente={setFirmaPaciente}
                            firmaProfesional={firmaProfesional}
                            setFirmaProfesional={setFirmaProfesional}
                        />
                        <Footer
                            tipoRIPS={tipoRIPS}
                            setTipoRIPS={setTipoRIPS}
                            selectedTipoRips={selectedTipoRips}
                            setSelectedTipoRips={setSelectedTipoRips}
                            selectedEntidad={selectedEntidad}
                            setSelectedEntidad={setSelectedEntidad}
                            selectedViaIngreso={selectedViaIngreso}
                            setSelectedViaIngreso={setSelectedViaIngreso}
                            selectedModalidad={selectedModalidad}
                            setSelectedModalidad={setSelectedModalidad}
                            selectedGrupoServicios={selectedGrupoServicios}
                            setSelectedGrupoServicios={setSelectedGrupoServicios}
                            selectedServicio={selectedServicio}
                            setSelectedServicio={setSelectedServicio}
                            selectedFinalidad={selectedFinalidad}
                            setSelectedFinalidad={setSelectedFinalidad}
                            selectedCausa={selectedCausa}
                            setSelectedCausa={setSelectedCausa}
                            selectedTipoDiag={selectedTipoDiag}
                            setSelectedTipoDiag={setSelectedTipoDiag}
                            selectedCUPS={selectedCUPS}
                            setSelectedCUPS={setSelectedCUPS}
                            selectedCUPS2={selectedCUPS2}
                            setSelectedCUPS2={setSelectedCUPS2}
                            selectedCIE={selectedCIE}
                            setSelectedCIE={setSelectedCIE}
                            selectedCIE2={selectedCIE2}
                            setSelectedCIE2={setSelectedCIE2}
                        />
                    </div>
                </div>
            </GlobalProvider>
        </EvolucionProvider>
    );
}
