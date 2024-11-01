import React from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { ModalRegistrarUsuario } from "./RegistrarUsuario";
import { PlusIcon } from "./PlusIcon";

export function MostrarModalResgistrarUsuario() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [key, setKey] = React.useState(0); // Para reiniciar completametne el componente

  const CerrarYReinicarTodoEnModalParaRegistrarUsuarios = () => {
    console.log("Cerrando...");
    setKey(prevKey => prevKey + 1); // Para reiniciar completametne el componente
    onClose();
  }
  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        className="capitalize"
        endContent={<PlusIcon />}
      >
        Agregar
      </Button>

      <ModalRegistrarUsuario
        key={key} // Para reiniciar completametne el componente
        isOpen={isOpen}
        onOpen={onOpen}
        // onClose={onClose}
        onClose={CerrarYReinicarTodoEnModalParaRegistrarUsuarios}
      />
    </div>
  );
}