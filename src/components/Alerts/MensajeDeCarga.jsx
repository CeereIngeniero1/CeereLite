import Swal from 'sweetalert2';
import React from 'react';

export const MensajeDeCarga = (MensajeAlCargar) => {
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        showConfirmButton: true,
        html:
            `
    <style>
        @media (max-width: 480px) {
            .swal2-container {
                width: 100%;
            }
            .swal2-content {
                overflow-x: hidden;
            }
        }
        :root {
            --point-color: #000;
            --size: 5px;
            }
            
            .loader {
            background-color: var(--main-color);
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;  
            z-index: 100000;
            }
            
            .loader__element {
            border-radius: 100%;
            border: var(--size) solid var(--point-color);
            margin: calc(var(--size)*2);
            }
            
            .loader__element:nth-child(1) {
            animation: preloader .6s ease-in-out alternate infinite;
            }
            .loader__element:nth-child(2) {
            animation: preloader .6s ease-in-out alternate .2s infinite;
            }
            
            .loader__element:nth-child(3) {
            animation: preloader .6s ease-in-out alternate .4s infinite;
            }
            
            @keyframes preloader {
            100% { transform: scale(2); }
            }
        </style>

        <body> 
            <div style="margin: 0 auto;">
            <h5 style="color: #000">${MensajeAlCargar}</h5>
            <div class="loader">         
                <span class="loader__element"></span>
                <span class="loader__element"></span>
                <span class="loader__element"></span>                    
            </div>
            </div>
        </body>
    `,
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();

            if (confirmButton) confirmButton.style.display = 'none';
            if (cancelButton) cancelButton.style.display = 'none';
        }
    });
};
