import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { v } from "../styles/Variables";
import { AiOutlineLeft, AiOutlineHome,  AiOutlineMedicineBox } from "react-icons/ai";
import { IoAddCircle, IoSettingsSharp  } from "react-icons/io5";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FaMoneyBillTrendUp, FaBookMedical } from "react-icons/fa6";
import { useNavigate, NavLink } from "react-router-dom";
import { ThemeContext } from "../App";
import { useEmpresa } from "../config/EmpresaContext";
import axios from 'axios'
import { servidor, port } from "../config/config";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const { setEmpresaSeleccionada, empresaSeleccionada } = useEmpresa();
    const [showFacturacionSubmenu, setShowFacturacionSubmenu] = useState(false); // Estado para el submenú de Facturación
    const [imageSrc, setImageSrc] = useState(null);

    const docEmpresa = empresaSeleccionada.documentoEmpresa;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/get-image/${docEmpresa}`);
                const imageBase64 = response.data.image;
                if (imageBase64) {
                    setImageSrc(`data:image/jpeg;base64,${imageBase64}`); // Prepara la imagen en formato base64
                }
            } catch (err) {
                console.error('Error al obtener la imagen', err);
            }
        };

        fetchImage();
    }, [docEmpresa]);

    const handleFacturacionClick = () => {
        setShowFacturacionSubmenu(!showFacturacionSubmenu);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_exp');
        localStorage.removeItem('userLevel');
        setEmpresaSeleccionada(null);
        sessionStorage.removeItem('empresaSeleccionada');
        navigate('/');
        window.location.reload();
    };

    const ModSidebaropen = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const { setTheme, theme } = useContext(ThemeContext);
    const CambiarTheme = () => {
        setTheme((theme) => (theme === "light" ? "dark" : "light"));
    };

    return (
        <Container isOpen={sidebarOpen} themeUse={theme}>
            <button className="Sidebarbutton" onClick={ModSidebaropen}>
                <AiOutlineLeft />
            </button>
            <div className="Logocontent">
                <div className="imgcontent">
                    <img src={imageSrc} />
                </div>
                <h2>CeereSio Lite</h2>
            </div>
            {linksArray.map(({ icon, label, to }) => (
                label === "Facturación" ? (
                    <div className="LinkFactura" key={label}>
                        <button className="Links" onClick={handleFacturacionClick}>
                            <div className="Linkicon">{icon}</div>
                            {sidebarOpen && <span>{label}</span>}
                        </button>
                        {/* Submenú de Facturación */}
                        {showFacturacionSubmenu && (
                            <SubmenuContainer>
                                <NavLink to="/Facturacion" className="SubmenuLink">
                                    <IoAddCircle />  {/* Icono de Crear Factura */}
                                    {sidebarOpen && <span>Crear Factura</span>}
                                </NavLink>
                                <NavLink to="/AgregarResolucion" className="SubmenuLink">
                                    <IoAddCircle />  {/* Icono de Agregar Resolución */}
                                    {sidebarOpen && <span>Agregar Resolución</span>}
                                </NavLink>
                                <NavLink to="/AgregarProductos" className="SubmenuLink">
                                    <IoAddCircle />  {/* Icono de Agregar Resolución */}
                                    {sidebarOpen && <span>Agregar Productos</span>}
                                </NavLink>
                            </SubmenuContainer>
                        )}
                    </div>

                ) : (
                    <div className="LinkContainer" key={label}>
                        <NavLink
                            to={to}
                            className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
                        >
                            <div className="Linkicon">{icon}</div>
                            {sidebarOpen && <span>{label}</span>}
                        </NavLink>
                    </div>
                )
            ))}
            <Divider />
            {secondarylinksArray(handleLogout).map(({ icon, label, onClick }) => (
                <div className="LinkContainer" key={label}>
                    <button className="Links" onClick={onClick}>
                        <div className="Linkicon">{icon}</div>
                        {sidebarOpen && <span>{label}</span>}
                    </button>
                </div>
            ))}
            <Divider />
            <div className="Themecontent" style={{display: 'none'}}>
                {sidebarOpen && <span className="titletheme">Dark mode</span>}
                <div className="Togglecontent">
                    <div className="grid theme-container">
                        <div className="content">
                            <div className="demo">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        className="theme-swither"
                                        onClick={CambiarTheme}
                                    ></input>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

//#region Data links
const linksArray = [
    {
        label: "Home",
        icon: <AiOutlineHome />,
        to: "/",
    },
    {
        label: "Agenda",
        icon: <FaCalendarAlt size={23} />,
        to: "/Agenda",
    },
    {
        label: "Evolución Médica",
        icon: <FaBookMedical size={23} />,
        to: "/Evolucion",
    },
    // {
    //     label: "Facturación",
    //     icon: <FaMoneyBillTrendUp />,
    //     to: "#", // No tiene ruta, pues despliega submenú
    // },
    {
        label: "Usuarios",
        icon: <FaUserFriends />,
        to: "/Usuarios",
    },
    // {
    //     label: "Relacionador RIPS",
    //     icon: <AiOutlineMedicineBox />,
    //     to: "/Rips",
    // },
    // {
    //     label: "Pruebas",
    //     icon: <MdLogout />,
    //     to: "Pruebas",
    // },
    {
        label: "Configuración",
        icon: <IoSettingsSharp />,
        to: "Configuracion",
    },
];

const secondarylinksArray = (handleLogout) => [
    {
        label: "Salir",
        icon: <MdLogout />,
        onClick: handleLogout,
    },

];

//#region STYLED COMPONENTS
const Container = styled.div`
    color: ${(props) => props.theme.textYeison};
    background: ${(props) => props.theme.bgSidebarYeison};
    position: sticky;
    padding-top: 20px;
    .Sidebarbutton {
        color: ${(props) => props.theme.text} !important;
        position: absolute;
        top: ${v.xxlSpacing};
        right: -18px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${(props) => props.theme.bgtgderecha};
        box-shadow: 0 0 4px ${(props) => props.theme.bg3},
        0 0 7px ${(props) => props.theme.bg};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
        border: none;
        letter-spacing: inherit;
        color: inherit;
        font-size: inherit;
        text-align: inherit;
        padding: 0;
        font-family: inherit;
        outline: none;
    }
    .Logocontent {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: ${v.lgSpacing};
        .imgcontent {
            display: flex;
            img {
                max-width: 100%;
                height: auto;
            }
            cursor: pointer;
            transition: all 0.3s;
            transform: ${({ isOpen }) => (isOpen ? `scale(0.7)` : `scale(1.5)`)};
        }
        h2 {
            display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
            font-size: 24px;
        }
    }
    .LinkContainer {
        margin: 8px 0;
        padding: 0 15%;
        :hover {
            background: ${(props) => props.theme.bg3};
        }
        .Links {
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: calc(${v.smSpacing}-2px) 0;
            color: ${(props) => props.theme.textYeison};
            height: 50px;
            .Linkicon {
                padding: ${v.smSpacing} ${v.mdSpacing};
                display: flex;
                svg {
                    font-size: 25px;
                }
            }
            &.active {
                .Linkicon {
                    svg {
                        color: ${(props) => props.theme.bg4};
                    }
                }
            }
        }
        button.Links {
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            padding: 0;
            cursor: pointer;
            &:hover {
                background: ${(props) => props.theme.bg3};
            }
        }
    }

        .LinkFactura {
        margin: 8px 0;
        padding: 0 15%;
        :hover {
            // background: ${(props) => props.theme.bg3};
        }
        .Links {
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: calc(${v.smSpacing}-2px) 0;
            color: ${(props) => props.theme.textYeison};
            height: 50px;
            .Linkicon {
                padding: ${v.smSpacing} ${v.mdSpacing};
                display: flex;
                svg {
                    font-size: 25px;
                }
            }
            &.active {
                .Linkicon {
                    svg {
                        color: ${(props) => props.theme.bg4};
                    }
                }
            }
        }
        button.Links {
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            padding: 0;
            cursor: pointer;
            &:hover {
                background: ${(props) => props.theme.bg3};
            }
        }
    }

    .Themecontent {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .titletheme {
            display: block;
            padding: 10px;
            font-weight: 700;
            opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
            transition: all 0.3s;
            white-space: nowrap;
            overflow: hidden;
        }
        .Togglecontent {
            margin: ${({ isOpen }) => (isOpen ? `auto 40px` : `auto 15px`)};
            width: 36px;
            height: 50px;
            border-radius: 10px;
            transition: all 0.3s;
            position: relative;
            .theme-container {
                background-blend-mode: multiply, multiply;
                transition: 0.4s;
                .grid {
                    display: grid;
                    justify-items: center;
                    align-content: center;
                    height: 100vh;
                    width: 100vw;
                    font-family: "Lato", sans-serif;
                }
                .demo {
                    background: ${(props) => props.theme.bgSidebarYeison} !important;
                    font-size: 32px;
                    .switch {
                        position: relative;
                        display: inline-block;
                        width: 60px;
                        height: 32px;
                        .theme-swither {
                            opacity: 0;
                            width: 0;
                            height: 0;
                            &:checked + .slider:before {
                                left: 4px;
                                content: "🌑";
                                transform: translateX(26px);
                            }
                        }
                        .slider {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: ${({ themeUse }) =>
        themeUse === "light" ? v.lightcheckbox : v.checkbox};
                            transition: 0.4s;
                            &::before {
                                position: absolute;
                                content: "☀️";
                                height: 0px;
                                width: 0px;
                                left: -10px;
                                top: 16px;
                                line-height: 0px;
                                transition: 0.4s;
                            }
                            &.round {
                                border-radius: 34px;
                                &::before {
                                    border-radius: 50%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const Divider = styled.div`
    height: 1px;
    width: 100%;
    background: ${(props) => props.theme.bg3};
    margin: ${v.lgSpacing} 0;
`;

const SubmenuContainer = styled.div`
    padding-left: 20px;
    transition: all 0.5s ease-in-out;
    
    .SubmenuLink {
        display: flex;
        align-items: center; /* Alinea ícono y texto en el centro */
        padding: 10px;
        color: ${(props) => props.theme.textYeison};
        text-decoration: none;
        font-size: 16px;

        svg {
            margin-right: 8px; 
            font-size: 20px;
        }
        
        &:hover {
            background: ${(props) => props.theme.bg3};
        }
    }

`;
