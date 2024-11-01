import React, { useEffect } from 'react';
import styled from 'styled-components';

export function BotonesRips({ onRelacionarClick }) {
    useEffect(() => {
        const btnRelacionar = document.getElementById('btnRelacionar');
        if (btnRelacionar) {
            btnRelacionar.addEventListener('click', onRelacionarClick);
        }

        // Cleanup the event listener on unmount
        return () => {
            if (btnRelacionar) {
                btnRelacionar.removeEventListener('click', onRelacionarClick);
            }
        };
    }, [onRelacionarClick]);

    return (
        <Container>
            <button id="btnRelacionar">RELACIONAR</button>
            <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#miModal"
            >
                ASIGNAR FACTURA MANUAL
            </button>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    text-align: center;
    align-content: center;
    margin-top: 10px;

    button {
        width: 250px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid ${({ theme }) => theme.bgAtencionGroup};
        background-color: #fff;
        color: ${({ theme }) => theme.bgAtencionGroup};
        transition: all 0.2s;
    }

    button:hover {
        background-color: ${({ theme }) => theme.bgAtencionGroup};
        border: 1px solid #fff;
        color: #fff;
    }
`;
