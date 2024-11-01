import styled from 'styled-components';
import { react, useState } from "react";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "../Usuarios/PlusIcon";


export function BtnAsignarCita(props) {
    return (
        <Container>
            <Button
                color="primary"
                variant="solid"
                onPress={props.onPress}
                startContent={<PlusIcon />}
            >
                Agendar Cita
            </Button>
        </Container>
    );
}

const Container = styled.div`
    margin-bottom: 5px;

    button {
        width: 200px;
        font-size: 15px;
    }
`;