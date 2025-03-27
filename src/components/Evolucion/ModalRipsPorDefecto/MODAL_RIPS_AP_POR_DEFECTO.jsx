import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"; // PARA TRABAJAR CON COMPONENTES DE NEXTUI
import React, { useState, useEffect } from "react"; // PARA INTERACCIONES REACT
import styled from "styled-components"; // PARA DAR ESTILOS A LOS COMPONENTES
import axios from "axios";
import { servidor, port } from "../../../config/config";
import ReutilizarSelect from "./ReutilizarSelect";


export function MODAL_RIPS_AP_POR_DEFECTO() {
  const DireccionServidorAPIS_RIPS = `http://${servidor}:${port}/api/Rips`;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");
  const [size, setSize] = useState("4xl");

  // SE CREAN VARIABLES/ESTADO PARA CADA UNA DE LAS LISTAS
  const [selectedOption, setSelectedOption] = useState("");
  const [TipoRips, SetTipoRips] = useState(""); 
  const [ViaIngresoServicioSalud, SetViaIngresoServicioSalud] = useState("");
  const [ModalidadGrupoServicioTecSalud, SetModalidadGrupoServicioTecSalud] = useState("");
  const [GrupoServicios, SetGrupoServicios] = useState("");
  const [FinalidadTecnologiaSaludAP, SetFinalidadTecnologiaSaludAP] = useState("");
  const [Entidades, SetEntidades] = useState([]);
  const [IdEntidades, SetIdEntidades] = useState("");
  const [ModalidadGrupoServicioTecSal, SetModalidadGrupoServicioTecSal] = useState([]);
  const [Servicio, SetServicio] = useState([]);
  const [IdServicio, SetIdServicio] = useState("");

  useEffect(() => {
    const fetchTipoDeRips = async () => {
      try {
        const Respuesta = await axios.get(`http://${servidor}:${port}/api/Rips/TipoDeRips`);
        SetTipoRips(Respuesta.data);
      } catch (error) {
        console.error("Error al traer los tipos de RIPS: ", error);
      }
    };
    fetchTipoDeRips(); // LLAMAR A LA FUNCIÓN CUANDO EL COMPONENTE SE MONTA

    const fetchModalidadGrupoServicioTecSal = async () => {
      try {
        const Respuesta = await axios.get(`http://${servidor}:${port}/api/Rips/ModalidadGrupoServicioTecSal`);
        SetModalidadGrupoServicioTecSal(Respuesta.data);
        // console.log(Respuesta.data);
      } catch (error) {
        console.error("Error al traer las modalidades, grupo de servicios y tecnologías de salud: ", error);
      }
    };
    fetchModalidadGrupoServicioTecSal(); // LLAMAR A LA FUNCIÓN CUANDO EL COMPONENTE SE MONTA
  }, []);

  useEffect(() => {
    if (TipoRips !== "SinSeleccionar" || !TipoRips) {
        axios.get(`${DireccionServidorAPIS_RIPS}/Entidades`, {
          params: {
            Tipo: TipoRips // Envía el parámetro en el cuerpo
          }
      })
      .then((response) => {
        // console.log('Datos recibidos:', response.data); // Verifica aquí
          SetEntidades(response.data);
          SetIdEntidades("SinSeleccionar");
      })
      .catch((error) => {
          // Manejo de errores
          console.error('Error al obtener entidades:', error);
      });
    } else {
        SetEntidades([]);
        SetIdEntidades("Sin seleccionar");
    }
}, [TipoRips]);

  useEffect(() => {
    if (GrupoServicios !== "SinSeleccionar" || !GrupoServicios) {
      axios.get(`${DireccionServidorAPIS_RIPS}/CodServicio`, {
        params: {
            GrupoServicio: GrupoServicios // Envía el parámetro en el cuerpo
        }
      })
      .then((response) => {
        // console.log('Datos recibidos:', response.data); // Verifica aquí
          SetServicio(response.data);
          SetIdServicio("Sin seleccionar");
      })
      .catch((error) => {
          // Manejo de errores
          console.error('Error al obtener códigos de servicios:', error);
      });
    } else {
      SetServicio([]);
      SetIdServicio("Sin seleccionar");
    }
  }, [GrupoServicios]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    // console.log("El valor seleccionado es: " + selectedOption);
  };

  const handleOpen = async ({ backdrop = "", size = "" }) => {
    if (backdrop) setBackdrop(backdrop);
    if (size) setSize(size);
    onOpen(); // Abrir el modal después de la verificación
    // checkIfExists();
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          className="font-normal text-sm"
          onClick={() => handleOpen({ backdrop: "blur" })}
          color="success"
          variant="shadow"
          size="sm"
        >
          ¡Configurar RIPS AP por defecto!
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
              <ModalHeader>
                Selecciona los RIPS AP que deseas tener por defecto.
              </ModalHeader>
              <ModalBody>
                <ContenedorModal>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">Tipo de Rips:</span>
                        <br />
                        <ReutilizarSelect 
                          apiEndpoint={`http://${servidor}:${port}/api/Rips/TipoDeRips`}
                          value={TipoRips}
                          onChange={(e) => SetTipoRips(e.target.value)}
                      />
                        {/* <select
                          className="inputCampos"
                          name="tipoRips"
                          value={TipoRips}
                          // onChange={(e) => SetTipoRips(e.target.value)}
                          onChange={handleSelectChange}
                        >
                          <option value="Sin Seleccionar">
                            Sin Seleccionar
                          </option>
                          {TipoRips.map((item) => (
                            <option key={item.IdTipoRips} value={item.IdTipoRips}>
                              {item.TipoRips}
                            </option>
                          ))}
                        </select> */}
                      </div>
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">Entidad:</span>
                        <br />
                        <ReutilizarSelect 
                          options={Entidades}
                          value={IdEntidades}
                          onChange={(e) => SetIdEntidades(e.target.value)}
                        />
                      </div>
                      <div style={{ width: "34%" }}>
                        <span className="font-bold">
                        ViaIngresoServicioSalud:
                        </span>
                        <br />
                        <ReutilizarSelect 
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/ViaIngresoServicioSalud`}
                          value={ViaIngresoServicioSalud}
                          onChange={(e) => SetViaIngresoServicioSalud(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">ModalidadGrupoServicioTecSal:</span>
                        <br />
                        <ReutilizarSelect 
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/ModalidadGrupoServicioTecSalud`}
                          value={ModalidadGrupoServicioTecSalud}
                          onChange={(e) => SetModalidadGrupoServicioTecSalud(e.target.value)}
                        />
                        {/* DE FORMA SIN REUTILIZAR */}
                        {/* <select
                          // id="listaTipoRips"
                          className="inputCampos"
                          onChange={handleSelectChange}
                          value={selectedOption}
                        >
                          <option value="Sin Seleccionar">
                            Sin Seleccionar
                          </option>
                          {ModalidadGrupoServicioTecSal.map((item) => (
                            <option value={item.Codigo}>
                              {item.NombreModalidadAtencion}
                            </option>
                          ))}
                        </select> */}
                        {/* __________________________________________ */}
                      </div>
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">GrupoServicios:</span>
                        <br />  
                        <ReutilizarSelect 
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/GrupoServicios`}
                          value={GrupoServicios}
                          onChange={(e) => SetGrupoServicios(e.target.value)}
                        />
                      </div>
                      <div style={{ width: "34%" }}>
                        <span className="font-bold">
                        CodServicio:
                        </span>
                        <br />
                        <ReutilizarSelect 
                          options={Servicio}
                          value={IdServicio}
                          onChange={(e) => SetIdServicio(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "33.3%" }}>
                        <span className="font-bold">FinalidadTecnologíaSalud:</span>
                        <br />
                        <ReutilizarSelect 
                          apiEndpoint={`${DireccionServidorAPIS_RIPS}/FinalidadTecnologiaSaludAP`}
                          value={FinalidadTecnologiaSaludAP}
                          onChange={(e) => SetFinalidadTecnologiaSaludAP(e.target.value)}
                        />
                      </div>
                      <div style={{ width: "33.3%" }}></div>
                      <div style={{ width: "34%" }}></div>
                    </div>

                    <div className="ContenedorConDisplayFLEX">
                      <div style={{ width: "50%" }}>
                        <span className="font-bold">Procedimiento RIPS</span>
                        <br />

                        <select
                          // id="listaTipoRips"
                          className="inputCampos"
                          name="tipoRips"
                          // onChange={handleSelectChange}
                          // value={selectedTipoRips}
                        >
                          <option value="Sin Seleccionar">
                          Seleccione un procedimiento AP 1
                          </option>
                          {/* {!resetState && datosEvolucion && Object.keys(datosEvolucion).length > 0 && (
                                                <option key={datosEvolucion['Id Tipo de Rips']} value={datosEvolucion['Id Tipo de Rips']}>
                                                    {datosEvolucion['Tipo Rips']}
                                                </option>
                                            )}
                                            {tiposRips.map(tiposRips => (
                                                <option key={tiposRips.idTipoRips} value={tiposRips.idTipoRips}>
                                                    {tiposRips.descripcionTipoRips}
                                                </option>
                                            ))} */}
                        </select>

                        <select
                          // id="listaTipoRips"
                          className="inputCampos mt-1"
                          name="tipoRips"
                          // onChange={handleSelectChange}
                          // value={selectedTipoRips}
                        >
                          <option value="Sin Seleccionar">
                          Seleccione un procedimiento AP 2
                          </option>
                          {/* {!resetState && datosEvolucion && Object.keys(datosEvolucion).length > 0 && (
                                                <option key={datosEvolucion['Id Tipo de Rips']} value={datosEvolucion['Id Tipo de Rips']}>
                                                    {datosEvolucion['Tipo Rips']}
                                                </option>
                                            )}
                                            {tiposRips.map(tiposRips => (
                                                <option key={tiposRips.idTipoRips} value={tiposRips.idTipoRips}>
                                                    {tiposRips.descripcionTipoRips}
                                                </option>
                                            ))} */}
                        </select>
                      </div>
                      <div style={{ width: "50%" }}>
                        <span className="font-bold">Diagnóstico RIPS</span>
                        <br />

                        <select
                          // id="listaTipoRips"
                          className="inputCampos"
                          name="tipoRips"
                          // onChange={handleSelectChange}
                          // value={selectedTipoRips}
                        >
                          <option value="Sin Seleccionar">
                            Seleccione un diagnóstico RIPS AP 1
                          </option>
                          {/* {!resetState && datosEvolucion && Object.keys(datosEvolucion).length > 0 && (
                                                <option key={datosEvolucion['Id Tipo de Rips']} value={datosEvolucion['Id Tipo de Rips']}>
                                                    {datosEvolucion['Tipo Rips']}
                                                </option>
                                            )}
                                            {tiposRips.map(tiposRips => (
                                                <option key={tiposRips.idTipoRips} value={tiposRips.idTipoRips}>
                                                    {tiposRips.descripcionTipoRips}
                                                </option>
                                            ))} */}
                        </select>

                        <select
                          // id="listaTipoRips"
                          className="inputCampos mt-1"
                          name="tipoRips"
                          // onChange={handleSelectChange}
                          // value={selectedTipoRips}
                        >
                          <option value="Sin Seleccionar">
                            Seleccione un diagnóstico RIPS AP 2
                          </option>
                          {/* {!resetState && datosEvolucion && Object.keys(datosEvolucion).length > 0 && (
                                                <option key={datosEvolucion['Id Tipo de Rips']} value={datosEvolucion['Id Tipo de Rips']}>
                                                    {datosEvolucion['Tipo Rips']}
                                                </option>
                                            )}
                                            {tiposRips.map(tiposRips => (
                                                <option key={tiposRips.idTipoRips} value={tiposRips.idTipoRips}>
                                                    {tiposRips.descripcionTipoRips}
                                                </option>
                                            ))} */}
                        </select>
                      </div>
                    </div>
                  </div>
                </ContenedorModal>
              </ModalBody>
              <ModalFooter className="mb-0">
                <Button color="default" variant="shadow" onClick={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" variant="shadow">
                  Guardar
                </Button>
                <Button color="primary" variant="shadow">
                  Actualizar
                </Button>
                <Button color="primary" variant="shadow">
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
    border: 2px solid #ccc;
    border-radius: 7px;
  }

  .ContenedorConDisplayFLEX {
    display: flex;
    width: 100%;
  }
`;
