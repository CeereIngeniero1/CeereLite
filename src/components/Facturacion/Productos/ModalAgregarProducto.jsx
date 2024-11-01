import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import SelectSubcapitulos from './Select';
import { servidor, port } from "../../../config/config";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEmpresa } from '../../../config/EmpresaContext'

export default function ModalAgregar({ actualizarTabla }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const size = 'lg';

    // CONST INFORMACION

    const { empresaSeleccionada } = useEmpresa();
    const [subcapitulo, setSubcapitulo] = useState([]);
    const [nombreProducto, setNombreProducto] = useState('');
    const [codigoProducto, setCodigoProducto] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [tipoTarifa, setTipoTarifa] = useState([]);

    

    const CrearProducto = async () => {
        // Validaciones de campos vacíos
        if (!subcapitulo || !nombreProducto || !codigoProducto || !precioVenta || !tipoTarifa) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos antes de continuar.',
                confirmButtonColor: '#2c3e50'
            });
            return;
        }

        try {
            // Llamada a la nueva API que inserta producto y tarifas en una sola transacción
            const response = await axios.post(`http://${servidor}:${port}/api/productos/insertarProductoYTarifa`, {
                subcapitulo: subcapitulo,
                nombreProducto: nombreProducto,
                codigoProducto: codigoProducto,
                precioVenta: precioVenta,
                tipoTarifa: tipoTarifa,
                docEmpresa: empresaSeleccionada.documentoEmpresa
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto y tarifas creados',
                    text: 'El producto ha sido creado exitosamente.',
                    confirmButtonColor: '#2c3e50'
                }).then((result) => {
                    if (result.isConfirmed) {
                        onClose();
                        actualizarTabla();
                    }
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al crear el producto o las tarifas. Inténtelo nuevamente.',
                confirmButtonColor: '#2c3e50'
            });

            console.error('Error al crear el producto o tarifas:', error);
        }
    };

    return (
        <>
            <Button color="primary" onPress={onOpen}>Agregar producto</Button>
            <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">Agregar producto</ModalHeader>
                        <ModalBody className="border-b border-gray-200">
                            <SelectSubcapitulos
                                apiEndpoint={`http://${servidor}:${port}/api/productos/subcapitulo`}
                                placeholder={'Seleccionar subcapítulo'}
                                label={'Subcapitulos'}
                                onValueChange={setSubcapitulo}
                            />

                            <Input
                                type="text"
                                label="Nombre Producto"
                                placeholder="Ingresar nombre producto"
                                onChange={(event) => setNombreProducto(event.target.value)}
                            />

                            <Input
                                type="text"
                                label="Código"
                                placeholder="Ingresar código producto"
                                onChange={(event) => setCodigoProducto(event.target.value)}
                            />

                            <SelectSubcapitulos
                                apiEndpoint={`http://${servidor}:${port}/api/productos/tipoTarifa`}
                                placeholder={'Seleccionar un tipo de tarifa'}
                                label={'Tipo de tarifa'}
                                onValueChange={setTipoTarifa}
                            />

                            <Input
                                type="text"
                                label="Precio"
                                placeholder="Ingresar precio del producto"
                                onChange={(event) => setPrecioVenta(event.target.value)}
                            />

                        </ModalBody>
                        <ModalFooter className="m-0">
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                            {/* Pasamos onClose a CrearProducto para que cierre el modal después de la confirmación */}
                            <Button color="primary" onPress={CrearProducto}>
                                Guardar
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}
