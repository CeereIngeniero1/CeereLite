import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  DatePicker,
} from "@nextui-org/react";
import React from "react";
import SelectsRegistroDeUsuario from "../Selects/SelectsRegistroDeUsuario";
import { MostrarModalCiudadOrigen } from "../MostrarModalCiudadOrigen";

export function ModalActualizarUsuario({
  isOpen,
  onOpen,
  onOpenChange,
  DocumentoUsuarioAEditar,
}) {
  // const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  const DocumentoMorrr = DocumentoUsuarioAEditar;
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={"5xl"}
        backdrop={backdrop}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3">
                <b>Actualizar usuario</b>
              </ModalHeader>
              <ModalBody>
                <Input placeholder="Enter your name" value={DocumentoMorrr} />

                <div style={{ width: "100%", border: "solid blue 2px" }}>
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
                            // value={primerNombre}
                            // onChange={(e) => setPrimerNombre(e.target.value)}
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
                            // value={segundoNombre}
                            // onChange={(e) => setSegundoNombre(e.target.value)}
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
                            // value={primerApellido}
                            // onChange={(e) => setPrimerApellido(e.target.value)}
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
                            // value={segundoApellido}
                            // onChange={(e) => setSegundoApellido(e.target.value)}
                          />
                        </th>
                      </tr>

                      <tr>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            key={"outside"}
                            label={"Tipo de Identificación"}
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipodedocumento`}
                            // value={tipoDocumento}
                            // onChange={(e) => setTipoDocumento(e.target.value)}
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
                            value={DocumentoUsuarioAEditar}
                            // value={documento}
                            // onChange={(e) => setDocumento(e.target.value)}
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
                            // value={FechaDeNacimiento}
                            // // onChange={setFechaDeNacimiento}
                            // onChange={FechaValida}
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
                            // value={edad}
                            // onChange={handleInputChange}
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
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/unidadmedidaedad`}
                            // value={UnidadDeMedidaEdad}
                            // onChange={(e) =>
                            //   setUnidadDeMedidaEdad(e.target.value)
                            // }
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            key={"outside"}
                            label={"Sexo"}
                            labelPlacement={"outside"}
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/sexo`}
                            // value={Sexo}
                            // onChange={(e) => setSexo(e.target.value)}
                          />
                        </th>
                        <th>
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
                                // value={
                                //   CiudadSeleccionada
                                //     ? `${CiudadSeleccionada.Ciudad} [${CiudadSeleccionada.id}]`
                                //     : ""
                                // }
                              />
                            </div>
                            <div style={{ width: "40%" }}>
                              {/* <MostrarModalCiudadOrigen
                                CiudadSeleccionada={(Ciudad) =>
                                  setCiudadSeleccionada(Ciudad)
                                }
                              /> */}
                            </div>
                          </div>
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            label="País de Residencia"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/paisderesidencia`}
                            // value={PaisDeResidencia}
                            // onChange={(e) =>
                            //   setPaisDeResidencia(e.target.value)
                            // }
                          />
                        </th>
                      </tr>

                      <tr>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            label="Departamento de Residencia"
                            labelPlacement={"outside"}
                            // options={Departamentos} // Usar las opciones cargadas dinámicamente
                            // value={Departamento} // Este valor controlará qué opción está seleccionada
                            // onChange={(e) => setDepartamento(e.target.value)}
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            label="Ciudad de Residencia"
                            labelPlacement={"outside"}
                            // options={Ciudades} // Usar las opciones cargadas dinámicamente
                            // value={IdCiudad}
                            // onChange={(e) => setIdCiudad(e.target.value)}
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
                            // value={Direccion}
                            // onChange={(e) => setDireccion(e.target.value)}
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            key={"outside"}
                            label="Zona Territorial"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/zonaterritorial`}
                            // value={IdZonaResidencial}
                            // onChange={(e) =>
                            //   setIdZonaResidencial(e.target.value)
                            // }
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
                            // value={Telefono}
                            // onChange={(e) => setTelefono(e.target.value)}
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
                            // value={Correo}
                            // // onChange={(e) => setCorreo(e.target.value)}
                            // onChange={IngresoCorreo}
                          />
                          {/* {Error && (
                            <span
                              className="text-red-500"
                              style={{ fontSize: "13px" }}
                            >
                              {Error}
                            </span>
                          )}{" "} */}
                          {/* Mensaje de error */}
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            key={"outside"}
                            label="Estado Civíl"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/estadocivil`}
                            // value={EstadoCivil}
                            // onChange={(e) => setEstadoCivil(e.target.value)}
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            key={"outside"}
                            label="Ocupación"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/ocupacion`}
                            // value={Ocupacion}
                            // onChange={(e) => setOcupacion(e.target.value)}
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
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/aseguradora`}
                            // value={Aseguradora}
                            // onChange={(e) => setAseguradora(e.target.value)}
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            key={"outside"}
                            label="Tipo de Vinculación"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipoafiliado`}
                            // value={TipoDeVinculacion}
                            // onChange={(e) =>
                            //   setTipoDeVinculacion(e.target.value)
                            // }
                          />
                        </th>
                        <th>
                          <SelectsRegistroDeUsuario
                            isRequired
                            key={"outside"}
                            label="Tipo de Usuario"
                            labelPlacement={"outside"}
                            // placeholder="Seleccionar"
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/tipousuario`}
                            // value={TipoDeUsuario}
                            // onChange={(e) => setTipoDeUsuario(e.target.value)}
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
                            // value={NombreDelResponsable}
                            // onChange={(e) =>
                            //   setNombreDelResponsable(e.target.value)
                            // }
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
                            // apiEndpoint={`http://${servidor}:${port}/api/registrarusuario/parentesco`}
                            // value={ParentescoDelResponsable}
                            // onChange={(e) =>
                            //   setParentescoDelResponsable(e.target.value)
                            // }
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
                            // value={TelefonoDelResponsable}
                            // onChange={(e) =>
                            //   setTelefonoDelResponsable(e.target.value)
                            // }
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
                  <Button color="primary" style={{ fontWeight: "bold" }}>
                    Actualizar
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
