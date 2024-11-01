import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { MyRoutes } from './routers/routes';
import { Sidebar } from './components/Sidebar';
import styled from "styled-components";
import { Light, Dark } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import { PacienteProvider } from './config/PacienteContext';
import { UsuarioProvider } from './config/UsuarioContext';
import { IdPacienteCitaProvider } from './config/IdPacienteCitasContext';
import { EmpresaProvider } from './config/EmpresaContext'
export const ThemeContext = React.createContext(null);

const App = () => {
    // AUTENTICACION DEL TOKEN
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const tokenExp = localStorage.getItem('token_exp');

            if (token && tokenExp) {
                const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
                if (currentTime < tokenExp) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('token_exp');
                    localStorage.removeItem('userLevel');
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
        const intervalId = setInterval(checkAuth, 600000); // Comprobar cada 1 hora

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
    }, []);

    // TEMA CLARO O OSCURO
    const [theme, setTheme] = useState("light");
    const themeStyle = theme === "light" ? Light : Dark;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeStyle}>
                <EmpresaProvider>
                    <IdPacienteCitaProvider>
                        <UsuarioProvider>
                            <PacienteProvider>
                                <Router>
                                    <MainContent
                                        isAuthenticated={isAuthenticated}
                                        sidebarOpen={sidebarOpen}
                                        setSidebarOpen={setSidebarOpen}
                                        setIsAuthenticated={setIsAuthenticated}
                                    />
                                </Router>
                            </PacienteProvider>
                        </UsuarioProvider>
                    </IdPacienteCitaProvider>
                </EmpresaProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

const MainContent = ({ isAuthenticated, sidebarOpen, setSidebarOpen, setIsAuthenticated }) => {
    const location = useLocation();

    return (
        <Container className={sidebarOpen && location.pathname !== '/Evolucion' ? "sidebarState active" : ""}>
            {isAuthenticated && location.pathname !== '/Evolucion' && (
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            )}
            <MyRoutes setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    grid-template-columns: 90px auto;
    background: ${({ theme }) => theme.bgtotal};
    transition: all 0.3s;
    &.active {
        grid-template-columns: 300px auto;
    }
    color: ${({ theme }) => theme.text} !important;
`;

export default App;
