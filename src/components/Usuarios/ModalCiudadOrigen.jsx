import React from "react";
import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { TablaCiudadesOrigen } from "./TablaCiudades";

export function ModalCiudadOrigen({
  CiudadSeleccionada,
  isOpen,
  onOpen,
  onClose,
}) {
  const [backdrop, setBackdrop] = React.useState("Blur");

  return (
    <Modal size={"xl"} backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div style={{ textAlign: "center" }}>
                {/* <label>Selecciona la ciudad de nacimiento o en su defecto, una ciudad que contenga el país de nacimiento.</label> */}
                <label htmlFor="">
                  Selecciona la ciudad de nacimiento o una ciudad que incluya el
                  país de nacimiento
                </label>
              </div>
            </ModalHeader>
            <ModalBody>
              <TablaCiudadesOrigen CiudadSeleccionada={CiudadSeleccionada} onClose={onClose}/>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
