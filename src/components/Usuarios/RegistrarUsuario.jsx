import React, {memo} from "react";

import { servidor } from "../../config/config";
import { port } from "../../config/config";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
  DateInput,
  DatePicker,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import SelectsRegistroDeUsuario from "./Selects/SelectsRegistroDeUsuario";
import { MostrarModalCiudadOrigen } from "./MostrarModalCiudadOrigen";
import axios from "axios";
import { fetchUsers } from "./data";

// export function ModalRegistrarUsuario({ isOpen, onOpen, onClose }) {
 
// }

const ModalRegistrarUsuario = memo(function ModalRegistrarUsuario({isOpen, onOpen, onClose}) {
  const [backdrop, setBackdrop] = React.useState("blur");
  const [size, setSize] = React.useState("md");

  const [CiudadSeleccionada, setCiudadSeleccionada] = React.useState(null);
  const [primerNombre, setPrimerNombre] = React.useState("");
  const [segundoNombre, setSegundoNombre] = React.useState("");
  const [primerApellido, setPrimerApellido] = React.useState("");
  const [segundoApellido, setSegundoApellido] = React.useState("");
  const [tipoDocumento, setTipoDocumento] = React.useState("");
  const [documento, setDocumento] = React.useState("");
  const [IdCiudad, setIdCiudad] = React.useState("");
  const [Direccion, setDireccion] = React.useState("");
  const [Telefono, setTelefono] = React.useState("");
  const [Correo, setCorreo] = React.useState("");
  const [IdZonaResidencial, setIdZonaResidencial] = React.useState("");
  const [TipoDeUsuario, setTipoDeUsuario] = React.useState("");
  const [EstadoCivil, setEstadoCivil] = React.useState("");
  const [FechaDeNacimiento, setFechaDeNacimiento] = React.useState();
  const [edad, setEdad] = React.useState(null);
  const [edadCalculada, setEdadCalculada] = React.useState(null); // Estado para la edad calculada
  const [manualOverride, setManualOverride] = React.useState(false); // Estado para verificar si la edad se ingresó manualmente

  const [UnidadDeMedidaEdad, setUnidadDeMedidaEdad] = React.useState("");
  const [Sexo, setSexo] = React.useState("");
  const [PaisDeOrigen, setPaisDeOrigen] = React.useState("");
  const [PaisDeResidencia, setPaisDeResidencia] = React.useState("");
  const [Departamento, setDepartamento] = React.useState("");

  const [Departamentos, setDepartamentos] = React.useState([]);
  const [Ciudades, setCiudades] = React.useState([]);

  const [Ocupacion, setOcupacion] = React.useState("");
  const [Aseguradora, setAseguradora] = React.useState("");
  const [TipoDeVinculacion, setTipoDeVinculacion] = React.useState("");
  const [NombreDelResponsable, setNombreDelResponsable] = React.useState("");
  const [ParentescoDelResponsable, setParentescoDelResponsable] =
    React.useState("");
  const [TelefonoDelResponsable, setTelefonoDelResponsable] =
    React.useState("");

  const [Error, setError] = React.useState("");

  const ValidarCorreo = (Correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(Correo);
  };

  const IngresoCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value);

    // if (!ValidarCorreo(value)) {
    //   setError('Ingrese un correo electrónico válido.');
    // } else {
    //   setError('');
    // }

    // Verificar si el campo está vacío
    if (value === "") {
      setError(""); // Limpiar el error si el campo está vacío
    } else if (!ValidarCorreo(value)) {
      setError("Ingrese un correo electrónico válido");
    } else {
      setError("");
    }
  };

  // const [IdCiudadNacimiento, setIdCiudadNacimiento] = React.useState("");

  /* EXTRAER EL ID DE LA CIUDAD SELECCIONADA */
  const extractIdFromInput = (inputValue) => {
    const regex = /\[(.*?)\]/;
    const match = inputValue.match(regex);
    return match && match[1];
  };

  const inputValue = CiudadSeleccionada
    ? `${CiudadSeleccionada.Ciudad} [${CiudadSeleccionada.id}]`
    : "";
  const IdCiudadNacimiento = extractIdFromInput(inputValue);
  console.log(
    `Id de la ciudad de nacimiento seleccionada => ${IdCiudadNacimiento}`
  ); // debería imprimir el id de la ciudad seleccionada
  /* FIN FIN FIN */

  React.useEffect(() => {
    if (PaisDeResidencia === "SinSeleccionar" || !PaisDeResidencia) {
      // Si el país es "SinSeleccionar" o no está seleccionado, reinicia los valores
      setDepartamentos([]); // Vaciar los departamentos
      setDepartamento("SinSeleccionar"); // Resetear el departamento seleccionado
      setCiudades([]); // Limpiar las ciudades
      setIdCiudad("SinSeleccionar"); // Limpiar la ciudad seleccionada
    } else {
      console.log(`Cargando departamentos para el país: ${PaisDeResidencia}`);
      fetch(
        `http://${servidor}:${port}/api/registrarusuario/departamento?pais=${PaisDeResidencia}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Departamentos recibidos:", data);
          setDepartamentos(data);
          setDepartamento("SinSeleccionar"); // Resetear el departamento seleccionado
          setCiudades([]); // Limpiar las ciudades
          setIdCiudad("SinSeleccionar"); // Limpiar la ciudad seleccionada
        })
        .catch((error) => {
          console.error("Error al cargar los departamentos:", error);
        });
    }
  }, [PaisDeResidencia]);
  // Cargar ciudades al cambiar el departamento
  React.useEffect(() => {
    if (Departamento !== "SinSeleccionar") {
      console.log(`Cargando ciudades para el departamento: ${Departamento}`);
      fetch(
        `http://${servidor}:${port}/api/registrarusuario/ciudad?departamento=${Departamento}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCiudades(data);
          setIdCiudad("SinSeleccionar"); // Resetear la ciudad seleccionada
        });
    } else {
      setCiudades([]); // Limpiar las ciudades si el departamento es "SinSeleccionar"
      setIdCiudad("SinSeleccionar"); // Limpiar la ciudad seleccionada
    }
  }, [Departamento]);

  React.useEffect(() => {
    console.log("Departamento actual:", Departamento);
  }, [Departamento]);

  React.useEffect(() => {
    console.log("Ciudad actual:", IdCiudad);
  }, [IdCiudad]);

  // React.useEffect(() => {
  //   if (FechaDeNacimiento) {
  //     console.log(`La Fecha de Nacimiento ha cambiado => ${FechaDeNacimiento}`);

  //     // Calcular la edad
  //     const calcularEdad = (fechaNacimiento) => {
  //       const fechaActual = new Date();
  //       const añoActual = fechaActual.getFullYear();
  //       const mesActual = fechaActual.getMonth() + 1; // Meses comienzan en 0
  //       const diaActual = fechaActual.getDate();

  //       const añoNacimiento = fechaNacimiento.year;
  //       const mesNacimiento = fechaNacimiento.month;
  //       const diaNacimiento = fechaNacimiento.day;

  //       let edad = añoActual - añoNacimiento;

  //       // Verificar si el cumpleaños ya ocurrió este año
  //       if (
  //         mesActual < mesNacimiento ||
  //         (mesActual === mesNacimiento && diaActual < diaNacimiento)
  //       ) {
  //         edad--;
  //       }

  //       return edad;
  //     };

  //     const edadCalculada = calcularEdad(FechaDeNacimiento);
  //     setEdad(edadCalculada);
  //   }
  // }, [FechaDeNacimiento]);

  /* VAMOS */
  React.useEffect(() => {
    if (FechaDeNacimiento && !manualOverride) {
      console.log(`La Fecha de Nacimiento ha cambiado => ${FechaDeNacimiento}`);

      // Calcular la edad
      const calcularEdad = (fechaNacimiento) => {
        const fechaActual = new Date();
        const añoActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1; // Meses comienzan en 0
        const diaActual = fechaActual.getDate();

        const añoNacimiento = fechaNacimiento.year;
        const mesNacimiento = fechaNacimiento.month;
        const diaNacimiento = fechaNacimiento.day;

        let edad = añoActual - añoNacimiento;

        // Verificar si el cumpleaños ya ocurrió este año
        if (
          mesActual < mesNacimiento ||
          (mesActual === mesNacimiento && diaActual < diaNacimiento)
        ) {
          edad--;
        }

        return edad;
      };

      const edadCalculada = calcularEdad(FechaDeNacimiento);
      setEdad(edadCalculada);
      setEdadCalculada(edadCalculada);
    }
  }, [FechaDeNacimiento, manualOverride]);

  const handleInputChange = (event) => {
    const inputEdad = event.target.value;
    setEdad(inputEdad);

    // Si el usuario ingresa manualmente una edad, deshabilita la actualización automática
    if (inputEdad !== edadCalculada?.toString()) {
      setManualOverride(false);
    } else {
      setManualOverride(false);
    }

    console.log(inputEdad);
  };
  /* FIN - VAMOS */

  // React.useEffect(() => {
  //   if (FechaDeNacimiento && !manualOverride) {
  //          console.log(`La Fecha de Nacimiento ha cambiado => ${FechaDeNacimiento}`);

  //     // Calcular la edad
  //     const calcularEdad = (fechaNacimiento) => {
  //       const fechaActual = new Date();
  //       const añoActual = fechaActual.getFullYear();
  //       const mesActual = fechaActual.getMonth() + 1; // Meses comienzan en 0
  //       const diaActual = fechaActual.getDate();

  //       const añoNacimiento = fechaNacimiento.year;
  //       const mesNacimiento = fechaNacimiento.month;
  //       const diaNacimiento = fechaNacimiento.day;

  //       let edad = añoActual - añoNacimiento;

  //       // Verificar si el cumpleaños ya ocurrió este año
  //       if (
  //         mesActual < mesNacimiento ||
  //         (mesActual === mesNacimiento && diaActual < diaNacimiento)
  //       ) {
  //         edad--;
  //       }

  //       return edad;
  //     };

  //     const edadCalculada = calcularEdad(FechaDeNacimiento);
  //     setEdad(edadCalculada);
  //     setEdadCalculada(edadCalculada);
  //   }
  // }, [FechaDeNacimiento, manualOverride]);

  // const handleInputChange = (event) => {
  //   const inputEdad = event.target.value;
  //   setEdad(inputEdad);

  //   // Si el usuario ingresa manualmente una edad, deshabilita la actualización automática
  //   if (inputEdad !== edadCalculada?.toString()) {
  //     setManualOverride(true);
  //   } else {
  //     setManualOverride(false);
  //   }
  // };

  const FechaValida = (newValue) => {
    if (newValue) {
      console.log("Valor recibido en FechaValida:", newValue);
      setFechaDeNacimiento(newValue);
    } else {
      setFechaDeNacimiento(null);
    }
  };
  /* FIN FIN FIN */

  React.useEffect(() => {
    if (TipoDeVinculacion) {
      setTipoDeVinculacion(TipoDeVinculacion);
      console.log("Tipo de vinculación seleccionado => " + TipoDeVinculacion);
    }
  });

  React.useEffect(() => {
    if (IdCiudad) {
      setIdCiudad(IdCiudad);
      console.log("Ciudad seleccionada => " + IdCiudad);
    }
  });

  // React.useEffect(() => {
  //   if (PaisDeOrigen) {
  //     setPaisDeOrigen(PaisDeOrigen);
  //     console.log("País de origen seleccionado => " + PaisDeOrigen)
  //   }
  // })

  // React.useEffect(() => {
  //   if (PaisDeResidencia) {
  //     setPaisDeResidencia(PaisDeResidencia);
  //     console.log("Pais de residencia selecionado => " + PaisDeResidencia)
  //   }
  // })

  // React.useEffect(() => {
  //   if (PaisDeOrigen) {
  //     setPaisDeOrigen(PaisDeOrigen);
  //     console.log("País de origen seleccionado => " + PaisDeOrigen);
  //   }
  // }, [PaisDeOrigen]); // Agrega PaisDeOrigen como dependencia

  React.useEffect(() => {
    if (PaisDeResidencia) {
      setPaisDeResidencia(PaisDeResidencia);
      console.log("País de residencia seleccionado => " + PaisDeResidencia);
    }
  }, [PaisDeResidencia]); // Agrega PaisDeResidencia como dependencia

  const RegistrarUsuario = async () => {
    const CamposObligatorios = [
      "Primer Nombre",
      "Primer Apellido",
      "Tipo de Identificación",
      "Documento",
      "Fecha de Nacimiento",
      "Sexo",
      "Lugar de Nacimiento",
      "País de Residencia",
      "Departamento de Residencia",
      "Ciudad de Residencia",
      "Zona Territorial",
      "Celular",
      "Correo",
      "Aseguradora",
      "Tipo de Usuario",
    ];

    const ValorDeCamposObligatorios = {
      primerNombre: primerNombre,
      primerApellido: primerApellido,
      tipoDocumento: tipoDocumento,
      documento: documento,
      fechaDeNacimiento: FechaDeNacimiento,
      sexo: Sexo,
      lugarDeNacimiento: PaisDeOrigen,
      paisDeResidencia: PaisDeResidencia,
      departamentoDeResidencia: Departamento,
      ciudadDeResidencia: Ciudades,
      zonaTerritorial: IdZonaResidencial,
      celular: Telefono,
      correo: Correo,
      aseguradora: Aseguradora,
      tipoUsuario: TipoDeUsuario,
    };

    // Array para almacenar los nombres de los campos vacíos
    const camposObligatoriosFaltantes = [];

    // Verificamos cada campo y, si está vacío, lo agregamos al array
    if (primerNombre === "") camposObligatoriosFaltantes.push("Primer Nombre");
    if (primerApellido === "")
      camposObligatoriosFaltantes.push("Primer Apellido");
    if (tipoDocumento === "")
      camposObligatoriosFaltantes.push("Tipo de Identificación");
    if (documento === "") camposObligatoriosFaltantes.push("Documento");
    if (!FechaDeNacimiento)
      camposObligatoriosFaltantes.push("Fecha de Nacimiento");
    // if (FechaDeNacimiento === "") camposObligatoriosFaltantes.push("Fecha de Nacimiento");
    if (Sexo === "") camposObligatoriosFaltantes.push("Sexo");
    if (!CiudadSeleccionada || !CiudadSeleccionada.Ciudad) {
      // Así por ser un objeto
      camposObligatoriosFaltantes.push("Lugar de Nacimiento");
    }
    if (!PaisDeResidencia)
      camposObligatoriosFaltantes.push("País de Residencia");
    if (Departamento === "SinSeleccionar")
      camposObligatoriosFaltantes.push("Departamento de Residencia");
    if (IdCiudad === "SinSeleccionar")
      camposObligatoriosFaltantes.push("Ciudad de Residencia");
    if (IdZonaResidencial === "")
      camposObligatoriosFaltantes.push("Zona Territorial");
    if (Telefono === "") camposObligatoriosFaltantes.push("Celular");
    if (Correo === "") camposObligatoriosFaltantes.push("Correo");
    if (Aseguradora === "") camposObligatoriosFaltantes.push("Aseguradora");
    if (TipoDeUsuario === "")
      camposObligatoriosFaltantes.push("Tipo de Usuario");

    if (camposObligatoriosFaltantes.length > 0) {
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: "info",
        text: "",
        html: `
          <h2><b> Los siguientes campos son obligatorios: </b></h2>
          <br>
          <ul style="text-align: left;">
          ${camposObligatoriosFaltantes
            .map((campo) => `<li> - ${campo}</li>`)
            .join("")}
          </ul>
        `,
        confirmButtonColor: "#2c3e50",
      });
      return;

      // if (
      //     primerNombre === "" ||
      //     primerApellido === "" ||
      //     tipoDocumento === "SinSeleccionar" ||
      //     documento === "" ||
      //     FechaDeNacimiento === "" ||
      //     Sexo === ""
      //   ) {
      //     console.log(ValorDeCamposObligatorios);
      //   Swal.fire({
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //     icon: "info",
      //     text: "",
      //     html:
      //     `
      //       <h2><b> Los siguientes campos son obligatorios: </b></h2>
      //       <br>
      //       <ul style="text-align: left;">
      //       ${CamposObligatorios.map(campo => `<li> - ${campo}</li>`).join("")}
      //       </ul>
      //     `,
      //     confirmButtonColor: '#2c3e50',
      //   });
      //   return;
    }

    if (documento === "") {
      Swal.fire({
        icon: "error",
        text: "Debes ingresar un número de documento válido",
        timer: 2000,
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://${servidor}:${port}/api/registrarusuario/insertardatos`,
        {
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
          documento,
          tipoDocumento,
          IdCiudad,
          Direccion,
          Telefono,
          Correo,
          IdZonaResidencial,
          TipoDeUsuario,
          EstadoCivil,
          FechaDeNacimiento,
          edad,
          UnidadDeMedidaEdad,
          Sexo,
          PaisDeOrigen,
          PaisDeResidencia,
          Departamento,
          Ocupacion,
          Aseguradora,
          TipoDeVinculacion,
          NombreDelResponsable,
          ParentescoDelResponsable,
          TelefonoDelResponsable,
          IdCiudadNacimiento,
        }
      );

      console.log(response.data); // Muestra el mensaje del servidor
      Swal.fire({
        icon: "success",
        text: "Usuario registrado exitosamente",
        confirmButtonColor: "#2c3e50",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        // Limpiar los campos del formulario
        setPrimerNombre("");
        setSegundoNombre("");
        setPrimerApellido("");
        setSegundoApellido("");
        setDocumento("");
        setTipoDocumento("");
        setIdCiudad("");
        setDireccion("");
        setTelefono("");
        setCorreo("");
        setIdZonaResidencial("");
        setTipoDeUsuario("");
        setEstadoCivil("");
        setFechaDeNacimiento(null);
        setEdad("");
        setUnidadDeMedidaEdad("");
        setSexo("");
        setPaisDeOrigen("");
        setPaisDeResidencia("");
        setDepartamento("");
        setOcupacion("");
        setAseguradora("");
        setTipoDeVinculacion("");
        setNombreDelResponsable("");
        setParentescoDelResponsable("");
        setTelefonoDelResponsable("");
        setCiudadSeleccionada("");

        // Se llama la función que trae la información de los pacientes de la bd
        fetchUsers();
      });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);

      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message // Mostrar el mensaje de error exacto del backend
          : error.message; // Fallback a un mensaje de error general si no hay respuesta del backend

      Swal.fire({
        icon: "error",
        text: errorMessage,
        confirmButtonColor: "#2c3e50",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };

  return (
    <Modal
      size={"5xl"}
      backdrop={backdrop}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-3">
              <b>Registro de usuario</b>
            </ModalHeader>
            <ModalBody>
              {/* <div style={{display: 'flex', padding: '4px', gap: '10px'}}>

                </div> */}

              <div style={{ width: "100%" }}>
                <table
                  style={{
                    width: "100%",
                    borderSpacing: "10px",
                    borderCollapse: "separate",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "25%" }}>
                        <Input
                          isRequired
                          key={"outside"}
                          type="text"
                          label="Primer Nombre"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={primerNombre}
                          onChange={(e) => setPrimerNombre(e.target.value)}
                        />
                      </th>
                      <th>
                        <Input
                          key={"outside"}
                          type="text"
                          label="Segundo Nombre"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={segundoNombre}
                          onChange={(e) => setSegundoNombre(e.target.value)}
                        />
                      </th>
                      <th style={{ width: "25%" }}>
                        <Input
                          isRequired
                          key={"outside"}
                          type="text"
                          label="Primer Apellido"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={primerApellido}
                          onChange={(e) => setPrimerApellido(e.target.value)}
                        />
                      </th>
                      <th>
                        <Input
                          key={"outside"}
                          type="text"
                          label="Segundo Apellido"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={segundoApellido}
                          onChange={(e) => setSegundoApellido(e.target.value)}
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        {/* <Select
                        key={"outside"}
                        label={"Tipo de Identificación"}
                        labelPlacement={"outside"}
                        placeholder="Seleccionar"
                        className="max-w-xs"
                        classNames={{
                          label: ["text-sm"],
                        }}
                        defaultSelectedKeys={"Seleccionar"}
                        variant="bordered"
                      >
                        
                      </Select> */}
                        <SelectsRegistroDeUsuario
                          isRequired
                          key={"outside"}
                          label={"Tipo de Identificación"}
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipodedocumento`}
                          value={tipoDocumento}
                          onChange={(e) => setTipoDocumento(e.target.value)}
                        />
                      </th>
                      <th>
                        <Input
                          isRequired
                          key={"outside"}
                          type="text"
                          label="Documento"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={documento}
                          onChange={(e) => setDocumento(e.target.value)}
                        />
                      </th>
                      <th>
                        <DatePicker
                          isRequired
                          key={"outside"}
                          label={"Fecha de Nacimiento"}
                          labelPlacement={"outside"}
                          variant="bordered"
                          placeholder=" "
                          showMonthAndYearPickers
                          value={FechaDeNacimiento}
                          // onChange={setFechaDeNacimiento}
                          onChange={FechaValida}
                          style={{ color: "blue" }}
                        />
                      </th>
                      <th>
                        <Input
                          // isReadOnly
                          // isDisabled
                          key={"outside"}
                          type="number"
                          label={"Edad"}
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={edad}
                          onChange={handleInputChange}
                          // onChange={handleInputChange} // Permitir la edición manual
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <SelectsRegistroDeUsuario
                          key={"outside"}
                          label={"Unidad de Medida Edad"}
                          labelPlacement={"outside"}
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/unidadmedidaedad`}
                          value={UnidadDeMedidaEdad}
                          onChange={(e) =>
                            setUnidadDeMedidaEdad(e.target.value)
                          }
                        />
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          isRequired
                          key={"outside"}
                          label={"Sexo"}
                          labelPlacement={"outside"}
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/sexo`}
                          value={Sexo}
                          onChange={(e) => setSexo(e.target.value)}
                        />
                      </th>
                      <th>
                        {/* <SelectsRegistroDeUsuario
                          label={"País de Origen"}
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/pais`}
                          value={PaisDeOrigen}
                          onChange={(e) => setPaisDeOrigen(e.target.value)}
                        /> */}
                        {/* <SelectsRegistroDeUsuario
                          label={"País de Origen"}
                          labelPlacement={"outside"}
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/paisdeorigen`}
                          value={PaisDeOrigen}
                          onChange={(e) => {
                            setPaisDeOrigen(e.target.value);
                            console.log(
                              "País de origen seleccionado => " + e.target.value
                            );
                          }}
                        /> */}
                        {/* <div style={{ display: "flex", border: "solid green 2px", alignItems: "flex-end" }}>
                          <div style={{ flexGrow: 1, padding: "4px", border: "solid gold 2px" }}>
                            <Input
                              // isDisabled
                              key={"outside"}
                              type="text"
                              label="Nacimiento"
                              labelPlacement={"outside"}
                              placeholder=" "
                              variant="bordered"
                              value={CiudadSeleccionada ? `${CiudadSeleccionada.Ciudad} [${CiudadSeleccionada.id}]` : ''}
                            />
                          </div>

                          <MostrarModalCiudadOrigen CiudadSeleccionada={(Ciudad) => setCiudadSeleccionada(Ciudad)}/>

                        </div> */}

                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ width: "100%", textAlign: "left" }}>
                            <label htmlFor="" style={{ fontSize: "15px" }}>
                              Lugar de nacimiento{" "}
                              <b
                                style={{
                                  color: "rgb(243, 18, 96)",
                                  size: "1px",
                                }}
                              >
                                *
                              </b>
                            </label>
                          </div>
                          <div style={{ width: "60%" }}>
                            <Input
                              isDisabled
                              key={"outside"}
                              type="text"
                              // label="Nacimiento"
                              labelPlacement={"outside"}
                              placeholder=" "
                              variant="bordered"
                              // value={CiudadSeleccionada ? CiudadSeleccionada.Ciudad : ''}
                              value={
                                CiudadSeleccionada
                                  ? `${CiudadSeleccionada.Ciudad} [${CiudadSeleccionada.id}]`
                                  : ""
                              }
                              // onChange={(e) => {
                              //   const inputValue = e.target.value;
                              //   const id = extractIdFromInput(inputValue);
                              //   console.log(`Id de la ciudad de nacimiento seleccionada => ${id}`); // debería imprimir el id de la ciudad seleccionada
                              // }}
                            />
                          </div>
                          <div style={{ width: "40%" }}>
                            <MostrarModalCiudadOrigen
                              CiudadSeleccionada={(Ciudad) =>
                                setCiudadSeleccionada(Ciudad)
                              }
                            />
                          </div>
                        </div>
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          isRequired
                          label="País de Residencia"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/paisderesidencia`}
                          value={PaisDeResidencia}
                          onChange={(e) => setPaisDeResidencia(e.target.value)}
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        {/* <SelectsRegistroDeUsuario
                          label="Departamento de Residencia"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/departamento`}
                          value={Departamento}
                          onChange={(e) => setDepartamento(e.target.value)}
                        /> */}
                        <SelectsRegistroDeUsuario
                          isRequired
                          label="Departamento de Residencia"
                          labelPlacement={"outside"}
                          options={Departamentos} // Usar las opciones cargadas dinámicamente
                          value={Departamento} // Este valor controlará qué opción está seleccionada
                          onChange={(e) => setDepartamento(e.target.value)}
                        />
                      </th>
                      <th>
                        {/* <SelectsRegistroDeUsuario
                          // key={"outside"}
                          label="Ciudad de Residencia"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/ciudad`}
                          value={IdCiudad}
                          onChange={(e) => setIdCiudad(e.target.value)}
                        /> */}
                        <SelectsRegistroDeUsuario
                          isRequired
                          label="Ciudad de Residencia"
                          labelPlacement={"outside"}
                          options={Ciudades} // Usar las opciones cargadas dinámicamente
                          value={IdCiudad}
                          onChange={(e) => setIdCiudad(e.target.value)}
                        />
                      </th>
                      <th>
                        <Input
                          key={"outside"}
                          type="text"
                          label="Dirección de Residencia"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={Direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        />
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          isRequired
                          key={"outside"}
                          label="Zona Territorial"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/zonaterritorial`}
                          value={IdZonaResidencial}
                          onChange={(e) => setIdZonaResidencial(e.target.value)}
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <Input
                          isRequired
                          key={"outside"}
                          type="text"
                          label="Celular"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={Telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          maxLength={10} // Cambia 10 por el número máximo de caracteres que desees
                        />
                      </th>
                      <th>
                        {" "}
                        <Input
                          isRequired
                          key={"outside"}
                          type="email"
                          label="Correo"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={Correo}
                          // onChange={(e) => setCorreo(e.target.value)}
                          onChange={IngresoCorreo}
                        />
                        {Error && (
                          <span
                            className="text-red-500"
                            style={{ fontSize: "13px" }}
                          >
                            {Error}
                          </span>
                        )}{" "}
                        {/* Mensaje de error */}
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          key={"outside"}
                          label="Estado Civíl"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/estadocivil`}
                          value={EstadoCivil}
                          onChange={(e) => setEstadoCivil(e.target.value)}
                        />
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          key={"outside"}
                          label="Ocupación"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/ocupacion`}
                          value={Ocupacion}
                          onChange={(e) => setOcupacion(e.target.value)}
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <SelectsRegistroDeUsuario
                          isRequired
                          key={"outside"}
                          label="Aseguradora"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/aseguradora`}
                          value={Aseguradora}
                          onChange={(e) => setAseguradora(e.target.value)}
                        />
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          key={"outside"}
                          label="Tipo de Vinculación"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipoafiliado`}
                          value={TipoDeVinculacion}
                          onChange={(e) => setTipoDeVinculacion(e.target.value)}
                        />
                      </th>
                      <th>
                        <SelectsRegistroDeUsuario
                          isRequired
                          key={"outside"}
                          label="Tipo de Usuario"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipousuario`}
                          value={TipoDeUsuario}
                          onChange={(e) => setTipoDeUsuario(e.target.value)}
                        />
                      </th>
                      <th>
                        <Input
                          key={"outside"}
                          type="text"
                          label="Nombre del Responsable"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={NombreDelResponsable}
                          onChange={(e) =>
                            setNombreDelResponsable(e.target.value)
                          }
                        />
                      </th>
                    </tr>

                    <tr>
                      <th>
                        <SelectsRegistroDeUsuario
                          key={"outside"}
                          label="Parentesco del Responsable"
                          labelPlacement={"outside"}
                          // placeholder="Seleccionar"
                          apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/parentesco`}
                          value={ParentescoDelResponsable}
                          onChange={(e) =>
                            setParentescoDelResponsable(e.target.value)
                          }
                        />
                      </th>
                      <th>
                        <Input
                          maxLength={10}
                          key={"outside"}
                          type="text"
                          // label="Teléfono del responsable"
                          label="Celular del responsable"
                          labelPlacement={"outside"}
                          placeholder=" "
                          // description={""}
                          size={"sm"}
                          classNames={{
                            label: ["text-sm"],
                            input: ["text-sm"],
                          }}
                          variant="bordered"
                          value={TelefonoDelResponsable}
                          onChange={(e) =>
                            setTelefonoDelResponsable(e.target.value)
                          }
                        />
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  style={{ fontWeight: "bold" }}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={RegistrarUsuario}
                  style={{ fontWeight: "bold" }}
                >
                  Registrar
                </Button>
              </div>
            </ModalBody>
            {/* <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={onClose}>
                Registrar
              </Button>
            </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

// export default memo(ModalRegistrarUsuario());
export { ModalRegistrarUsuario };