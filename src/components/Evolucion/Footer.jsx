import { fetchData } from '../../services/apiService';
import { useState, useEffect } from 'react';
import SweetAlert2 from 'sweetalert2';
import styled from "styled-components";
import { useEvolucion } from '../../config/EvolucionContext';
import { servidor } from '../../config/config';
import { port } from '../../config/config';
import { useGlobalContext } from '../../config/GlobalContext';
import { ModalConfigRips } from './ModalConfigRips';
import { MODAL_RIPS_AC_POR_DEFECTO } from './ModalRipsPorDefecto/MODAL_RIPS_AC_POR_DEFECTO';
import { MODAL_RIPS_AP_POR_DEFECTO } from './ModalRipsPorDefecto/MODAL_RIPS_AP_POR_DEFECTO';


function Footer({ tipoRIPS, setTipoRIPS, selectedTipoRips, setSelectedTipoRips, selectedEntidad, setSelectedEntidad, selectedViaIngreso, setSelectedViaIngreso, selectedModalidad, setSelectedModalidad, selectedGrupoServicios, setSelectedGrupoServicios, selectedServicio, setSelectedServicio, selectedFinalidad, setSelectedFinalidad, selectedCausa, setSelectedCausa, selectedTipoDiag, setSelectedTipoDiag, selectedCUPS, setSelectedCUPS, selectedCUPS2, setSelectedCUPS2, selectedCIE, setSelectedCIE, selectedCIE2, setSelectedCIE2 }) {
    const { resetState } = useGlobalContext();
    const [selectedTipoConsulta, setSelectedTipoConsulta] = useState('');
    const [tiposRips, setTiposRips] = useState([]);
    const [tipoEntidad, setTipoEntidad] = useState([]);
    const [viaIngresos, setViaIngresos] = useState([]);
    const [modalidadGrupos, setModalidadGrupos] = useState([]);
    const [grupoServicios, setGrupoServicios] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [finalidades, setFinalidades] = useState([]);
    const [causas, setCausas] = useState([]);
    const [tipoDiagnosticos, setTipoDiagnosticos] = useState([]);
    const [procedimientos, setProcedimientos] = useState([]);
    const [diagnosticos, setDiagnosticos] = useState([]);

    const tipoRipsMap = {
        '1': '1',
        '2': '17',
        '3': '24',
        '4': '23'
    };

    const resetComponentState = () => {

        // SELECTED'S - reinicia los selectores a su estado inicial o predeterminado
        setSelectedTipoRips('Sin Seleccionar');
        setSelectedEntidad('Sin Seleccionar');
        setSelectedViaIngreso('Sin Seleccionar');
        setSelectedModalidad('Sin Seleccionar');
        setSelectedGrupoServicios('Sin Seleccionar');
        setSelectedServicio('Sin Seleccionar');
        setSelectedCausa('Sin Seleccionar');
        setSelectedTipoDiag('Sin Seleccionar');
        setSelectedCUPS('NULL');
        setSelectedCUPS2('');
        setSelectedCIE('NULL');
        setSelectedCIE2('');
    };

    const fetchDataFromAPI = async (fetchData, selectedTipoConsulta) => {
        try {
            const tipoRipsData = await fetchData('/listas/Rips/tipoRips');
            setTiposRips(tipoRipsData);

            const viaIngresoData = await fetchData('/listas/Rips/viaIngresoUsuario');
            setViaIngresos(viaIngresoData);

            const modalidadGrupoData = await fetchData('/listas/Rips/modalidadAtencion');
            setModalidadGrupos(modalidadGrupoData);

            const grupoServiciosData = await fetchData('/listas/Rips/grupoServicios');
            setGrupoServicios(grupoServiciosData);

            const serviciosData = await fetchData('/listas/Rips/servicios');
            setServicios(serviciosData);

            const causaData = await fetchData('/listas/Rips/causaExterna');
            setCausas(causaData);

            const tipoDiagData = await fetchData('/listas/Rips/tipoDiagnostico');
            setTipoDiagnosticos(tipoDiagData);

            const procedimientosData = await fetchData('/listas/Rips/codConsulta');
            setProcedimientos(procedimientosData);

            const diagnosticosData = await fetchData('/listas/Rips/codDiag');
            setDiagnosticos(diagnosticosData);

            if (selectedTipoConsulta) {
                const finalidadData = await fetchData(`/listas/Rips/finalidadConsulta/${selectedTipoConsulta}`);
                setFinalidades(finalidadData);
            }
        } catch (error) {
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    // Función para establecer las opciones por defecto
    const setDefaultOptions = async () => {
        try {
            const defaultRipsData = await fetchData('/listas/Rips/ripsPorDefecto');

            const defaultTipoRips = defaultRipsData[0]?.tipoRips;
            if (defaultTipoRips) {
                setSelectedTipoRips(defaultTipoRips);
            }

            const defaultViaIngreso = defaultRipsData[0]?.ViaIngreso;
            if (defaultViaIngreso) {
                setSelectedViaIngreso(defaultViaIngreso);
            }

            const defaultModalidad = defaultRipsData[0]?.ModalidadAtencion;
            if (defaultModalidad) {
                setSelectedModalidad(defaultModalidad);
            }

            console.log(`La modalidad es: ${defaultModalidad}`)

            const defaultGrupoServicios = defaultRipsData[0]?.GrupoServicio;
            if (defaultGrupoServicios) {
                setSelectedGrupoServicios(defaultGrupoServicios);
            }

            const defaultServicio = defaultRipsData[0]?.Servicio;
            if (defaultServicio) {
                setSelectedServicio(defaultServicio);
            }

            const defaultCausaExterna = defaultRipsData[0]?.CausaExterna;
            if (defaultCausaExterna) {
                setSelectedCausa(defaultCausaExterna);
            }

            console.log(`La Causa Externa es: ${defaultCausaExterna}`)


            const defaultTipoDiag = defaultRipsData[0]?.TipoDiag;
            if (defaultTipoDiag) {
                setSelectedTipoDiag(defaultTipoDiag);
            }

            const defaultCUPS = defaultRipsData[0]?.CUPS;
            if (defaultCUPS) {
                setSelectedCUPS(defaultCUPS);
            }

            const defaultCIE = defaultRipsData[0]?.CIE;
            if (defaultCIE) {
                setSelectedCIE(defaultCIE);
            }
        } catch (error) {
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    const fetchDataSequentially = async (fetchData, selectedTipoConsulta) => {
        await fetchDataFromAPI(fetchData, selectedTipoConsulta);
        await setDefaultOptions()
    };

    useEffect(() => {
        const fetchEntidadData = async () => {
            try {
                if (selectedTipoRips) {
                    // Mapea el tipo de Rips al código correspondiente
                    const codigoTipoRips = tipoRipsMap[selectedTipoRips] || '';

                    // Obtener entidades basadas en el tipo de Rips seleccionado
                    const response = await fetchData(`/listas/Rips/tipoEntidad/${codigoTipoRips}`);
                    setTipoEntidad(response);

                    // Obtener el valor por defecto desde la base de datos
                    const defaultEntidadData = await fetchData('/listas/Rips/ripsPorDefecto');
                    const defaultEntidad = defaultEntidadData[0]?.Entidad;


                    // Si se obtiene una entidad por defecto, establecerla como seleccionada
                    if (defaultEntidad) {
                        setSelectedEntidad(defaultEntidad);
                    }
                }
            } catch (error) {
                // SweetAlert2.fire('Error', error.message, 'error');
            }
        };

        fetchEntidadData();
    }, [selectedTipoRips]);


    useEffect(() => {
        var selectores = {
            "inputCodConsulta": "listaCodConsulta",
            "inputCodConsulta2": "listaCodConsulta2",
            "inputDiag": "listaDiag",
            "inputDiag2": "listaDiag2",
        };

        for (var inputId in selectores) {
            if (Object.prototype.hasOwnProperty.call(selectores, inputId)) {
                document.getElementById(inputId).addEventListener("input", function () {
                    buscarElementoPorInput(this.id);
                });
            }
        }

        function buscarElementoPorInput(inputId) {
            var inputValue = document.getElementById(inputId).value;
            var selectId = selectores[inputId];
            var select = document.getElementById(selectId);

            for (var i = 0; i < select.options.length; i++) {
                var elementoValue = select.options[i].value;
                if (elementoValue === inputValue) {
                    select.selectedIndex = i;
                    return;
                }
            }
        }
    }, [])

    const [formValues, setFormValues] = useState({
        codConsulta: '',
        codConsulta2: '',
        codDiag: '',
        codDiag2: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedCUPS(value); // Actualiza el valor de selectedCUPS cuando cambia el input
    };

    const handleInputChange2 = (event) => {
        const { name, value } = event.target;
        setSelectedCUPS2(value); // Actualiza el valor de selectedCUPS cuando cambia el input
    };

    const handleInputChangeDiag = (event) => {
        const { name, value } = event.target;
        setSelectedCIE(value); // Actualiza el valor de selectedCUPS cuando cambia el input
    };

    const handleInputChangeDiag2 = (event) => {
        const { name, value } = event.target;
        setSelectedCIE2(value); // Actualiza el valor de selectedCUPS cuando cambia el input
    };

    const handleSelectChange = (event) => {

        console.log(`El valor del tipo rips es: ${selectedTipoRips}`)
        const { name, value } = event.target;

        switch (name) {
            case 'tipoRips':
                setSelectedTipoRips(value);
                break;
            case 'entidad':
                setSelectedEntidad(value);
                break;
            case 'viaIngreso':
                setSelectedViaIngreso(value);
                break;
            case 'modalidadGrupo':
                setSelectedModalidad(value);
                break;
            case 'grupoServicios':
                setSelectedGrupoServicios(value);
                break;
            case 'servicio':
                setSelectedServicio(value);
                break;
            case 'causa':
                setSelectedCausa(value);
                break;
            case 'finalidad':
                setSelectedFinalidad(value);
                break;
            case 'tipoDiagnosticos':
                setSelectedTipoDiag(value);
                break;
            case 'CUPS':
                setSelectedCUPS(value);
                break;
            case 'CUPS2':
                setSelectedCUPS2(value);
                break;
            case 'CIE':
                setSelectedCIE(value);
                break;
            case 'CIE2':
                setSelectedCIE2(value);
                break;
            default:
                break;
        }
    };

    const { idEvaluacion, tipoHC } = useEvolucion();
    const [datosEvolucion, setDatosEvolucion] = useState({});

    useEffect(() => {
        // Solo ejecutar si hay `idEvaluacion` y si `tipoHC` es 'Evolución' o 'Historia Clínica Formato'
        if (idEvaluacion && (tipoHC === 'Evolución' || tipoHC === 'Historia Clínica Formato')) {

            const fetchEvaluacion = async () => {
                try {
                    // Definir la URL basada en el valor de tipoHC
                    const url = tipoHC === 'Evolución'
                        ? `http://${servidor}:${port}/api/evolucion/${idEvaluacion}`
                        : `http://${servidor}:${port}/api/formato-guardado/${idEvaluacion}`;

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Error al cargar la evaluación');
                    }
                    const data = await response.json();
                    setDatosEvolucion(data[0]);


                    const idActoQuirurgico = data[0]['Id Acto Quirúrgico'];
                    setTipoRIPS(idActoQuirurgico === 1 ? '1' : '2'); // Si es '1', selecciona AC; si no, selecciona AP
                    // Actualiza el estado `selectedTipoRips` con el valor de `Id Tipo de Rips`
                    setSelectedTipoRips(data[0]['Id Tipo de Rips']);


                    // Aquí podrías agregar más lógica específica para 'Historia Clínica Formato' si es necesario

                } catch (error) {
                    console.error('Error fetching evaluation data:', error);
                }
            };

            fetchEvaluacion();
        }
    }, [idEvaluacion, tipoHC]); // Añadir `tipoHC` como dependencia


    // Actualiza la UI cuando se cambia `tipoRIPS`
    useEffect(() => {
        const tipoConsulta = tipoRIPS === '1' ? 'Consulta' : 'del Procedimiento';

        document.querySelector('.listaTipoDiag').style.display = tipoRIPS === '1' ? 'grid' : 'none';
        document.querySelector('.listaViaIngreso').style.display = tipoRIPS === '1' ? 'none' : 'grid';
        document.querySelector('.listaCausaMotivo').style.display = tipoRIPS === '1' ? 'grid' : 'none';
        document.getElementById('textProcedimiento').textContent = tipoRIPS === '1' ? 'Consulta Rips' : 'Procedimiento Rips';

    }, [tipoRIPS]);

    useEffect(() => {
        fetchDataSequentially(fetchData, selectedTipoConsulta);
    }, []);


    const handleTipoConsultaChange = async (event) => {
        const selectedValue = event.target.value;
        setTipoRIPS(selectedValue); // Actualizas el estado con el tipo seleccionado

        // Determinar el tipo de consulta para la petición
        const tipoConsulta = selectedValue === '1' ? 'Consulta' : 'del Procedimiento';

        // Hacer la llamada para traer las opciones por defecto
        setDefaultOptions();

        try {
            // Hacer la petición para obtener la finalidad basada en el tipo de consulta seleccionado
            const finalidadData = await fetchData(`/listas/Rips/finalidadConsulta/${tipoConsulta}`);
            setFinalidades(finalidadData); // Actualizas el estado con los datos de finalidad

            // Ahora obtienes los datos por defecto
            const defaultRipsData = await fetchData('/listas/Rips/ripsPorDefecto');

            // Verifica si el tipo de RIPS es '1' (AC) o '2' (AP)
            if (selectedValue === '1') {
                // Si es AC (Archivo de Consulta), establece la finalidadConsulta
                const defaultFinalidad = defaultRipsData[0]?.finalidadConsulta;
                if (defaultFinalidad) {
                    setSelectedFinalidad(defaultFinalidad); // Estableces la finalidad de consulta
                }
            } else if (selectedValue === '2') {
                // Si es AP (Archivo de Procedimientos), establece la finalidadProcedimiento
                const defaultFinalidad = defaultRipsData[0]?.finalidadProcedimiento;
                if (defaultFinalidad) {
                    setSelectedFinalidad(defaultFinalidad); // Estableces la finalidad de procedimiento
                }
            }
        } catch (error) {
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    const renderTipoRips = () => {
        return (
            <select
                id="listaTipoRips"
                className="inputCampos"
                name="tipoRips"
                onChange={handleSelectChange}
                value={selectedTipoRips}
            >
                <option value="Sin Seleccionar">Sin Seleccionar</option>
                {!resetState && datosEvolucion && Object.keys(datosEvolucion).length > 0 && (
                    <option key={datosEvolucion['Id Tipo de Rips']} value={datosEvolucion['Id Tipo de Rips']}>
                        {datosEvolucion['Tipo Rips']}
                    </option>
                )}
                {tiposRips.map(tiposRips => (
                    <option key={tiposRips.idTipoRips} value={tiposRips.idTipoRips}>
                        {tiposRips.descripcionTipoRips}
                    </option>
                ))}
            </select>
        );
    };

    const renderTipoEntidad = () => {
        if (datosEvolucion['Documento Entidad']) {
            return (
                <select id="listaEntidad" className="inputCampos" >
                    <option key={datosEvolucion['Documento Entidad']} value={datosEvolucion['Documento Entidad']}>
                        {datosEvolucion['Nombre Entidad']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaEntidad" value={selectedEntidad} name="entidad" onChange={handleSelectChange}>
                    <option value="Sin Seleccionar">Sin Seleccionar</option>
                    {tipoEntidad.map(entidad => (
                        <option key={entidad.idEntidad} value={entidad.idEntidad}>
                            {entidad.descripcionEntidad}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderModalidad = () => {
        if (datosEvolucion['Id Modalidad Atencion']) {
            return (
                <select
                    id="listamodalidadAtencion"
                    className="inputCampos"
                    value={datosEvolucion['Id Modalidad Atencion']}
                >
                    <option key={datosEvolucion['Id Modalidad Atencion']} value={datosEvolucion['Id Modalidad Atencion']}>
                        {datosEvolucion['Modalidad Atencion']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listamodalidadAtencion" value={selectedModalidad} name="modalidadGrupo" onChange={handleSelectChange}>
                    <option value="Sin Seleccionar">Sin Seleccionar</option>
                    {modalidadGrupos.map(modalidadGrupo => (
                        <option key={modalidadGrupo.codigoModalidad} value={modalidadGrupo.codigoModalidad}>
                            {modalidadGrupo.nombreModalidad}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderGrupoServicios = () => {
        if (datosEvolucion['Id Grupo Servicios']) {
            return (
                <select id="listaGrupoServicios" className="inputCampos" >
                    <option key={datosEvolucion['Id Grupo Servicios']} value={datosEvolucion['Id Grupo Servicios']}>
                        {datosEvolucion['Grupo Servicios']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaGrupoServicios" value={selectedGrupoServicios} name="grupoServicios" onChange={handleSelectChange}>
                    <option value="Sin Seleccionar">Sin Seleccionar</option>
                    {grupoServicios.map(grupoServicio => (
                        <option key={grupoServicio.codigoServicios} value={grupoServicio.codigoServicios}>
                            {grupoServicio.nombreServicios}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderServicios = () => {
        if (datosEvolucion['Id Servicios']) {
            return (
                <select id="listaServicios" className="inputCampos" >
                    <option key={datosEvolucion['Id Servicios']} value={datosEvolucion['Id Servicios']}>
                        {datosEvolucion['Servicios']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaServicios" value={selectedServicio} name="servicio" onChange={handleSelectChange}>
                    <option value="Sin Seleccionar">Sin Seleccionar</option>
                    {servicios.map(servicio => (
                        <option key={servicio.codigoServicios} value={servicio.codigoServicios}>
                            {servicio.nombreServicios}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderFinalidad = () => {
        if (datosEvolucion['Id Finalidad Consulta']) {
            return (
                <select id="listaFinalidad" className="inputCampos" >
                    <option key={datosEvolucion['Id Finalidad Consulta']} value={datosEvolucion['Id Finalidad Consulta']}>
                        {datosEvolucion['Finalidad Consulta']}
                    </option>
                </select>
            );
        } else {
            return (
                <select name="finalidad" id="listaFinalidad" value={selectedFinalidad} onChange={handleSelectChange}>
                    <option value="Sin Seleccionar">Sin Seleccionar</option>
                    {finalidades.map(finalidad => (
                        <option key={finalidad.codigoFinalidad} value={finalidad.codigoFinalidad}>
                            {finalidad.nombreFinalidad}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderCausaExterna = () => {
        if (datosEvolucion['Id Causa Externa']) {
            return (
                <select id="listaCausaMotivo" className="inputCampos" >
                    <option key={datosEvolucion['Id Causa Externa']} value={datosEvolucion['Id Causa Externa']}>
                        {datosEvolucion['Causa Externa']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaCausaMotivo" value={selectedCausa} name="causa" onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {causas.map(causa => (
                        <option key={causa.codigoCausa} value={causa.codigoCausa}>
                            {causa.nombreCausa}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderTipoDiag = () => {
        if (datosEvolucion['Id Tipo de Diagnóstico Principal']) {
            return (
                <select id="listaTipoDiag" className="inputCampos" >
                    <option key={datosEvolucion['Id Tipo de Diagnóstico Principal']} value={datosEvolucion['Id Tipo de Diagnóstico Principal']}>
                        {datosEvolucion['Tipo Diagnostico Principal']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaTipoDiag" value={selectedTipoDiag} name="tipoDiagnosticos" onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {tipoDiagnosticos.map(tipoDiagnostico => (
                        <option key={tipoDiagnostico.codigoObjeto} value={tipoDiagnostico.codigoObjeto}>
                            {tipoDiagnostico.descripcionObjeto}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderViaIngreso = () => {
        if (datosEvolucion['Id Via Ingreso Usuario']) {
            return (
                <select id="listaViaIngreso" className="inputCampos" >
                    <option key={datosEvolucion['Id Via Ingreso Usuario']} value={datosEvolucion['Id Via Ingreso Usuario']}>
                        {datosEvolucion['Via Ingreso']}
                    </option>
                </select>
            );
        } else {
            return (
                <select id="listaViaIngreso" value={selectedViaIngreso} name="viaIngreso" onChange={handleSelectChange}>
                    <option value="1">Sin Seleccionar</option>
                    {viaIngresos.map(viaIngreso => (
                        <option key={viaIngreso.codigoObjeto} value={viaIngreso.codigoObjeto}>
                            {viaIngreso.descripcionObjeto}
                        </option>
                    ))}
                </select>
            )
        }
    }

    const renderCodConsulta = () => {
        if (datosEvolucion['Codigo Rips']) {
            return (
                <div className="proc1">
                    <input type="text" id="inputCodConsulta" className="inputCodigoRips" value={datosEvolucion['Codigo Rips']} />
                    <select id="listaCodConsulta" className="inputCampos" >
                        <option key={datosEvolucion['Codigo Rips']} value={datosEvolucion['Codigo Rips']}>
                            {datosEvolucion['Nombre Procedimiento']}
                        </option>
                    </select>
                </div>

            );
        } else {
            return (
                <div className="proc1">
                    <input type="text" id="inputCodConsulta" name="codConsulta" className="inputCodigoRips" value={selectedCUPS} onChange={handleInputChange} />
                    <select id="listaCodConsulta" className="inputRips" value={selectedCUPS} name="CUPS" onChange={handleSelectChange}>
                        <option value="Sin Seleccionar">Sin Seleccionar</option>
                        {procedimientos.map(procedimiento => (
                            <option key={procedimiento.codigoObjeto} value={procedimiento.codigoObjeto}>
                                {procedimiento.descripcionObjeto}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
    }

    const renderCodConsulta2 = () => {
        if (datosEvolucion['Codigo Rips2']) {
            return (
                <div className="proc1">
                    <input type="text" id="inputCodConsulta2" className="inputCodigoRips" value={datosEvolucion['Codigo Rips2']} />
                    <select id="listaCodConsulta2" className="inputCampos" >
                        <option key={datosEvolucion['Codigo Rips2']} value={datosEvolucion['Codigo Rips2']}>
                            {datosEvolucion['Nombre Procedimiento 2']}
                        </option>
                    </select>
                </div>
            );
        } else {
            return (
                <div className="proc2">
                    <input type="text" id="inputCodConsulta2" name="codConsulta2" className="inputCodigoRips" value={selectedCUPS2} onChange={handleInputChange2} />
                    <select id="listaCodConsulta2" className="inputRips" name="CUPS2" value={selectedCUPS2} onChange={handleSelectChange}>
                        <option value="Sin Seleccionar">Sin Seleccionar</option>
                        {procedimientos.map(procedimiento => (
                            <option key={procedimiento.codigoObjeto} value={procedimiento.codigoObjeto}>
                                {procedimiento.descripcionObjeto}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
    }

    const renderCodDiag = () => {
        if (datosEvolucion['Diagnostico Rips']) {
            return (
                <div className="diag1">
                    <input type="text" id="inputDiag" className="inputCodigoRips" value={datosEvolucion['Diagnostico Rips']} />
                    <select id="listaDiag" className="inputCampos" >
                        <option key={datosEvolucion['Diagnostico Rips']} value={datosEvolucion['Diagnostico Rips']}>
                            {datosEvolucion['Nombre Diagnóstico']}
                        </option>
                    </select>
                </div>

            );
        } else {
            return (
                <div className="diag1">
                    <input type="text" id="inputDiag" name="codDiag" className="inputCodigoRips" value={selectedCIE} onChange={handleInputChangeDiag} />
                    <select className="inputDiag" id="listaDiag" value={selectedCIE} name="CIE" onChange={handleSelectChange}>
                        <option value="Sin Seleccionar">Sin Seleccionar</option>
                        {diagnosticos.map(diagnostico => (
                            <option key={diagnostico.codigoObjeto} value={diagnostico.codigoObjeto}>
                                {diagnostico.descripcionObjeto}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
    }

    const renderCodDiag2 = () => {
        if (datosEvolucion['Diagnostico Rips2']) {
            return (
                <div className="diag2">
                    <input type="text" id="inputDiag2" className="inputCodigoRips" value={datosEvolucion['Diagnostico Rips2']} />
                    <select id="listaDiag2" className="inputCampos" >
                        <option key={datosEvolucion['Diagnostico Rips2']} value={datosEvolucion['Diagnostico Rips2']}>
                            {datosEvolucion['Nombre Diagnostico 2']}
                        </option>
                    </select>
                </div>

            );
        } else {
            return (
                <div className="diag2">
                    <input type="text" id="inputDiag2" name="codDiag2" className="inputCodigoRips" value={selectedCIE2} onChange={handleInputChangeDiag2} />
                    <select className="inputDiag" id="listaDiag2" name="CIE2" onChange={handleSelectChange} value={selectedCUPS2}>
                        <option value="Sin Seleccionar">Sin Seleccionar</option>
                        {diagnosticos.map(diagnostico => (
                            <option key={diagnostico.codigoObjeto} value={diagnostico.codigoObjeto}>
                                {diagnostico.descripcionObjeto}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
    }

    useEffect(() => {
        if (resetState) {
            setTipoRIPS(''); // Reinicia el estado de tipoRIPS
            setSelectedTipoRips([])
            setDatosEvolucion({}); // Limpia los datos de evolución
            setFormValues(prev => ({ ...prev, codConsulta: '' }));
            setFormValues(prev => ({ ...prev, codConsulta2: '' }));
            setFormValues(prev => ({ ...prev, codDiag: '' }));
            setFormValues(prev => ({ ...prev, codDiag2: '' }));
            resetComponentState();
        }
    }, [resetState]);

    return (

        <FooterContainer>
            <div className="datosRIPS">
                <div className="CP" style={{display: "flex"}}>
                    <div style={{width: "31%"}}>
                        <input type="radio" name="tipoRIPS" id="radioAC" value="1" onChange={handleTipoConsultaChange} checked={tipoRIPS === '1'} />
                        <span>Archivo de Consulta(AC)</span>

                        <input type="radio" name="tipoRIPS" id="radioAP" value="2" onChange={handleTipoConsultaChange} checked={tipoRIPS === '2'} />
                        <span>Archivo de Procedimientos(AP)</span>
                    </div>

                    <div style={{width: "69%", display: "flex"}}>
                        <div style={{width: "50%"}}>
                            <MODAL_RIPS_AC_POR_DEFECTO/>
                        </div>

                        <div style={{width: "50%"}}>
                            <MODAL_RIPS_AP_POR_DEFECTO/>
                        </div>
                    </div>
                </div>

                <div className="listas">
                    <div className="listas-group">
                        <span>Tipo de Rips:</span>
                        {renderTipoRips()}
                    </div>

                    <div className="listas-group">
                        <span>Entidad</span>
                        {renderTipoEntidad()}
                    </div>

                    <div className="listas-group listaViaIngreso" style={{ display: 'none' }}>
                        <span>viaIngresoServicioSalud</span>
                        {renderViaIngreso()}
                    </div>

                    <div className="listas-group">
                        <span>modalidadGrupoServicioTecSal</span>
                        {renderModalidad()}
                    </div>

                    <div className="listas-group">
                        <span>grupoServicios</span>
                        {renderGrupoServicios()}
                    </div>

                    <div className="listas-group">
                        <span>codServicio</span>
                        {renderServicios()}
                    </div>

                    <div className="listas-group">
                        <span>finalidadTecnologiaSalud</span>
                        {renderFinalidad()}
                    </div>

                    <div className="listas-group listaCausaMotivo">
                        <span>causaMotivoAtencion</span>
                        {renderCausaExterna()}
                    </div>

                    <div className="listas-group listaTipoDiag">
                        <span id="textTipoDiag">tipoDiagnosticoPrincipal</span>
                        {renderTipoDiag()}
                    </div>

                    <div className="listas-group listaCausaMotivo">
                        {/* <ModalConfigRips /> */}
                    </div>


                </div>
            </div>

            <div className="tipoRIPS">
                <div className="procedimientos">
                    <span id="textProcedimiento">Consulta Rips</span>
                    {renderCodConsulta()}

                    {renderCodConsulta2()}
                </div>

                <div className="diagnosticos">
                    <span>Diagnóstico Rips</span>
                    {renderCodDiag()}

                    {renderCodDiag2()}
                </div>
            </div>
        </FooterContainer>
    );
}


const FooterContainer = styled.div`
    width: 100%;
    margin: auto;
    padding: 8px;
    box-sizing: border-box;
    background: ${({ theme }) => theme.bgtotal};


    .tipoRIPS {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 5px;
    }

    .datosRIPS {
        display: grid;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }

    .datosRIPS span {
        margin-right: 10px;
        font-weight: bold;
        font-size: 12px;
    }

    .datosRIPS input[type="radio"] {
        margin-right: 5px;
    }


    .datosRIPS select {
        padding: 5px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
        width: 200px;
    }

    .datosRIPS .listas {
        display: flex;
        flex-wrap: wrap;
    }

    .datosRIPS .listas .listas-group {
        display: grid;
    }

    .tipoRIPS .procedimientos {
        width: 50%;
    }

    .tipoRIPS .diagnosticos {
        width: 50%;
    }

    .tipoRIPS .inputCodigoRips {
        width: 80px;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
    }

    .tipoRIPS .inputRips {
        width: 78%;
    }

    .tipoRIPS .inputDiag {
        width: 78%;
        
    }

    .tipoRIPS .procedimientos select {
        width: 78%;
    }

    .tipoRIPS select {
        padding: 5px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: ${({ theme }) => theme.bgtotal};
        color: ${({ theme }) => theme.text};
        width: 80%;
    }

    .tipoRIPS span {
        margin-right: 10px;
        font-weight: bold;
        font-size: 12px;
    }
`
export default Footer;
