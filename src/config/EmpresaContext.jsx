import React, { createContext, useContext, useState, useEffect } from 'react';

const EmpresaContext = createContext();

export const useEmpresa = () => useContext(EmpresaContext);

export function EmpresaProvider({ children }) {
    // Cargar la empresa seleccionada desde sessionStorage si existe
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(() => {
        const storedEmpresa = sessionStorage.getItem('empresaSeleccionada');
        return storedEmpresa ? JSON.parse(storedEmpresa) : null;
    });

    useEffect(() => {
        // Almacenar la empresa seleccionada en sessionStorage cuando cambie
        if (empresaSeleccionada) {
            sessionStorage.setItem('empresaSeleccionada', JSON.stringify(empresaSeleccionada));
        }
    }, [empresaSeleccionada]);

    return (
        <EmpresaContext.Provider value={{ empresaSeleccionada, setEmpresaSeleccionada }}>
            {children}
        </EmpresaContext.Provider>
    );
}
