import { servidor } from "../config/config";
import { port } from "../config/config";

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`http://${servidor}:${port}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la solicitud:', errorText);
            throw new Error(`Error: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
};

export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`http://${servidor}:${port}/api${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error al obtener datos de ${endpoint}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error en fetchData:', error);
        throw error;
    }
};


