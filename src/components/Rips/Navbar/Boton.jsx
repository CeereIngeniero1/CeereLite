import styled from 'styled-components';
import { Button } from "@nextui-org/react";


export function BotonesModals({ nombreBoton, onPress }) {

    return (
        <Container>
            <button 
            type="button" 
            id="descargarRIPS"
            onClick={onPress}>

                {nombreBoton}
            </button>
        </Container>
    );
}

const Container = styled.div`
    #descargarRIPS {
        width: 280px;
        height: 40px;
        border: 1px solid #fff;
        color: #fff;
        background-color: ${({ theme }) => theme.bgAtencionGroup};
        border-radius: 8px;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        transition: all 0.4s;
    }

    #descargarRIPS:hover {
        background-color: transparent;
        color: ${({ theme }) => theme.bgAtencionGroup};
        border: 1px solid ${({ theme }) => theme.bgAtencionGroup};
    }
        
`;