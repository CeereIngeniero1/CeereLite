import React, { useState, useEffect } from "react"; // PARA INTERACCIONES REACT
import styled from "styled-components"; // PARA DAR ESTILOS A LOS COMPONENTES
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"; // PARA TRABAJAR CON COMPONENTES DE NEXTUI
import axios from "axios"; // PARA TRABAJAR CON PETICIONES HTTP
import { servidor, port } from "../../../config/config"; // PARA IMPORTAR LOS VALORES DE LAS VARIABLES SERVIDOR Y PUERTO A TRABAJAR
import Swal from "sweetalert2"; // PARA TRABAJAR CON MENSAJES DE ALERTA
import ReutilizarSelect from "./ReutilizarSelect"; // PARA MANEJAR EL SELECT REUTILIZABLE
import Select from "react-select"; // MANEJO DE SELECT PROPIO DE REACT-SELECT, INCORPORA BUSCADOR
import { useUsuario } from "../../../config/UsuarioContext"; // PARA TRABAJAR CON EL DOCUMENTO DEL USUARIO LOGUEADO

export function MODAL_RIPS_AC_POR_DEFECTO() {
  // Se captura el nombre y el documento del profesional que se loguea
  const { documentoEntidad, nombreUsuario } = useUsuario();

  // Se define la dirección del API de RIPS
  const DireccionServidorAPIS_RIPS = `http://${servidor}:${port}/api/Rips`;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");
  const [size, setSize] = useState("4xl");

  // SE CREAN VARIABLES/ESTADO PARA CADA UNA DE LAS LISTAS
  const [TipoRips, SetTipoRips] = useState("");
  const [Entidades, SetEntidades] = useState([]);
  const [IdEntidades, SetIdEntidades] = useState("");
  const [ModalidadGrupoServicioTecSalud, SetModalidadGrupoServicioTecSalud] =
    useState("");
  const [GrupoServicios, SetGrupoServicios] = useState("");
  const [Servicio, SetServicio] = useState([]);
  const [IdServicio, SetIdServicio] = useState("");
  const [FinalidadTecnologiaSaludAC, SetFinalidadTecnologiaSaludAC] =
    useState("");
  const [CausaMotivoAtencion, SetCausaMotivoAtencion] = useState("");
  const [TipoDiagnosticoPrincipal, SetTipoDiagnosticoPrincipal] = useState("");
  const [ConsultaRips1, SetConsultaRips1] = useState("");
  const [ConsultaRips1Manual, SetConsultaRips1Manual] = useState([]);
  // _________________________________
  const [opcionesConsultaRips, setOpcionesConsultaRips] = useState([]);
  const [opcionesConsultaRips2, setOpcionesConsultaRips2] = useState([]);
  const [opcionesProcedimiento, SetOpcionesProcedimiento] = useState([]);
  const [opcionesProcedimiento2, SetOpcionesProcedimiento2] = useState([]);
  const [consultaSeleccionada, setConsultaSeleccionada] =
    useState("Sin Seleccionar");

  // ESTADO PARA HABILITAR LOS BOTONES GUARDAR, ACTUALIZAR Y ELIMINAR RIPS POR DEFECTO
  const [HabilitarBotonGuardar, SetHabilitarBotonGuardar] = useState(true); // Estado para habilitar
  const [HabilitarBotonActualizar, SetHabilitarBotonActualizar] =
    useState(true); // Estado para habilitar
  const [HabilitarBotonEliminar, SetHabilitarBotonEliminar] = useState(true); // Estado para habilitar
  // ______________________________________________________________________________________________________________________

  // OTROS PRUEBA
  const [ValorTipoRips, SetValorTipoRips] = useState("");
  const [ValorEntidad, SetValorEntidad] = useState("");
  const [ValorModalidad, SetValorModalidad] = useState("");
  const [ValorGrupoServicio, SetValorGrupoServicio] = useState("");
  const [ValorServicio, SetValorServicio] = useState("");
  const [ValorFinalidad, SetValorFinalidad] = useState("");
  const [ValorCausaMotivoAtencion, SetValorCausaMotivoAtencion] = useState("");
  const [ValorTipoDiagnosticoPrincipal, SetValorTipoDiagnosticoPrincipal] =
    useState("");
  // ______________________________________________________________________________________________________________________

  const handleOpen = async ({ backdrop = "", size = "" }) => {
    if (backdrop) setBackdrop(backdrop);
    if (size) setSize(size);
    onOpen(); // Abrir el modal después de la verificación

    // CONSULTAR RIPS AC POR DEFECTO QUE TENGA EL PROFESIONAL
    try {
      const Respuesta = await axios.get(
        `${DireccionServidorAPIS_RIPS}/ConsultarRipsPorDefecto`,
        {
          params: {
            DocumentoProfesional: documentoEntidad,
            TipoRIPS: 1,
          },
        }
      );

      if (Respuesta.status === 200) {
        if (
          Respuesta &&
          Respuesta.data &&
          Respuesta.data.datos &&
          Respuesta.data.datos.length > 0
        ) {
          SetHabilitarBotonGuardar(true); // Deshabilitar el botón si no hay datos
          SetHabilitarBotonActualizar(false);
          SetHabilitarBotonEliminar(false);

          // console.log(Respuesta.data.datos);

          // PARA LOS SELECT DE NEXTUI CON COMPONENTE REUTILIZADO
          const TipoRipsRecibido = Respuesta.data.datos[0].TipoDeUsuario;
          SetValorTipoRips(TipoRipsRecibido);

          const Entidad = Respuesta.data.datos[0].Entidad;
          SetValorEntidad(Entidad);

          const Modalidad =
            Respuesta.data.datos[0].ModalidadGrupoServicioTecnologiaEnSalud;
          SetValorModalidad(Modalidad);

          const GrupoServicio = Respuesta.data.datos[0].GrupoServicios;
          SetValorGrupoServicio(GrupoServicio);

          // const Servicio = Respuesta.data.datos[0].Servicio;

          const Finalidad = Respuesta.data.datos[0].FinalidadTecnologiaSalud;
          SetValorFinalidad(Finalidad);

          const CausaMotivo = Respuesta.data.datos[0].CausaMotivoAtencion;
          SetValorCausaMotivoAtencion(CausaMotivo);

          const DiagnosticoPrincipal =
            Respuesta.data.datos[0].TipoDiagnosticoPrincipal;
          SetValorTipoDiagnosticoPrincipal(DiagnosticoPrincipal);
          // _________________________________________________________________________________________

          // PARA LOS SELECTS DE REACT QUE INCORPORAN BUSCADOR
          const optionToSelect = opcionesConsultaRips.find(
            (option) => option.value === Respuesta.data.datos[0].Diagnostico1
          );
          setSelectedOption(optionToSelect);

          const ValorPrueba2 = opcionesConsultaRips2.find(
            (option) => option.value === Respuesta.data.datos[0].Diagnostico2
          );
          SetOpcionMarcadaConsultaRips2(ValorPrueba2);

          const optionToSelect2 = opcionesProcedimiento.find(
            (option) => option.value === Respuesta.data.datos[0].Procedimiento1
          );
          SetOpcionMarcadaDiagnostico1(optionToSelect2);

          const optionToSelect3 = opcionesProcedimiento2.find(
            (option) => option.value === Respuesta.data.datos[0].Procedimiento2
          );
          SetOpcionMarcadaDiagnostico2(optionToSelect3);
          // _________________________________________________________________________________________
        } else {
          SetHabilitarBotonGuardar(false);
          SetHabilitarBotonActualizar(true);
        }
      }
    } catch (error) {
      // Manejo de errores de Axios
      Swal.fire({
        icon: "error",
        html: `
                <strong>Hubo un error al consultar el RIPS AC por defecto: ${
                  error.response ? error.response.data.error : error.message
                }</strong>
              `,
        showConfirmButton: false,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // Deshabilitar el select usando el id
    const selectElement = document.getElementById("TipoDeRipsAC");
    if (selectElement) {
      selectElement.disabled = true; // Deshabilita el select
    }
  }, []);
  // useEffect(() => {
  //   const fetchConsulta1 = async () => {
  //     try {
  //       const respuesta = await axios.get(`${DireccionServidorAPIS_RIPS}/Cups/AP`);
  //       setOpcionesConsultaRips(respuesta.data);
  //     } catch (error) {
  //       console.error('Error al obtener consultas:', error);
  //     }
  //   };
  //   fetchConsulta1();
  // }, []);

  // const CambiarAlSeleccionar = (event) => {
  //   setConsultaSeleccionada(event.target.value);
  // }

  // PARA LLENAR LOS SELECTS DE CONSUTLAS 1 Y 2
  useEffect(() => {
    const fetchConsulta1 = async () => {
      try {
        const respuesta = await axios.get(
          `${DireccionServidorAPIS_RIPS}/Cups/AC`
        );
        // Mapea los datos a un formato que `react-select` pueda usar
        const opciones = respuesta.data.map((item) => ({
          value: item.value,
          label: item.text,
        }));
        setOpcionesConsultaRips(opciones);
        setOpcionesConsultaRips2(opciones);
      } catch (error) {
        console.error("Error al obtener consultas:", error);
      }
    };
    fetchConsulta1();
  }, []);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const respuesta = await axios.get(`${DireccionServidorAPIS_RIPS}/Cie`);
        // Mapea los datos a un formato que `react-select` pueda usar
        const opciones = respuesta.data.map((item) => ({
          value: item.value,
          label: truncateOptionLabel(item.text),
        }));
        SetOpcionesProcedimiento(opciones);
        SetOpcionesProcedimiento2(opciones);
      } catch (error) {
        console.error("Error al obtener diagnosticos:", error);
      }
    };
    fetchDiagnosticos();
  }, []);
  // ____________________________________________________________________________________________

  // ESTILOS PARA LOS SELECTS CON BUSCADOR Y CON MUCHOS REGISTROS
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "96%",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Asegúrate de que el z-index sea mayor que el del modal
    }),
  };

  const truncateOptionLabel = (label) => {
    return label.length > 120 ? label.substring(0, 120) + "..." : label;
  };
  // ____________________________________________________________________________________________

  // FUNCIONALIDAD PARA LLENAR EL SELECT DE ENTIDADES DEPENDIENDO DE LO SELECCIONADO EN EL SELECT TIPO DE RIPS
  useEffect(() => {
    if (TipoRips !== "SinSeleccionar" || !TipoRips) {
      axios
        .get(`${DireccionServidorAPIS_RIPS}/Entidades`, {
          params: {
            Tipo: TipoRips, // Envía el parámetro en el cuerpo
          },
        })
        .then((response) => {
          // console.log('Datos recibidos:', response.data); // Verifica aquí
          SetEntidades(response.data);
          SetIdEntidades("SinSeleccionar");
        })
        .catch((error) => {
          // Manejo de errores
          console.error("Error al obtener entidades:", error);
        });
    } else {
      SetEntidades([]);
      SetIdEntidades("SinSeleccionar");
    }
  }, [TipoRips]);
  // _________________________________________________________________________________________________________________________

  // FUNCIONALIDAD PARA LLENAR EL SELECT DE SERVICIOS DEPENDIENDO DEL GRUPO SERVICIO QUE SE HAYA SELECCIONADO
  useEffect(() => {
    if (GrupoServicios !== "SinSeleccionar" || !GrupoServicios) {
      axios
        .get(`${DireccionServidorAPIS_RIPS}/CodServicio`, {
          params: {
            GrupoServicio: GrupoServicios, // Envía el parámetro en el cuerpo
          },
        })
        .then((response) => {
          // console.log('Datos recibidos:', response.data); // Verifica aquí
          SetServicio(response.data);
          SetIdServicio("SinSeleccionar");
        })
        .catch((error) => {
          // Manejo de errores
          console.error("Error al obtener códigos de servicios:", error);
        });
    } else {
      SetServicio([]);
      SetIdServicio("SinSeleccionar");
    }
  }, [GrupoServicios]);
  // _________________________________________________________________________________________________________________________

  // FUNCIONALIDAD PARA LLENAR EL SELECT DE CONSULTAS
  // useEffect(() => {
  //   const fetchConsulta1 = async () => {
  //     try {
  //       const respuesta = await axios.get(`${DireccionServidorAPIS_RIPS}/Cups/AP`);
  //       console.log('Datos recibidos:', respuesta.data); // Verifica los datos aquí
  //       SetConsultaRips1Manual(respuesta.data);
  //     } catch (error) {
  //       console.error('Error al obtener consultas:', error);
  //     }
  //   };
  //   fetchConsulta1();
  // }, []);

  // const CambiarAlSeleccionar = (event) => {
  //   SetConsultaRips1Manual(event.target.value);
  // }

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  const [OpcionMarcadaConsultaRips2, SetOpcionMarcadaConsultaRips2] =
    useState(null);
  const handleChangeConsultaRips2 = (selected) => {
    SetOpcionMarcadaConsultaRips2(selected);
  };

  const [OpcionMarcadaDiagnostico1, SetOpcionMarcadaDiagnostico1] =
    useState(null);
  const MarcarDiagnostico1 = (selected) => {
    SetOpcionMarcadaDiagnostico1(selected);
  };
  const [OpcionMarcadaDiagnostico2, SetOpcionMarcadaDiagnostico2] =
    useState(null);
  const MarcarDiagnostico2 = (selected) => {
    SetOpcionMarcadaDiagnostico2(selected);
  };

  // FUNCIONALIDAD PARA LOS RIPS POR DEFECTO
  const GUARDAR_RIPS_POR_DEFECTO = async () => {
    let DatosAEnviarAServidor = {
      DocumentoProfesional: documentoEntidad,
      TipoRIPS: 1,
      TipoDeUsuario: TipoRips === "SinSeleccionar" ? null : TipoRips,
      Entidad: IdEntidades === "SinSeleccionar" ? null : IdEntidades,
      ModalidadGrupoServicioTecSal:
        ModalidadGrupoServicioTecSalud === "SinSeleccionar"
          ? null
          : ModalidadGrupoServicioTecSalud,
      GrupoServicios:
        GrupoServicios === "SinSeleccionar" ? null : GrupoServicios,
      CodigoServicio: IdServicio === "SinSeleccionar" ? null : IdServicio,
      FinalidadTecnologiaSalud:
        FinalidadTecnologiaSaludAC === "SinSeleccionar"
          ? null
          : FinalidadTecnologiaSaludAC,
      CausaMotivoAtencion:
        CausaMotivoAtencion === "SinSeleccionar" ? null : CausaMotivoAtencion,
      TipoDiagnosticoPrincipal:
        TipoDiagnosticoPrincipal === "SinSeleccionar"
          ? null
          : TipoDiagnosticoPrincipal,
      // Diagnostico1: selectedOption.value === 'SinSeleccionar' ? null : selectedOption.value,
      Diagnostico1:
        selectedOption && selectedOption.value === "SinSeleccionar"
          ? null
          : selectedOption
          ? selectedOption.value
          : null,
      Diagnostico2:
        OpcionMarcadaConsultaRips2 &&
        OpcionMarcadaConsultaRips2.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaConsultaRips2
          ? OpcionMarcadaConsultaRips2.value
          : null,
      Procedimiento1:
        OpcionMarcadaDiagnostico1 &&
        OpcionMarcadaDiagnostico1.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaDiagnostico1
          ? OpcionMarcadaDiagnostico1.value
          : null,
      Procedimiento2:
        OpcionMarcadaDiagnostico2 &&
        OpcionMarcadaDiagnostico2.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaDiagnostico2
          ? OpcionMarcadaDiagnostico2.value
          : null,
      ViaIngresoServicioSalud: null, // SOLO APLICA PARA LOS RIPS AP (PROCEDIMIENTO)
    };

    // console.log(`
    //   ESTE ES EL VALOR DE LA CONSULTA RIPS AC 1 => ${OpcionMarcadaDiagnostico1.value} | ESTE ES EL VALOR DE LA CONSULTA RIPS AC 2 => ${OpcionMarcadaDiagnostico2.value}
    // `);
    try {
      const Respuesta = await axios.post(
        `${DireccionServidorAPIS_RIPS}/InsertarRipsPorDefecto`,
        DatosAEnviarAServidor
      );

      if (Respuesta.status === 200) {
        Swal.fire({
          icon: "success",
          html: `
                  <strong>El RIPS AC por defecto ha sido guardado correctamente</strong>
                `,
          showConfirmButton: false,
          timer: 3000,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        SetHabilitarBotonGuardar(true);
        SetHabilitarBotonActualizar(false);
        SetHabilitarBotonEliminar(false);
      } else {
        Swal.fire({
          icon: "error",
          html: `
                  <strong>Error al guardar el RIPS AC por defecto</strong>
                `,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        html: `
                  <strong>Error...</strong><br>
                  <ul>
                      <li><strong>Detalles: </strong><br>${error.message}</li>
                  </ul>
                `,
        showConfirmButton: false,
      });
    }
  };

  const ACTUALIZAR_RIPS_POR_DEFECTO = async () => {
    let ValoresAActualizar = {
      DocumentoProfesional: documentoEntidad,
      TipoRIPS: 1,
      TipoDeUsuario: TipoRips === "SinSeleccionar" ? null : TipoRips,
      Diagnostico1:
        selectedOption && selectedOption.value === "SinSeleccionar"
          ? null
          : selectedOption
          ? selectedOption.value
          : null,
      Diagnostico2:
        OpcionMarcadaConsultaRips2 &&
        OpcionMarcadaConsultaRips2.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaConsultaRips2
          ? OpcionMarcadaConsultaRips2.value
          : null,
      Procedimiento1:
        OpcionMarcadaDiagnostico1 &&
        OpcionMarcadaDiagnostico1.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaDiagnostico1
          ? OpcionMarcadaDiagnostico1.value
          : null,
      Procedimiento2:
        OpcionMarcadaDiagnostico2 &&
        OpcionMarcadaDiagnostico2.value === "SinSeleccionar"
          ? null
          : OpcionMarcadaDiagnostico2
          ? OpcionMarcadaDiagnostico2.value
          : null,
      ViaIngresoServicioSalud: null, // SOLO APLICA PARA LOS RIPS AP (PROCEDIMIENTO)
      ModalidadGrupoServicioTecSal:
        ModalidadGrupoServicioTecSalud === "SinSeleccionar"
          ? null
          : ModalidadGrupoServicioTecSalud,
      FinalidadTecnologiaSalud:
        FinalidadTecnologiaSaludAC === "SinSeleccionar"
          ? null
          : FinalidadTecnologiaSaludAC,
      CausaMotivoAtencion:
        CausaMotivoAtencion === "SinSeleccionar" ? null : CausaMotivoAtencion,
      TipoDiagnosticoPrincipal:
        TipoDiagnosticoPrincipal === "SinSeleccionar"
          ? null
          : TipoDiagnosticoPrincipal,
      Entidad: IdEntidades === "SinSeleccionar" ? null : IdEntidades,
      GrupoServicios:
        GrupoServicios === "SinSeleccionar" ? null : GrupoServicios,
        CodigoServicio: IdServicio === "SinSeleccionar" ? null : IdServicio,
    };

    console.log(`
      ESTE ES VALOR QUE CONTIENE EL SELECT DE CÓDIGO SERVIDIO => ${IdServicio}
  `);
    try {
      const Respuesta = await axios.post(
        `${DireccionServidorAPIS_RIPS}/ActualizarRipsPorDefecto`,
        ValoresAActualizar
      );
      if (Respuesta.status === 200) {
        Swal.fire({
          icon: "success",
          html: `
            <strong>El rips AC por defecto, ha sido actualizado correctamente.</strong>
          `,
          showConfirmButton: false,
          timer: 3000,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        html: `
          <strong>${error.response.data.error}</strong>
        `,
      });
    }
  };

  const ELIMINAR_RIPS_POR_DEFECTO = async () => {
    Swal.fire({
      icon: "question",
      html: `
          <strong class="text-light">¿Realmente quieres eliminar el RIPS AC por defecto?</strong>
      `,
      showCancelButton: true,
      confirmButtonText: "Si",
      confirmButtonColor: "#dc3741",
      cancelButtonText: "No",
      cancelButtonColor: "#6e7881",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async function (response) {
      if (response.isConfirmed) {
        try {
          const Respuesta = await axios.post(
            `${DireccionServidorAPIS_RIPS}/EliminarRipsPorDefecto`,
            {
              DocumentoProfesional: documentoEntidad,
              TipoRIPS: 1,
            }
          );

          if (Respuesta.status === 200) {
            Swal.fire({
              icon: "success",
              html: `
                      <strong>El RIPS AC por defecto ha sido eliminado correctamente</strong>
                    `,
              showConfirmButton: false,
              timer: 3000,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

            // FUNCIONALIDAD PARA LOS BOTONES DEL CRUD
            SetHabilitarBotonGuardar(false);
            SetHabilitarBotonActualizar(true);
            SetHabilitarBotonEliminar(true);
            // ________________________________________________
          } else {
            // Manejo de error más adecuado
            Swal.fire({
              icon: "error",
              html: `
                      <strong>Hubo un error al eliminar el RIPS AC por defecto</strong>
                    `,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          // Manejo de errores de Axios
          Swal.fire({
            icon: "error",
            html: `
                  <strong>Hubo un error al eliminar el RIPS AC por defecto: ${
                    error.response ? error.response.data.error : error.message
                  }</strong>
                `,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const LIMPIAR_CAMPOS = async () => {
    SetTipoRips("");
  };
  // _________________________________________________________________________________________________________________________
  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          className="font-normal text-sm"
          onClick={() => handleOpen({ backdrop: "blur" })}
          color="success"
          variant="shadow"
          size="sm"
          //   isDisabled={EstadoBoton}
        >
          ¡Configurar RIPS AC por defecto!
        </Button>
      </div>
      <Modal
        isDismissable={false}
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        placement={"top"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* <input value={selectedOption.value}></input> */}
              <ModalHeader>
                Selecciona los RIPS AC que deseas tener por defecto.
              </ModalHeader>
              <ModalBody>
                <ContenedorModal>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">Tipo de Rips:</span>
                        <br />
                        <ReutilizarSelect
                          id="TipoDeRipsAC"
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/TipoDeRips`}
                          value={TipoRips}
                          onChange={(e) => SetTipoRips(e.target.value)}
                          ValorEnviadoCapturadoDesdeElServidor={ValorTipoRips} // Pasamos el valor recibido desde el servidor
                          setValue={SetTipoRips} // Permite que el select maneje el estado
                        />
                      </div>
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">Entidad:</span>
                        <br />
                        <ReutilizarSelect
                          id="EntidadRipsAC"
                          options={Entidades}
                          value={IdEntidades}
                          onChange={(e) => SetIdEntidades(e.target.value)}
                          ValorEnviadoCapturadoDesdeElServidor={ValorEntidad}
                          setValue={SetIdEntidades}
                        />
                      </div>
                      <div style={{ width: "34%" }}>
                        <span className="font-bold">
                          ModalidadGrupoServicioTecSal:
                        </span>
                        <br />
                        <ReutilizarSelect
                          id="ModalidadGrupoServicioTecnologiaSaludAC"
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/ModalidadGrupoServicioTecSalud`}
                          value={ModalidadGrupoServicioTecSalud}
                          onChange={(e) =>
                            SetModalidadGrupoServicioTecSalud(e.target.value)
                          }
                          ValorEnviadoCapturadoDesdeElServidor={ValorModalidad}
                          setValue={SetModalidadGrupoServicioTecSalud}
                        />
                      </div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">GrupoServicios:</span>
                        <br />
                        <ReutilizarSelect
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/GrupoServicios`}
                          value={GrupoServicios}
                          onChange={(e) => SetGrupoServicios(e.target.value)}
                          setValue={SetGrupoServicios}
                          ValorEnviadoCapturadoDesdeElServidor={
                            ValorGrupoServicio
                          }
                        />
                      </div>
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">CodServicio:</span>
                        <br />
                        <ReutilizarSelect
                          options={Servicio}
                          value={IdServicio}
                          onChange={(e) => SetIdServicio(e.target.value)}
                          setValue={SetIdServicio}
                        />
                      </div>
                      <div style={{ width: "34%" }}>
                        <span className="font-bold">
                          FinalidadTecnologíaSalud:
                        </span>
                        <br />
                        <ReutilizarSelect
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/FinalidadTecnologiaSaludAC`}
                          value={FinalidadTecnologiaSaludAC}
                          onChange={(e) =>
                            SetFinalidadTecnologiaSaludAC(e.target.value)
                          }
                          ValorEnviadoCapturadoDesdeElServidor={ValorFinalidad}
                          setValue={SetFinalidadTecnologiaSaludAC}
                        />
                      </div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">CausaMotivoAtención:</span>
                        <br />
                        <ReutilizarSelect
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/CausaMotivoAtencion`}
                          value={CausaMotivoAtencion}
                          onChange={(e) =>
                            SetCausaMotivoAtencion(e.target.value)
                          }
                          setValue={SetCausaMotivoAtencion}
                          ValorEnviadoCapturadoDesdeElServidor={
                            ValorCausaMotivoAtencion
                          }
                        />
                      </div>
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">
                          TipoDiagnósticoPrincipal:
                        </span>
                        <br />
                        <ReutilizarSelect
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/TipoDiagnosticoPrincipal`}
                          value={TipoDiagnosticoPrincipal}
                          onChange={(e) =>
                            SetTipoDiagnosticoPrincipal(e.target.value)
                          }
                          setValue={SetTipoDiagnosticoPrincipal}
                          ValorEnviadoCapturadoDesdeElServidor={
                            ValorTipoDiagnosticoPrincipal
                          }
                        />
                      </div>
                      <div style={{ width: "34%" }}></div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "50%" }}>
                        <span className="font-bold">Consulta RIPS</span>
                        <br />
                        <Select
                          id="SelectConsulta1"
                          options={opcionesConsultaRips}
                          styles={customStyles}
                          value={selectedOption}
                          onChange={handleChange}
                          isClearable
                          placeholder="Seleccione una consulta RIPS 1"
                          formatOptionLabel={({ label }) => (
                            <span>{truncateOptionLabel(label)}</span>
                          )}
                          menuPortalTarget={document.body}
                        />

                        <Select
                          id="SelectConsulta2"
                          options={opcionesConsultaRips2}
                          className="mt-2"
                          styles={customStyles}
                          value={OpcionMarcadaConsultaRips2}
                          onChange={handleChangeConsultaRips2}
                          isClearable
                          placeholder="Seleccione una consulta RIPS 2"
                          formatOptionLabel={({ label }) => (
                            <span>{truncateOptionLabel(label)}</span>
                          )}
                          menuPortalTarget={document.body}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <span className="font-bold">Diagnóstico RIPS</span>
                        <br />
                        <Select
                          // id="SelectConsulta1"
                          options={opcionesProcedimiento}
                          value={OpcionMarcadaDiagnostico1}
                          onChange={MarcarDiagnostico1}
                          styles={customStyles}
                          isClearable
                          placeholder="Seleccione un diagnóstico RIPS AC 1"
                          formatOptionLabel={({ label }) => (
                            <span>{truncateOptionLabel(label)}</span>
                          )}
                          menuPortalTarget={document.body}
                        />

                        <Select
                          // id="SelectConsulta1"
                          options={opcionesProcedimiento2}
                          value={OpcionMarcadaDiagnostico2}
                          onChange={MarcarDiagnostico2}
                          className="mt-2"
                          styles={customStyles}
                          isClearable
                          placeholder="Seleccione un diagnóstico RIPS AC 2"
                          formatOptionLabel={({ label }) => (
                            <span>{truncateOptionLabel(label)}</span>
                          )}
                          menuPortalTarget={document.body}
                        />
                      </div>
                    </div>
                  </div>
                </ContenedorModal>
              </ModalBody>
              <ModalFooter className="mb-0">
                <Button
                  className="font-bold"
                  color="default"
                  variant="shadow"
                  onClick={() => {
                    onClose();
                    LIMPIAR_CAMPOS();
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  id="BotonGuardarRipsACPorDefecto"
                  className="font-bold"
                  color="primary"
                  variant="shadow"
                  onClick={GUARDAR_RIPS_POR_DEFECTO}
                  isDisabled={HabilitarBotonGuardar}
                >
                  Guardar
                </Button>
                <Button
                  className="font-bold"
                  color="primary"
                  variant="shadow"
                  onClick={ACTUALIZAR_RIPS_POR_DEFECTO}
                  isDisabled={HabilitarBotonActualizar}
                >
                  Actualizar
                </Button>
                <Button
                  className="font-bold"
                  color="primary"
                  variant="shadow"
                  onClick={ELIMINAR_RIPS_POR_DEFECTO}
                  isDisabled={HabilitarBotonEliminar}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const ContenedorModal = styled.div`
  .inputCampos {
    width: 96%;
    padding: 6px;
    border: 1.7px solid #ccc;
    border-radius: 7px;
  }

  .ContenedorConDisplayFLEX {
    display: flex;
    width: 100%;
  }
`;
