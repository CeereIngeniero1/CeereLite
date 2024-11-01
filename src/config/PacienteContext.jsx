// PacienteContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PacienteContext = createContext();

export const PacienteProvider = ({ children }) => {
    const [documentoPaciente, setDocumentoPaciente] = useState(null);

    return (
        <PacienteContext.Provider value={{ documentoPaciente, setDocumentoPaciente }}>
            {children}
        </PacienteContext.Provider>
    );
};

export const usePaciente = () => {
    return useContext(PacienteContext);
};
