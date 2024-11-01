// src/components/Configuracion.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { servidor, port } from '../config/config';
import { useEmpresa } from '../config/EmpresaContext';
import Swal from 'sweetalert2';

export function Configuracion() {
    const [selectedImage, setSelectedImage] = useState(null);
    const { empresaSeleccionada } = useEmpresa();
    const [imageSrc, setImageSrc] = useState(null);


    const docEmpresa = empresaSeleccionada.documentoEmpresa;

    const handleImageUpload = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        // Crear un objeto FileReader para cargar la imagen seleccionada
        const reader = new FileReader();

        reader.onload = (event) => {
            // Crear un nuevo elemento de imagen
            const img = new Image();
            img.src = event.target.result;

            img.onload = async () => {
                // Crear un canvas y establecer las dimensiones 45x45
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = 48;
                canvas.height = 48;

                // Dibujar la imagen en el canvas redimensionándola a 45x45
                ctx.drawImage(img, 0, 0, 45, 45);

                // Convertir el contenido del canvas en un Blob (archivo de imagen)
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, selectedImage.name); // Nombre original de la imagen
                    formData.append('docEmpresa', docEmpresa); // Añadir el docEmpresa al FormData

                    try {
                        const response = await axios.put(`http://${servidor}:${port}/api/upload-image`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        Swal.fire({
                            icon: 'success',
                            title: 'Logo actualizado correctamente',
                            text: 'Su logo ha sido actualizado, recuerde que para visibilizar los cambios debería iniciar sesión nuevamente.',
                            confirmButtonColor: '#2c3e50'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetchImage();
                            }
                        });
                    } catch (err) {
                        console.error('Error al subir la imagen', err);
                    }
                }, 'image/png'); // Especificar el formato de salida (puede ser 'image/png' si lo prefieres)
            };
        };

        reader.readAsDataURL(selectedImage); // Cargar la imagen seleccionada como Data URL
    };

    const fetchImage = async () => {
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/get-image/${docEmpresa}`);
            const imageBase64 = response.data.image;
            if (imageBase64) {
                setImageSrc(`data:image/jpeg;base64,${imageBase64}`); // Prepara la imagen en formato base64
            }
        } catch (err) {
            console.error('Error al obtener la imagen', err);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [docEmpresa]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Configuración</h1>

            {/* Grid para las secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Sección 1: Logo aplicación */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Logo Aplicación</h2>
                    {imageSrc && <img src={imageSrc} alt="Logo Aplicación" className="w-16 h-16 object-cover mb-4" />}
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        disabled={!selectedImage}
                    >
                        Subir Imagen
                    </button>
                </div>

                {/* Sección 2: Logo Formatos */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Logo Formatos</h2>
                    {/* Aquí puedes añadir otra imagen o funcionalidad similar */}
                    <img src={imageSrc} alt="Logo Formatos" className="w-32 h-32 object-cover mb-4" />
                    <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
                        Acción Formatos
                    </button>
                </div>

                {/* Secciones 3 a 10 (Aleatorias) */}
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 3</h2>
                    <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">
                        Acción 3
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 4</h2>
                    <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300">
                        Acción 4
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 5</h2>
                    <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300">
                        Acción 5
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 6</h2>
                    <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                        Acción 6
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 7</h2>
                    <button className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-300">
                        Acción 7
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 8</h2>
                    <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition duration-300">
                        Acción 8
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 9</h2>
                    <button className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300">
                        Acción 9
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Sección 10</h2>
                    <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
                        Acción 10
                    </button>
                </div>
            </div>
        </div>
    );

}
