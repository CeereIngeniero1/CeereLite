import { useState, useEffect } from 'react';
import { loginUser } from '../services/apiService';
import Swal from 'sweetalert2';
import { useUsuario } from '../config/UsuarioContext'; // Ajusta la ruta según corresponda
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import { useEmpresa } from '../config/EmpresaContext'; // Ajusta la ruta
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from '../assets/Background.jpg'
import { servidor, port } from '../config/config';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setDocumentoEntidad, setNombreUsuario } = useUsuario();
    const { setEmpresaSeleccionada, empresaSeleccionada } = useEmpresa();
    const [empresas, setEmpresas] = useState([]);

    const handleLogin = async () => {
        if (username === '') {
            Swal.fire({
                title: "¡El campo usuario está vacío!",
                icon: "warning",
                confirmButtonText: "OK"
            });
        } else if (password === '') {
            Swal.fire({
                title: "¡El campo contraseña está vacío!",
                icon: "warning",
                confirmButtonText: "OK"
            });
        } else {
            try {
                const { token, userLevel, documentoEntidad, nombreUsuario } = await loginUser(username, password);
                const { exp } = JSON.parse(atob(token.split('.')[1]));

                // Guardar token y detalles del usuario
                setDocumentoEntidad(documentoEntidad);
                setNombreUsuario(nombreUsuario);
                localStorage.setItem('token', token);
                localStorage.setItem('token_exp', exp);
                localStorage.setItem('userLevel', userLevel);

                // Mostrar el selector de empresa después de la autenticación exitosa
                mostrarSelectorEmpresa();

            } catch (error) {
                toast.error(`Credenciales incorrectas!`, {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            }
        }
    };

    const mostrarSelectorEmpresa = async () => {
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/seleccionEmpresa`);
            const empresasData = response.data;
            setEmpresas(empresasData);

            Swal.fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'question',
                title: '¿En qué empresa desea trabajar?',
                width: '400px', // Hacemos el modal más pequeño
                padding: '1rem', // Reducimos el padding para que sea más compacto
                backdrop: `
                    rgba(0,0,0,0.4) 
                `, // Esto es opcional, pero puedes usarlo para agregar un fondo animado o color de sombra
                html: ReactDOMServer.renderToStaticMarkup(
                    <select id="EmpresaATrabajar" className="swal2-input-custom" style={{width: '310px'}}>
                        <option value="">Seleccione una empresa</option>
                        {empresasData.map((empresa) => (
                            <option key={empresa.DocumentoEmpresa} value={empresa.DocumentoEmpresa}>
                                {empresa.NombreComercialEmpresa}
                            </option>
                        ))}
                    </select>
                ),
                confirmButtonText: 'Seleccionar',
                confirmButtonColor: '#3085d6',
                preConfirm: () => {
                    const empresaSeleccionada = document.getElementById('EmpresaATrabajar').value;
                    if (!empresaSeleccionada) {
                        Swal.showValidationMessage('Debe seleccionar una empresa');
                    }
                    return empresaSeleccionada;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const selectElement = document.getElementById('EmpresaATrabajar');
                    const documentoEmpresaSeleccionada = selectElement.value;
                    const nombreEmpresaSeleccionada = selectElement.options[selectElement.selectedIndex].text;

                    setEmpresaSeleccionada({ documentoEmpresa: documentoEmpresaSeleccionada, nombreEmpresa: nombreEmpresaSeleccionada });
                    sessionStorage.setItem("empresaTrabajarExecuted", documentoEmpresaSeleccionada);
                    sessionStorage.setItem("empresaTrabajarNombre", nombreEmpresaSeleccionada);

                    toast.success(`Empresa seleccionada: ${nombreEmpresaSeleccionada}`, {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                        onClose: () => {
                            setIsAuthenticated(true);
                        }
                    });
                }
            });

        } catch (error) {
            console.error('Hubo un problema con la solicitud:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-[100vh] bg-no-repeat bg-cover bg-center w-[143%] sm:w-[250%] md:w-[300%] lg:w-[420.3%] xl:w-[455.2%] 2xl:w-[560%]" style={{ backgroundImage: `url(${backgroundImage})` }}>

                <div className="lg-w-[420px] bg-transparent shadow-[0_0_10px_rgba(0,0,0,0.2)] text-white p-[30px_40px]" style={{ border: '2px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(30px)' }}>

                    <form>
                        <h1 className="text-[36px] text-center">Iniciar Sesión</h1>
                        <div className="relative w-full h-[50px] mt-[30px]">
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-full bg-transparent outline-none rounded-[40px] text-[16px] text-white p-[20px] pr-[45px]  placeholder-white"
                                style={{ border: '2px solid rgba(255, 255, 255, .2)' }}
                            />
                            <FaUser className="absolute right-[20px] top-[20%] transform -translate-y-[-50%] text-16px" />
                        </div>

                        <div className="relative w-full h-[50px] mt-[30px]">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full h-full bg-transparent outline-none rounded-[40px] text-[16px] text-white p-[20px] pr-[45px] placeholder-white"
                                style={{ border: '2px solid rgba(255, 255, 255, .2)' }}
                            />
                            <FaLock className="absolute right-[20px] top-[20%] transform -translate-y-[-50%] text-16px" />
                        </div>

                        <div className="flex justify-between text-[14.5px] mr-0 mt-[15px] mb-[15px]">
                            <label htmlFor=""><input type="checkbox" className="accent-white mr-1" />Recordarme</label>
                            <a href="#" className="text-white no-underline hover:underline">Recordar contraseña</a>
                        </div>
                        <button type="button"
                            onClick={handleLogin}
                            className="w-full h-[45px] bg-white border-none rounded-[40px] shadow-[0_0_10px_rgba(0,0,0,0.1)] cursor-pointer text-[16px] text-[#333] font-bold"
                        >
                            Iniciar sesión
                        </button>


                        <div className="text-[14.5px] text-center mt-[20px] m-0 mb-[15px]">
                            <p className="text-white no-underline font-semibold hover:underline">No tiene usuario?<a href="" className="text-white no-underline font-semibold hover:underline"> Solicite uno aquí</a></p>
                        </div>
                    </form>
                </div>
                <ToastContainer />

            </div>
        </>
    );
};

export default Login;
