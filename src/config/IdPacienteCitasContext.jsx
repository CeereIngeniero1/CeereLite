// IdPacienteCitaContext.js
import React, { createContext, useContext, useState } from 'react';

const IdPacienteCitaContext = createContext();

export const IdPacienteCitaProvider = ({ children }) => {
    const [idPacienteCita, setIdPacienteCita] = useState('');

    return (
        <IdPacienteCitaContext.Provider value={{ idPacienteCita, setIdPacienteCita }}>
            {children}
        </IdPacienteCitaContext.Provider>
    );
};

export const useIdPacienteCita = () => useContext(IdPacienteCitaContext);
