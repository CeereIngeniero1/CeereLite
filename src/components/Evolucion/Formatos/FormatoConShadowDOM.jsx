import React, { useEffect, useRef, forwardRef } from 'react';
import DBLogo from 'C:\\CeereSio\\Formatos HC\\DB.png';


// Componente con forwardRef para permitir pasar el ref desde el padre
const FormatoConShadowDOM = forwardRef(({ htmlContent }, ref) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Verifica si el shadowRoot ya existe, si no, lo crea
            const shadowRoot = containerRef.current.shadowRoot || containerRef.current.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = '';

            // Reemplaza la ruta local de la imagen con la ruta importada
            const htmlContentWithLogo = htmlContent.replace('C:\\CeereSio\\Formatos HC\\DB.png', DBLogo);

            // Crea un div wrapper que contendrá el contenido HTML con la ruta corregida
            const wrapper = document.createElement('div');
            wrapper.innerHTML = htmlContentWithLogo;
            shadowRoot.appendChild(wrapper);

            // Asigna el shadowRoot al ref si este fue pasado correctamente
            if (ref) {
                ref.current = shadowRoot;
            }
        }
    }, [htmlContent, ref]);

    return <div ref={containerRef}></div>;
});

FormatoConShadowDOM.displayName = "FormatoConShadowDOM";

export default FormatoConShadowDOM;