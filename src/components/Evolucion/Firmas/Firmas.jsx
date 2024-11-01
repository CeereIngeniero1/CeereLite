import React, { useState, useEffect } from "react";
import { ModalFirmas } from "./ModalFirmar";





function Signatures({ setFirmaPaciente, setFirmaProfesional, firmaPaciente }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-lg p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6 mt-6">
            <SignatureCard
                title="Firma del Paciente"
                name="fechaPaciente"
                onSave={(image) => setFirmaPaciente(image)}
                initialSignature={firmaPaciente}
            />
            <SignatureCard
                title="Firma del Profesional"
                name="fechaProfesional"
                onSave={(image) => setFirmaProfesional(image)}
            />
        </div>
    );
}

function SignatureCard({ title, onSave, initialSignature }) {
    const [isOpen, setIsOpen] = useState(false);
    const [signatureImage, setSignatureImage] = useState(initialSignature || null);

    useEffect(() => {
        // Si initialSignature es null, restablece el estado al inicial
        setSignatureImage(initialSignature || null);
    }, [initialSignature]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const onSaveSignature = (image) => {
        setSignatureImage(image);
        onSave(image);
    };

    return (
        <div className="flex flex-col items-center w-full md:w-1/2 bg-gray-100 p-3 rounded-lg shadow-inner">
            <label className="flex flex-col items-center justify-center w-40 h-24 bg-gray-200 rounded overflow-hidden cursor-pointer hover:bg-gray-300 transition mb-2">
                {signatureImage ? (
                    <img src={signatureImage} alt="Firma" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-500">Adjuntar firma</span>
                )}
            </label>

            <div className="border-t border-gray-400 w-full text-center pt-3">
                <span className="block font-semibold text-gray-700 text-sm">{title}</span>
                <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm focus:outline-none"
                    onClick={handleOpen}
                >
                    Adjuntar firma
                </button>
            </div>

            <ModalFirmas isOpen={isOpen} onClose={handleClose} onSaveSignature={onSaveSignature} />
        </div>
    );
}


export default Signatures;