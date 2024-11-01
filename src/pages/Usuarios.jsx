import { TablaUsuarios } from "../components/Usuarios/TablaUsuarios";
import styled from 'styled-components';

const ContenedorPrincipal = styled.div`
    /* Aquí puedes agregar los estilos necesarios */
    padding: 20px;
    /* background-color: #f5f5f5; */
    /* Otros estilos personalizados */
    height: 100vh;
    background: ${({ theme }) => theme.bgtotal};
`;

const Container = styled.div`
    /* Estilos para el Container */
    /* max-width: 1200px; */
    margin: 0 auto;
    padding: 20px;
    background: ${({ theme }) => theme.bgtotal};
`;

export function Usuarios() {
    return (
        <ContenedorPrincipal >
            <Container >
                <TablaUsuarios />
            </Container>
        </ContenedorPrincipal>
    );
}