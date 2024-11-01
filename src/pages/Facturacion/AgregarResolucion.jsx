import styled from 'styled-components';
import TablaResoluciones from '../../components/Facturacion/Resolucion/TablaResoluciones';
import CrearResolucion from '../../components/Facturacion/Resolucion/CrearResolucion';
import { useRef } from 'react';

export function AgregarResolucion() {
    // Crear una referencia para acceder a la función fetchData
    const tablaResolucionesRef = useRef();

    const handleFetchData = () => {
        // Si la referencia existe, ejecuta fetchData
        if (tablaResolucionesRef.current) {
            tablaResolucionesRef.current.fetchData();
        }
    };

    return (
        <Container className='h-[100vh] p-4 overflow-y-auto'>
            {/* Pasamos handleFetchData como prop a CrearResolucion */}
            <CrearResolucion onInsert={handleFetchData} />
            {/* Le pasamos la referencia a TablaResoluciones */}
            <TablaResoluciones ref={tablaResolucionesRef} />
        </Container>
    );
}

const Container = styled.div`

`;
