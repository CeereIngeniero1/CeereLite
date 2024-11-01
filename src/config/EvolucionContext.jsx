import React, { createContext, useContext, useState } from 'react';

const EvolucionContext = createContext();

export function EvolucionProvider({ children }) {
    const [idEvaluacion, setIdEvaluacion] = useState(null);
    const [tipoHC, setTipoHC] = useState('Evolución'); // Nuevo estado

    return (
        <EvolucionContext.Provider value={{ idEvaluacion, setIdEvaluacion, tipoHC, setTipoHC }}>
            {children}
        </EvolucionContext.Provider>
    );
}

export function useEvolucion() {
    return useContext(EvolucionContext);
}
