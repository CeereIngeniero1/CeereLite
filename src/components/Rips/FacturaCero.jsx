import React from 'react';
import styled from 'styled-components';

export function FacturaCero({ onCheckboxChange }) {
    return (
        <Container>
            <input type="checkbox" id="checkboxFacturaCero" onChange={onCheckboxChange} />
            <span>Relacionar historia con factura en 0 a RIPS</span>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    display: flex;
    text-align: center;
    align-content: center;
    font-size: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 40px;

    input {
        width: 30px;
        height: 30px;
    }
    
    span {
        margin-left: 10px;
    }
`;
