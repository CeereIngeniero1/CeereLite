// import { Route, Routes, Navigate } from 'react-router-dom'; // Asegúrate de importar Navigate
// import { Home } from '../pages/Home';
// import { Evolucion } from '../pages/Evolucion';
// import { Agenda } from '../pages/Agenda';
// import Login from '../components/Login';
// import { useEffect } from 'react';
// import { Usuarios } from '../pages/Usuarios';
// import { Rips } from '../pages/Rips';
// import { Facturacion } from '../pages/Facturacion';
// import { AgregarResolucion } from '../pages/Facturacion/AgregarResolucion';
// import { AgregarProductos } from '../pages/Facturacion/AgregarProductos';
// import { Configuracion } from '../pages/Configuracion'


// import Invoice from '../../pruebas';


// function PrivateRoute({ element, isAuthenticated }) {
//     return isAuthenticated ? element : <Navigate to="/InicioDeSesion" />;
// }

// export function MyRoutes({ setIsAuthenticated, isAuthenticated }) {
//     useEffect(() => {
//         const checkAuth = () => {
//             const token = localStorage.getItem('token');
//             const tokenExp = localStorage.getItem('token_exp');

//             if (token && tokenExp) {
//                 const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos
//                 if (currentTime < tokenExp) {
//                     setIsAuthenticated(true);
//                 } else {
//                     setIsAuthenticated(false);
//                     localStorage.removeItem('token');
//                     localStorage.removeItem('token_exp');
//                     localStorage.removeItem('userLevel');
//                 }
//             } else {
//                 setIsAuthenticated(false);
//             }
//         };

//         checkAuth();
//         const intervalId = setInterval(checkAuth, 600000); // Comprobar cada 1 hora

//         return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
//     }, [setIsAuthenticated]);

//     return (
//         <Routes>
//             <Route path="/" element={<Navigate to="/InicioDeSesion" />} />
//             <Route path="/InicioDeSesion" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
//             <Route path="/Agenda" element={<PrivateRoute element={<Agenda />} isAuthenticated={isAuthenticated} />} />
//             <Route path="/Evolucion" element={<PrivateRoute element={<Evolucion />} isAuthenticated={isAuthenticated} />} />
//             <Route path="/Facturacion" element={<PrivateRoute element={<Facturacion />} isAuthenticated={isAuthenticated} />} />
//             <Route path="/Usuarios" element={<PrivateRoute element={<Usuarios />} isAuthenticated={isAuthenticated} />} />
//             <Route path="/Rips" element={<PrivateRoute element={<Rips />} isAuthenticated={isAuthenticated} />} />

//             {/* RUTAS FACTURACIÓN */}
//             <Route path="/AgregarResolucion" element={<PrivateRoute element={<AgregarResolucion />} isAuthenticated={isAuthenticated} />} />
//             <Route path="/AgregarProductos" element={<PrivateRoute element={<AgregarProductos />} isAuthenticated={isAuthenticated} />} />

//             {/* RUTA PARA PRUEBAS */}
//             <Route path="/Pruebas" element={<PrivateRoute element={<Invoice />} isAuthenticated={isAuthenticated} />} />

//             {/* RUTA PARA CONFIGURACIÓN */}
//             <Route path="/Configuracion" element={<PrivateRoute element={<Configuracion />} isAuthenticated={isAuthenticated} />} />
//         </Routes>
//     );
// }





import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Evolucion } from '../pages/Evolucion';
import { Agenda } from '../pages/Agenda';
import Login from '../components/Login';
import { Usuarios } from '../pages/Usuarios';
import { Rips } from '../pages/Rips';
import { Facturacion } from '../pages/Facturacion';
import { AgregarResolucion } from '../pages/Facturacion/AgregarResolucion';
import { AgregarProductos } from '../pages/Facturacion/AgregarProductos';
import { Configuracion } from '../pages/Configuracion';
import Invoice from '../../pruebas';

function PrivateRoute({ element, isAuthenticated }) {
    return isAuthenticated ? element : <Navigate to="/InicioDeSesion" />;
}

export function MyRoutes({ setIsAuthenticated, isAuthenticated }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const tokenExp = localStorage.getItem('token_exp');

            if (token && tokenExp) {
                const currentTime = Math.floor(Date.now() / 1000);
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

            setLoading(false); // <- Agregado aquí
        };

        checkAuth();
        const intervalId = setInterval(checkAuth, 600000);

        return () => clearInterval(intervalId);
    }, [setIsAuthenticated]);

    if (loading) {
        return <div>Cargando...</div>; // <- No renders rutas si no sabes si está autenticado
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/InicioDeSesion" />} />
            {/* <Route path="/InicioDeSesion" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} /> */}
            <Route path="/Principal/Home" element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
            <Route path="/InicioDeSesion" element={isAuthenticated ? <Navigate to="/Principal/Home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/Principal/Agenda" element={<PrivateRoute element={<Agenda />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Evolucion" element={<PrivateRoute element={<Evolucion />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/Facturacion" element={<PrivateRoute element={<Facturacion />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/Usuarios" element={<PrivateRoute element={<Usuarios />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/Rips" element={<PrivateRoute element={<Rips />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/AgregarResolucion" element={<PrivateRoute element={<AgregarResolucion />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/AgregarProductos" element={<PrivateRoute element={<AgregarProductos />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/Pruebas" element={<PrivateRoute element={<Invoice />} isAuthenticated={isAuthenticated} />} />
            <Route path="/Principal/Configuracion" element={<PrivateRoute element={<Configuracion />} isAuthenticated={isAuthenticated} />} />
        </Routes>
    );
}
