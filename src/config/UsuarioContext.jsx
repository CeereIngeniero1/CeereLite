// DocumentoContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentoContext = createContext();

export const UsuarioProvider = ({ children }) => {
    const [documentoEntidad, setDocumentoEntidad] = useState(() => {
        const savedValue = sessionStorage.getItem('documentoEntidad');
        return savedValue ? JSON.parse(savedValue) : null;
    });

    const [nombreUsuario, setNombreUsuario] = useState(() => {
        const savedValue = sessionStorage.getItem('nombreUsuario');
        return savedValue ? JSON.parse(savedValue) : null;
    });

    useEffect(() => {
        sessionStorage.setItem('documentoEntidad', JSON.stringify(documentoEntidad));
    }, [documentoEntidad]);

    useEffect(() => {
        sessionStorage.setItem('nombreUsuario', JSON.stringify(nombreUsuario));
    }, [nombreUsuario]);

    return (
        <DocumentoContext.Provider value={{ documentoEntidad, setDocumentoEntidad, nombreUsuario, setNombreUsuario }}>
            {children}
        </DocumentoContext.Provider>
    );
};

export const useUsuario = () => {
    return useContext(DocumentoContext);
};
