import React, { useState } from "react";
import styled from "styled-components";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { BotonesModals } from "../Navbar/Boton";
import SelectModal from "../Navbar/Select";
import { servidor, port } from "../../../config/config";
import { useEmpresa } from "../../../config/EmpresaContext";
import InputDate from "../Navbar/inputDate";
import Swal from "sweetalert2";
import axios from "axios";
import { MensajeDeCarga } from "../../Alerts/MensajeDeCarga";

export function ModalXML() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const [size, setSize] = React.useState("lg");
  const backdrops = ["blur"];
  const [resolucion, setResolucion] = useState("");
  const [textoResolucion, setTextoResolucion] = useState("");
  const { empresaSeleccionada } = useEmpresa();
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // EXTRAER PREFIJO DE RESOLUCION
  let TextoPrefijo = "";
  const match = textoResolucion.match(/^[A-Za-z]+/);
  if (match) {
    TextoPrefijo = match[0];
  }

  // console.log(`El prefijo de la resolución es: ${TextoPrefijo}`);
  // console.log(`El texto de la resolución es: ${textoResolucion}`);
  // console.log(`El value de la resolución es: ${resolucion}`);

  const handleOpen = ({ backdrop = "", size = "" }) => {
    if (backdrop) {
      setBackdrop(backdrop);
    }
    if (size) {
      setSize(size);
    }
    onOpen();
  };

  const DescargarXML = async () => {
    if (
      !empresaSeleccionada.documentoEmpresa ||
      !resolucion ||
      !fechaInicio ||
      !fechaFin
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, llena todos los campos para realizar la descarga de los XMLS.",
        confirmButtonColor: "#2c3e50",
        timer: 3000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        // showCancelButton: true,
        // showConfirmButton: true,
      });
      return;
    }

    if (fechaInicio >= fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Fecha Invalida!",
        text: "La fecha de inicio debe ser menor que la fecha de fin.",
        confirmButtonColor: "#2c3e50",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://${servidor}:${port}/XMLS/descargarxmls-api-facturatech/${TextoPrefijo}/${fechaInicio}/${fechaFin}/${empresaSeleccionada.documentoEmpresa}`
      );

      const data = response.data;

      if (data.error) {
        Swal.fire({
          icon: "error",
          html: `
                <h3>Hubo un problema al descargar los XMLs</h3>
                <br />
                <p>Error: ${data.error}</p>
            `,
          confirmButtonColor: "#2c3e50",
        });
        throw new Error(data.error);
      }

      // Verifica si 'data' y 'data.facturas' existen y son válidos
      const Facturas =
        data && Array.isArray(data.facturas) ? data.facturas : [];
      let MensajeDelEnviadoDelServidor =
        data && data.message ? data.message : "No hay mensaje del servidor";

      console.log(
        "Mensaje enviado del servidor:",
        MensajeDelEnviadoDelServidor
      );
      console.log("Facturas recibidas:", Facturas);

      if (Facturas.length > 0) {
        // Si hay facturas, se ordenan y se muestra la tabla
        // Facturas.sort((b, a) => a.NoFactura.localeCompare(b.NoFactura));
        // console.log('Facturas ordenadas:', Facturas);

        const itemsPerPage = 8;
        let currentPage = 1;

        function renderTable(page) {
          const start = (page - 1) * itemsPerPage;
          const end = page * itemsPerPage;
          const paginatedFacturas = Facturas.slice(start, end);

          let tableHTML = `
                <table class="table-hover" border="1" width="100%" cellpadding="5" cellspacing="0" style="margin: 0 auto; margin-top: 0px;">
                    <thead>
                        <tr>
                            <th style="color: #000000;" id="ColumnaNumeroFactura">No. Factura &#9660;</th>
                            <th style="color: #000000;">Fecha Factura</th> 
                            <th style="color: #000000;">Prefijo</th>
                            <th style="color: #000000;">Ruta del XML</th>
                            <th style="color: #000000; cursor: pointer;" id="ColumnaEstadoXML">Estado XML &#9660;</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

          paginatedFacturas.forEach((factura) => {
            tableHTML += `
                    <tr style="color: gray;">
                        <td>${factura.NoFactura}</td>
                        <td>${factura.FechaFactura}</td>
                        <td>${factura.Prefijo}</td>
                        <td>${factura.filePath || "No disponible"}</td>
                        <td>${factura.estado}</td>
                    </tr>
                `;
          });

          tableHTML += `
                    </tbody>
                </table>
            `;

          renderPagination(tableHTML);
          return tableHTML;
        }

        // let ordenNumeroFacturaAscendente = false;
        // let ordenEstadoXMLAscendente = true;

        // function Ordenar(Columna) {
        //     switch (Columna) {
        //         case "OrdenarPorNumeroFactura":
        //             const TextoColumnaNumeroFactura = document.getElementById('ColumnaNumeroFactura');
        //             // Alterna el orden de la columna de número de factura
        //             if (ordenNumeroFacturaAscendente) {
        //                 Facturas.sort((a, b) => a.NoFactura.localeCompare(b.NoFactura));
        //                 TextoColumnaNumeroFactura.innerHTML = 'No. Factura &#9650';
        //                 console.log(TextoColumnaNumeroFactura)
        //             } else {
        //                 Facturas.sort((a, b) => b.NoFactura.localeCompare(a.NoFactura));
        //                 TextoColumnaNumeroFactura.innerHTML = 'No. Factura &#9660;';
        //             }
        //             ordenNumeroFacturaAscendente = !ordenNumeroFacturaAscendente;
        //             break;

        //         case "OrdenarPorEstadoXML":
        //             const TextoColumnaEstadoXML = document.getElementById('ColumnaEstadoXML');
        //             // Alterna el orden de la columna de estado XML
        //             if (ordenEstadoXMLAscendente) {
        //                 Facturas.sort((a, b) => a.estado.localeCompare(b.estado));
        //                 TextoColumnaEstadoXML.innerHTML = 'Estado XML &#9650;';
        //                 console.log(TextoColumnaEstadoXML)
        //             } else {
        //                 Facturas.sort((a, b) => b.estado.localeCompare(a.estado));
        //                 TextoColumnaEstadoXML.innerHTML = 'Estado XML &#9660;';
        //             }
        //             ordenEstadoXMLAscendente = !ordenEstadoXMLAscendente;
        //             break;
        //     }
        //     // Renderiza la tabla con la página actual
        //     showSwal();
        // }

        function renderPagination() {
          const totalPages = Math.ceil(Facturas.length / itemsPerPage);
          let paginationHTML = "";

          // if (currentPage > 1) {
          //   paginationHTML += `<button onclick="goToPage(${
          //     currentPage - 1
          //   })" class="btn btn-success fw-normal" style="width: 96px;">Anterior</button>`;
          // }

          if (currentPage > 1) {
            paginationHTML += `<button onclick="goToPage(${
              currentPage - 1
            })" style="  padding: 10px 20px;
              background-color: #2c3e50; 
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-weight: bold;
              font-size: 14px;
              width: 105px">Anterior</button>`;
          }

          // for (let i = 1; i <= totalPages; i++) {
          //   const isActive = currentPage === i ? "btn-primary" : "btn-light";
          //   const isActiveFontWeight =
          //     currentPage === i ? "fw-bold" : "fw-normal";

          //   paginationHTML += `<button onclick="goToPage(${i})" class="btn ${isActive} text-center ${isActiveFontWeight} rounded-circle" style="width: 40px; height: 40px; font-size: 10.8px;">${i}</button>`;
          // }

          for (let i = 1; i <= totalPages; i++) {
            const isActive =
              currentPage === i
                ? "bg-primary text-white"
                : "bg-light text-dark";
            const isActiveFontWeight =
              currentPage === i ? "font-bold" : "font-normal";

            paginationHTML += `<button onclick="goToPage(${i})" class="btn ${isActive} ${isActiveFontWeight} w-10 h-10 text-xs rounded-full">${i}</button>`;
          }

          // if (currentPage < totalPages) {
          //   paginationHTML += `<button onclick="goToPage(${
          //     currentPage + 1
          //   })" class="btn btn-success fw-normal" style="width: 96px;">Siguiente</button>`;
          // }

          // #4CAF50
          if (currentPage < totalPages) {
            paginationHTML += `<button onclick="goToPage(${
              currentPage + 1
            })" style="  padding: 10px 20px;
              background-color: #2c3e50; 
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-weight: bold;
              font-size: 14px;
              width: 105px">Siguiente</button>`;
          }

          return paginationHTML;
        }

        function goToPage(page) {
          currentPage = page;
          showSwal();
        }

        // Aseguramos que las funciones sean globales
        window.goToPage = goToPage;
        window.Ordenar = Ordenar;

        let ordenNumeroFacturaAscendente = false;
        let ordenEstadoXMLAscendente = true;

        // Ordena inicialmente por estado XML ascendente al mostrar la tabla
        Ordenar("OrdenarPorNumeroFactura");

        // function showSwal() {
        //     const tableHTML = renderTable(currentPage);
        //     const paginationHTML = renderPagination();

        //     Swal.fire({
        //         title: data.message,
        //         html: tableHTML + '<div style="text-align: center; margin-top: 20px;">' + paginationHTML + '</div>',
        //         width: '94%',
        //         showCloseButton: true,
        //         showCancelButton: true,
        //         focusConfirm: false,
        //         confirmButtonText: 'Aceptar',
        //         cancelButtonText: 'Cancelar'
        //     }).then(() => {

        //         // Asigna el evento onclick al th de "Estado XML" una vez que se haya renderizado el modal
        //         const ColumnaEstadoXML = document.getElementById('ColumnaEstadoXML');
        //         ColumnaEstadoXML.addEventListener('click', () => {
        //             Ordenar('OrdenarPorEstadoXML');
        //             console.log("Se ordenó por el estado del XML Header");
        //         });

        //         const ColumnaNumeroFactura = document.getElementById('ColumnaNumeroFactura');
        //         ColumnaNumeroFactura.addEventListener('click', () => {
        //             Ordenar('OrdenarPorNumeroFactura');
        //             console.log("Se ordenó por el número de factura Header");
        //         });

        //         actualizarEncabezados();
        //     });
        // }

        function showSwal() {
          const tableHTML = renderTable(currentPage);
          const paginationHTML = renderPagination();

          if (Swal.isVisible()) {
            // Si el modal ya está visible, solo actualiza el contenido
            // Swal.getTitle().textContent = data.message;

            // Modificar el ancho del modal directamente
            const swalContainer = Swal.getPopup(); // Obtiene el contenedor principal del modal
            swalContainer.style.width = "94%"; // Ajusta el ancho al 94%

            const container = Swal.getHtmlContainer();
            container.innerHTML =
              `<h3 class="fw-bold">${data.message}</h3>` +
              tableHTML +
              '<div id="paginacion-container" style="text-align: center; margin-top: 10px;">' +
              paginationHTML +
              "</div>";

            // Asegura que el botón de cerrar esté visible
            const closeButton = Swal.getCloseButton();
            if (closeButton) {
              closeButton.style.display = "block";
            }

            // Obtener el botón de aceptar
            // const confirmButton = Swal.getConfirmButton();
            // if (confirmButton) {
            //   confirmButton.style.display = "block";
            //   confirmButton.textContent = "Aceptar";
            //   confirmButton.style.backgroundColor = "#2c3e50";
            // }

            actualizarEncabezados();
          }

          // Asigna los eventos a las cabeceras después de renderizar la tabla
          const ColumnaEstadoXML = document.getElementById("ColumnaEstadoXML");
          ColumnaEstadoXML.addEventListener("click", () => {
            Ordenar("OrdenarPorEstadoXML");
            console.log("Se ordenó por el estado del XML Header");
          });

          const ColumnaNumeroFactura = document.getElementById(
            "ColumnaNumeroFactura"
          );
          ColumnaNumeroFactura.addEventListener("click", () => {
            Ordenar("OrdenarPorNumeroFactura");
            console.log("Se ordenó por el número de factura Header");
          });
        }

        function actualizarEncabezados() {
          const TextoColumnaNumeroFactura = document.getElementById(
            "ColumnaNumeroFactura"
          );
          const TextoColumnaEstadoXML =
            document.getElementById("ColumnaEstadoXML");

          if (TextoColumnaNumeroFactura) {
            TextoColumnaNumeroFactura.innerHTML = ordenNumeroFacturaAscendente
              ? "No. Factura &#9660;"
              : "No. Factura &#9650;";
          }

          if (TextoColumnaEstadoXML) {
            TextoColumnaEstadoXML.innerHTML = ordenEstadoXMLAscendente
              ? "Estado XML &#9660;"
              : "Estado XML &#9650;";
          }
        }

        function Ordenar(Columna) {
          switch (Columna) {
            case "OrdenarPorNumeroFactura":
              // Alterna el orden de la columna de número de factura
              Facturas.sort((a, b) =>
                ordenNumeroFacturaAscendente
                  ? a.NoFactura.localeCompare(b.NoFactura)
                  : b.NoFactura.localeCompare(a.NoFactura)
              );
              ordenNumeroFacturaAscendente = !ordenNumeroFacturaAscendente;
              break;

            case "OrdenarPorEstadoXML":
              // Alterna el orden de la columna de estado XML
              Facturas.sort((a, b) =>
                ordenEstadoXMLAscendente
                  ? a.estado.localeCompare(b.estado)
                  : b.estado.localeCompare(a.estado)
              );
              ordenEstadoXMLAscendente = !ordenEstadoXMLAscendente;
              break;
          }
          // Renderiza la tabla con la página actual
          showSwal();
        }

        // Inicializa la tabla con la primera página
        showSwal();
      } else {
        // Si no hay facturas, muestra solo el mensaje del servidor
        Swal.fire({
          text: data.message,
          icon: "info",
          // html: `
          //     <p>No se recibieron facturas para mostrar.</p>
          // `,
          // width: '60%',
          showCloseButton: true,
          // confirmButtonText: "Aceptar",
          // confirmButtonColor: "#2c3e50",
        });
      }
    } catch (Error) {
      console.error("Error al descargar los XMLS:", Error.message);
      Swal.fire({
        icon: "error",
        text:
          "Hubo un problema al descargar los XMLS. Error =>" + Error.message,
        confirmButtonColor: "#2c3e50",
      });
    }
  };

  const DescargarArchivosXML = async () => {
    MensajeDeCarga("Descargando XML...");
    // await Esperar(1000);
    DescargarXML();
  };

  return (
    <Container>
      <div className="flex flex-wrap gap-3">
        {backdrops.map((b, index) => (
          <BotonesModals
            key={index}
            onPress={() => handleOpen({ backdrop: b })}
            className="capitalize"
            nombreBoton="Descargar XML"
          />
        ))}
      </div>
      <Modal
        isDismissable={false}
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        className="custom-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1"
                style={{ textAlign: "center" }}
              >
                Seleccione el rango de fechas en el que desea descargar los
                archivos XML
              </ModalHeader>
              <ModalBody className="flex flex-col gap-1 !w-full mb-5">
                <div className="resoluciones mx-auto w-[250px] mb-4">
                  <SelectModal
                    label="Seleccione una resolución"
                    apiEndpoint={`http://${servidor}:${port}/api/mostrar-resoluciones-vigentes-segun-empresa-seleccionada/${empresaSeleccionada.documentoEmpresa}`}
                    placeholder="Seleccione una resolución"
                    onValueChange={setResolucion}
                    onValueChangeText={setTextoResolucion}
                  />
                </div>

                <div className="rango-fechas flex gap-[30px]">
                  <InputDate
                    onChange={setFechaInicio}
                    labelFechaInicio="Fecha Inicio"
                    descripcion="Fecha Inicio"
                  />

                  <InputDate
                    onChange={setFechaFin}
                    labelFechaInicio="Fecha Fin"
                    descripcion="Fecha Fin"
                  />
                </div>
              </ModalBody>
              <ModalFooter className="mb-0">
                <Button color="danger" variant="light">
                  Cerrar
                </Button>
                <Button color="primary" onClick={DescargarArchivosXML}>
                  Descargar XML
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  // Estilos de tu contenedor aquí
`;
