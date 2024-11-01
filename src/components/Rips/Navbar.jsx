import React from "react";
import styled from "styled-components";
// import { BotonesModals } from "./Navbar/Boton";
import { ModalJSON } from "./Modal JSON/ModalJSON";
import { ModalXML } from "./Modal XML/ModalXML";

const Navbar = () => {
    return (
        <NavBarContainer>
            <ModalJSON />
            <ModalXML />
        </NavBarContainer>
    );
};

export default Navbar;

const NavBarContainer = styled.div`
    width: 100%;
    margin-bottom: 20px;
    display: flex !important;
`
