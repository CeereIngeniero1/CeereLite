import { useNavigate } from 'react-router-dom';
import SweetAlert2 from 'sweetalert2';
import styled from "styled-components";
import { reset } from '../../utils/footerLogic';
import { usePaciente } from '../../config/PacienteContext'
import { useGlobalContext } from '../../config/GlobalContext';


const Header = ({ resetAndLoad, insertarEvaluacionEntidad, handlePrint, insertarEvaluacionFormatos, datosFormato, formatoSeleccionado, handlePruebaDeFormatosClick }) => {
    const navigate = useNavigate();
    const { setDocumentoPaciente } = usePaciente(); // Acceder a setDocumentoPaciente desde el contexto
    const { resetComponents } = useGlobalContext();

    const newHistoria = async () => {
        try {
            await resetAndLoad();
            resetComponents();
        } catch (error) {
            SweetAlert2.fire('Error', error.message, 'error');
        }
    };

    const handleLogout = () => {
        setDocumentoPaciente(''); // Actualizar documentoPaciente a una cadena vacía
        navigate('/');
    };

    const handleGuardarFormato = () => {
        if (datosFormato && formatoSeleccionado) {
            insertarEvaluacionFormatos(datosFormato, formatoSeleccionado);
        } else {
            console.error("No hay datos para guardar.");
        }
    };
    return (
        <StyledHeader>
            <button id="toggleSidebar">☰</button>
            <h2 id="nombrePacienteNavbar"></h2>
            <button onClick={newHistoria}>Nueva Historia</button>
            <button onClick={handlePrint}>Imprimir</button> 
            <button id="guardarHistoria" onClick={insertarEvaluacionEntidad}>Guardar</button>
            <button id="guardarFormato" onClick={handlePruebaDeFormatosClick}>Guardar Formato</button>
            <button onClick={handleLogout}>Salir</button>
        </StyledHeader>
    );
};

export default Header;

const StyledHeader = styled.header`
    width: 100%;
    background: ${({ theme }) => theme.bgSidebarYeison}; /* Ajusta el color de fondo según el tema */
    color: #ecf0f1;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    #toggleSidebar {
        font-size: 20px;
        background: none;
        border: none;
        color: #ecf0f1;
        cursor: pointer;
    }

    h2 {
        font-size: 15px;
        font-weight: bold;
    }

    button {
        background: ${({ theme }) => theme.bgAtencionGroup}; /* Ajusta el color de fondo según el tema */
        color: #fff;
        border: none;
        padding: 5px 15px;
        margin-left: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
        
        &:hover {
        background: #71717A;
        }
    }

    @media (min-width: 1400px) {
        height: 80px;

        #toggleSidebar {
            width: 80px;
            font-size: 30px;
            color: #ecf0f1;
        }

        h2 {
            font-size: 20px;
            font-weight: bold;
        }

        button {
            padding: 10px 10px;
            width: 150px;
            font-size: 15px;
        }
    }
`;
