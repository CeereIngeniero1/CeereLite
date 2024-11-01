import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import styled from 'styled-components';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export function ModalFirmas({ isOpen, onClose, onSaveSignature }) {
    const signatureRef = useRef(null);

    const handleSave = () => {
        if (signatureRef.current) {
            const signatureImage = signatureRef.current.toDataURL("image/png");
            onSaveSignature(signatureImage);  // Envía la imagen de la firma a `SignatureCard`
            onClose(); // Cierra el modal
        }
    };

    const handleClear = () => {
        signatureRef.current.clear();
    };

    return (
        <Container>
            <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="lg">
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Firmas</ModalHeader>
                        <ModalBody>
                            <SignatureCanvas
                                ref={signatureRef}
                                penColor="black"
                                canvasProps={{
                                    width: 400,
                                    height: 200,
                                    className: "signature-canvas bg-gray-100 border border-gray-300 rounded",
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="warning" onPress={handleClear}>
                                Limpiar
                            </Button>
                            <Button color="primary" onPress={handleSave}>
                                Guardar firma
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </Container>
    );
}

const Container = styled.div`
    .signature-canvas {
        touch-action: none;
    }
`;
