import React from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { ModalCiudadOrigen } from "./ModalCiudadOrigen";

export function MostrarModalCiudadOrigen({ CiudadSeleccionada }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        variant="shadow"
        className="capitalize"
        style={{ height: "30px" }}
      >
        •••
      </Button>

      <ModalCiudadOrigen
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        CiudadSeleccionada={CiudadSeleccionada}
      />
    </div>
  );
}
