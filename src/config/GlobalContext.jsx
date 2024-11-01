// Context.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const GlobalContext = createContext();

// Proveedor del contexto
export const GlobalProvider = ({ children }) => {
    const [resetState, setResetState] = useState(false);

    const resetComponents = () => {
        setResetState(true);
        setTimeout(() => setResetState(false), 0); // Para forzar la actualización
    };

    return (
        <GlobalContext.Provider value={{ resetState, resetComponents }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Hook para usar el contexto
export const useGlobalContext = () => useContext(GlobalContext);
