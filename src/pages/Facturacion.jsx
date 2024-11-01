// Facturacion.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FormularioFactura } from '../components/Facturacion/FormularioFactura';
import { ProductoItem } from '../components/Facturacion/ProductoItem';
import { ResumenFactura } from '../components/Facturacion/ResumenFactura';
import { servidor, port } from '../config/config';
import { useEmpresa } from '../config/EmpresaContext';
import { useIdPacienteCita } from '../config/IdPacienteCitasContext';
import { useUsuario } from "../config/UsuarioContext";
import { FacturaImprimible } from "../utils/PrintFactura";
import { useReactToPrint } from 'react-to-print';
import { Input, Button } from "@nextui-org/react";
import './Facturacion/Facturacion.css'



import axios from 'axios';
import Swal from 'sweetalert2';


export function Facturacion() {

    const componenteImprimirRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componenteImprimirRef.current,
    });

    const { empresaSeleccionada } = useEmpresa();
    const { documentoEntidad, nombreUsuario } = useUsuario();
    const { idPacienteCita, setIdPacienteCita } = useIdPacienteCita();
    const [resolucion, setResolucion] = useState("");
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [prefijo, setPrefijo] = useState("");
    const [numeroFactura, setNumeroFactura] = useState("");
    const [documentoResponsable, setDocumentoResponsable] = useState("");


    const [subcapitulo, setSubcapitulo] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [observaciones, setObservaciones] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [impuesto, setImpuesto] = useState(0);
    const [total, setTotal] = useState(0);

    // BUSCAR FACTURA


    //FECHAS
    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];  // Devuelve 'YYYY-MM-DD'
    };

    // Estados para las fechas de factura y vencimiento
    const [fechaFactura, setFechaFactura] = useState(getTodayDate());
    const [fechaVencimiento, setFechaVencimiento] = useState(getTodayDate());

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    // Cálculo de subtotal, impuestos y total
    useEffect(() => {
        const nuevoSubtotal = productos.reduce(
            (acc, producto) => acc + producto.cantidad * producto.precio,
            0
        );
        setSubtotal(nuevoSubtotal);
        setTotal(nuevoSubtotal - descuento + (nuevoSubtotal * impuesto) / 100);
    }, [productos, descuento, impuesto]);


    const agregarProducto = () => {
        if (selectedProduct) {
            // Verifica si el producto seleccionado está en la lista de objetos disponibles
            const productoEncontrado = objetos.find(obj => obj.value === selectedProduct);

            if (productoEncontrado) {
                // Agregar el producto con nombre seleccionado y precio correspondiente
                setProductos(prevProductos => {
                    const nuevosProductos = [
                        ...prevProductos,
                        { nombre: productoEncontrado.text, codigo: productoEncontrado.value, cantidad: 1, precio: productoEncontrado.precio || 0 } // Usar el precio del producto o un valor por defecto
                    ];

                    // Imprime todos los productos actuales en el log
                    console.log("Lista de productos agregados:");
                    nuevosProductos.forEach((producto, index) => {
                        console.log(`Producto ${index + 1}: Nombre - ${producto.nombre}, Cantidad - ${producto.cantidad}, Precio - ${producto.precio}`);
                    });

                    return nuevosProductos;
                });
            } else {
                console.error("El producto seleccionado no es válido o no está disponible en el listado.");
            }
        } else {
            console.error("No se ha seleccionado ningún producto.");
        }
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
    };

    const actualizarCantidad = (index, nuevaCantidad) => {
        const cantidadActualizada = parseInt(nuevaCantidad, 10) || 1;  // Asegúrate de que sea un número válido

        // Actualizar el array de productos con la nueva cantidad
        const nuevosProductos = productos.map((producto, i) => {
            if (i === index) {
                return { ...producto, cantidad: cantidadActualizada };  // Actualiza la cantidad del producto
            }
            return producto;
        });

        setProductos(nuevosProductos);  // Actualiza el estado con los nuevos productos
    };


    const handleOptionSelect = (option) => {
        // console.log("Valor seleccionado:", option.value);
        // console.log("Texto seleccionado:", option.text);
        // console.log("precio:", option.precio);
        setSelectedProduct(option.value);

    };

    // Obtener el prefijo y número de factura desde el servidor
    useEffect(() => {
        const obtenerPrefijoYFactura = async () => {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/facturacion/prefijoyfactura/${empresaSeleccionada.documentoEmpresa}`);

                if (response.data.length > 0) {
                    const { prefijo, consecutivo } = response.data[0];
                    setPrefijo(prefijo);

                    // Mantén el consecutivo como una cadena de texto para conservar los ceros a la izquierda
                    const nuevoNumeroFactura = (parseInt(consecutivo, 10) + 1).toString();

                    // Si es necesario, agrega ceros al nuevo número de factura
                    setNumeroFactura(nuevoNumeroFactura.padStart(consecutivo.length, '0'));
                }
            } catch (error) {
                console.error("Error al obtener el prefijo y número de factura:", error);
            }
        };

        if (empresaSeleccionada) {
            obtenerPrefijoYFactura();
        }
    }, [empresaSeleccionada]);


    useEffect(() => {
        const fetchObjetos = async () => {
            if (subcapitulo) {
                try {
                    const response = await axios.get(`http://${servidor}:${port}/api/facturacion/objeto/${subcapitulo}`);
                    // console.log(`El id subcapitulo enviado es: ${subcapitulo}`)
                    setObjetos(response.data);
                } catch (error) {
                    console.error('Error al obtener los objetos:', error);
                }
            }
        };

        fetchObjetos();
    }, [subcapitulo]);

    useEffect(() => {
        const calcularSubtotal = () => {
            const suma = productos.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);
            setSubtotal(suma);
            calcularTotal(suma);
        };

        calcularSubtotal();
    }, [productos]);

    const calcularTotal = (subtotal) => {
        const totalConImpuesto = subtotal + (subtotal * impuesto / 100) - descuento;
        setTotal(totalConImpuesto);
    };

    // console.log(`Empresa seleccionada en facturacion: ${empresaSeleccionada.documentoEmpresa}`)
    // console.log(`Resolucion seleccionada en facturacion: ${resolucion}`)
    // console.log(`El número de factura seleccionada en facturacion: ${numeroFactura}`)
    // console.log(`la fecha de la factura en facturacion es: ${fechaFactura}`)
    // console.log(`la fecha de venicimiento en facturacion es: ${fechaVencimiento}`)
    // console.log(`El documento paciente en facturacion es: ${idPacienteCita}`)
    // console.log(`Observaciones en facturacion es: ${observaciones}`)
    // console.log(`El subtotal facturacion es: ${subtotal}`)
    // console.log(`El total facturacion es: ${total}`)
    // console.log(`El documento usuario facturacion es: ${documentoEntidad}`)

    const navigate = useNavigate();

    const reiniciarComponente = () => {
        setIdPacienteCita('')
        navigate('/');

    };

    const InsertarFactura = async () => {
        // Validaciones
        if (!empresaSeleccionada?.documentoEmpresa) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encuentra una empresa activa!',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!resolucion || isNaN(resolucion)) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe proporcionar un número de resolución válido.',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!numeroFactura || isNaN(numeroFactura)) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe proporcionar un número de factura válido.',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!fechaFactura) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe seleccionar una fecha de factura.',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!fechaVencimiento) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe seleccionar una fecha de vencimiento.',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!idPacienteCita) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe seleccionar un paciente.',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!subtotal || subtotal <= 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El subtotal debe ser mayor que cero.',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!total || total < subtotal) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El total debe ser mayor o igual que el subtotal.',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!documentoEntidad) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe proporcionar el documento de la entidad.',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        if (!productos || productos.length === 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe agregar al menos un producto a la factura.',
                showConfirmButton: 'OK',
                confirmButtonColor: '#2c3e50'
            });
        }

        // Mostrar un mensaje de confirmación antes de enviar los datos
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas proceder realizar de la factura?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, insertar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',  // Verde para el botón de confirmar
            cancelButtonColor: '#dc3545',   // Rojo para el botón de cancelar
        });

        if (!confirmacion.isConfirmed) {
            return;  // Si el usuario cancela, no se hace el insert
        }

        // Mostrar un mensaje de carga mientras se realiza la inserción
        Swal.fire({
            title: 'Insertando factura...',
            text: 'Por favor, espere.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Intentar la inserción de la factura
        try {
            const response = await axios.post(`http://${servidor}:${port}/api/facturacion/insertarFactura`, {
                docEmpresa: empresaSeleccionada.documentoEmpresa,
                resolucion: resolucion,
                numeroFactura: numeroFactura,
                fechaFactura: fechaFactura,
                fechaVencimiento: fechaVencimiento,
                docPaciente: idPacienteCita,
                observaciones: observaciones,
                subtotal: subtotal,
                total: total,
                docUsuario: documentoEntidad,
                productos: productos  // Enviamos el array de productos
            });

            // Si la inserción es exitosa
            Swal.fire({
                icon: 'success',
                title: 'Factura insertada',
                text: 'La factura ha sido insertada exitosamente.',
                confirmButtonColor: '#2c3e50'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Factura insertada exitosamente", response.data);
                    reiniciarComponente();
                }
            });

        } catch (error) {
            // Si hay un error en la inserción
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al insertar la factura. Inténtelo nuevamente.',
                confirmButtonColor: '#2c3e50'
            });

            console.error('Error al insertar la factura:', error);
        }
    };

    const convertirAFechaInput = (fechaISO) => {
        const fecha = new Date(fechaISO);
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;  // Retorna en formato YYYY-MM-DD
    };

    const buscarFacturaEnter = async (e) => {
        if (e.key === 'Enter') {
            try {
                // Realiza la solicitud al backend para buscar la factura
                const response = await axios.get(`http://${servidor}:${port}/api/facturacion/buscarFactura`, {
                    params: {
                        prefijo: prefijo,
                        numeroFactura: numeroFactura
                    }
                });

                if (response.data) {
                    const factura = response.data;

                    // Convertimos las fechas usando la función
                    const fechaFacturaFormateada = convertirAFechaInput(factura["Fecha Factura"]);
                    const fechaVencimientoFormateada = convertirAFechaInput(factura["Fecha Vencimiento Factura"]);

                    // Imprimimos las fechas en la consola
                    console.log("Fecha de la factura:", fechaFacturaFormateada);
                    console.log("Fecha de vencimiento:", fechaVencimientoFormateada);

                    setPrefijo(factura.prefijo);
                    setNumeroFactura(factura["No Factura"]);
                    setDocumentoResponsable(factura["Documento Responsable"]);
                    setFechaFactura(fechaFacturaFormateada);
                    setFechaVencimiento(fechaVencimientoFormateada);
                    setObservaciones(factura["Observaciones Factura"])
                    setSubtotal(factura["SubTotal Factura"]);
                    setTotal(factura["Total Factura"]);

                    // Nueva consulta para obtener los items de la factura
                    const itemsResponse = await axios.get(`http://${servidor}:${port}/api/facturacion/buscarFacturaItems`, {
                        params: {
                            idFactura: factura["Id Factura"]
                        }
                    });

                    // Mapear los items obtenidos
                    const productos = itemsResponse.data.map(item => ({
                        nombre: item["Descripción Objeto"],
                        codigo: item["Código Objeto"],
                        cantidad: item["Cantidad FacturaII"],
                        precio: item["Valor FacturaII"]
                    }));

                    setProductos(productos);  // Guardar los productos en el estado
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo encontrar la factura. Verifique el número e intente de nuevo.',
                    confirmButtonColor: '#2c3e50'

                });
                console.error('Error al buscar la factura:', error);
            }
        }
    };

    // Función para actualizar el precio de un producto
    const actualizarPrecio = (index, nuevoPrecio) => {
        const precioActualizado = parseFloat(nuevoPrecio) || 0; // Asegura que sea un número
        const nuevosProductos = productos.map((producto, i) => {
            if (i === index) {
                return { ...producto, precio: precioActualizado };  // Actualiza el precio del producto
            }
            return producto;
        });
        setProductos(nuevosProductos);  // Actualiza el estado de productos
    };



    return (
        <div className="p-6 min-h-screen bg-[rgb(247,245,245)] text-[#cccc] overflow-y-auto grid">
            <h1 className="text-2xl text-left font-bold mb-4 text-black">Generar Factura</h1>
    
            <div className="flex flex-col lg:flex-row h-auto bg-[#e6e6e6] mb-4 rounded-xl p-2 gap-2">
                <button onClick={handlePrint} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg p-2.5 w-full lg:w-[100px] mb-4 h-[40px]">Imprimir</button>
                <Input
                    type="text"
                    label="Buscar Facutra"
                    id="numeroFactura"
                    name="numeroFactura"
                    placeholder="Ingrese la factura"
                    className="text-black w-full lg:w-[200px]"
                    onChange={(e) => setNumeroFactura(e.target.value)}
                    value={numeroFactura}
                    onKeyDown={buscarFacturaEnter}
                />
            </div>
    
            <FormularioFactura
                handleOpen={handleOpen}
                handleClose={handleClose}
                isOpen={isOpen}
                empresaSeleccionada={empresaSeleccionada}
                documentoResponsable={documentoResponsable}
                setDocumentoResponsable={setDocumentoResponsable}
                idPacienteCita={idPacienteCita}
                resolucion={resolucion}
                setResolucion={setResolucion}
                prefijo={prefijo}
                numeroFactura={numeroFactura}
                setFechaFactura={setFechaFactura}
                fechaFactura={fechaFactura}
                setFechaVencimiento={setFechaVencimiento}
                fechaVencimiento={fechaVencimiento}
                setSubcapitulo={setSubcapitulo}
                agregarProducto={agregarProducto}
                objetos={objetos}
                handleOptionSelect={handleOptionSelect}
            />
    
            <div className="w-full mb-4">
                <div className="w-full flex flex-col lg:flex-row h-auto bg-[#e6e6e6] p-[10px] border-b border-gray-500 rounded-xl text-black">
                    <div className="w-full lg:w-[35%] text-center">
                        <span>Productos</span>
                    </div>
                    <div className="w-full lg:w-[15%] text-center">
                        <span>Código producto</span>
                    </div>
                    <div className="w-full lg:w-[15%] text-center">
                        <span>Cantidad</span>
                    </div>
                    <div className="w-full lg:w-[15%] text-center">
                        <span>Precio unitario</span>
                    </div>
                    <div className="w-full lg:w-[15%] text-center">
                        <span>Total</span>
                    </div>
                    <div className="w-full lg:w-[15%] text-center">
                        <span>Acción</span>
                    </div>
                </div>
                {productos.length > 0 ? (
                    productos.map((producto, index) => (
                        <ProductoItem
                            key={index}
                            producto={producto}
                            index={index}
                            actualizarCantidad={actualizarCantidad}
                            eliminarProducto={eliminarProducto}
                            esUltimo={index === productos.length - 1}
                            actualizarPrecio={actualizarPrecio}
                        />
                    ))
                ) : (
                    <p className="text-gray-400">No hay productos agregados.</p>
                )}
            </div>
    
            <ResumenFactura
                observaciones={observaciones}
                setObservaciones={setObservaciones}
                subtotal={subtotal}
                descuento={descuento}
                total={total}
                impuesto={impuesto}
            />
    
            <div style={{ display: 'none' }}>
                <FacturaImprimible
                    ref={componenteImprimirRef}
                    empresaSeleccionada={empresaSeleccionada}
                    numeroFactura={numeroFactura}
                    fechaFactura={fechaFactura}
                    fechaVencimiento={fechaVencimiento}
                    productos={productos}
                    subtotal={subtotal}
                    total={total}
                    observaciones={observaciones}
                />
            </div>
    
            <Button type="button" onClick={InsertarFactura} color="success" className="text-white">
                GUARDAR FACTURA
            </Button>
        </div>
    );
    
}
