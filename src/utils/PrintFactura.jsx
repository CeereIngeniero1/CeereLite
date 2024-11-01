import React, { useState, useEffect } from 'react';
import logo from '../assets/logo_ceere.png'
import axios from 'axios';
import { servidor, port } from '../config/config';
// Componente de factura para impresión
export const FacturaImprimible = React.forwardRef(({ empresaSeleccionada, numeroFactura, fechaFactura, fechaVencimiento, productos, subtotal, total, observaciones }, ref) => {

    const [datosEmpresa, setDatosEmpresa] = useState({
        nombre: '',
        identificacion: '',
        direccion: '',
        telefono: '',
        correo: '',
    });

    useEffect(() => {
        const infoEmpresa = async () => {
            try {
                const response = await axios.get(`http://${servidor}:${port}/api/empresa`, {
                    params: {
                        docEmpresa: empresaSeleccionada?.documentoEmpresa
                    }
                });

                if (response.data.length > 0) {
                    setDatosEmpresa(response.data[0]);
                    console.log('La empresa seleccionada es', datosEmpresa['Nombre Empresa']);
                }
            } catch (error) {
                console.error("Error al obtener la información de la empresa:", error);
            }
        };

        infoEmpresa();
    }, [servidor, port, empresaSeleccionada]);

    return (
        <div ref={ref} className="p-8 bg-white text-gray-900">
            {/* Encabezado de la factura */}
            <div className="flex justify-between items-center mb-8">
                {/* Primer div en la izquierda */}
                <div className="w-1/3">
                    <h1 className="text-3xl font-bold">Factura</h1>
                    <p className="text-sm text-gray-600">Número de factura: {numeroFactura}</p>
                    <p className="text-sm text-gray-600">Fecha: {fechaFactura}</p>
                    <p className="text-sm text-gray-600">Fecha de vencimiento: {fechaVencimiento}</p>
                </div>

                {/* Logo en el centro */}
                <div className="w-1/3 flex justify-center">
                    <img src={logo} alt="Logo" className="max-h-32" />
                </div>

                {/* Tercer div en la derecha */}
                <div className="w-1/3 text-right">
                    <h2 className="text-2xl font-semibold">{datosEmpresa['Nombre Empresa']}</h2>
                    <p className="text-sm text-gray-600">{datosEmpresa['Direccion Empresa']}</p>
                    <p className="text-sm text-gray-600">{datosEmpresa['Telefono Empresa']}</p>
                    <p className="text-sm text-gray-600">{datosEmpresa['Correo Empresa']}</p>
                </div>
            </div>



            {/* Tabla de productos */}
            <table className="min-w-full bg-white border border-gray-200 mb-8">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider text-gray-600">
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4 text-center">Cantidad</th>
                        <th className="py-3 px-4 text-right">Precio Unitario</th>
                        <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-3 px-4">{producto.nombre}</td>
                            <td className="py-3 px-4">{producto.codigo}</td>
                            <td className="py-3 px-4 text-center">{producto.cantidad}</td>
                            <td className="py-3 px-4 text-right">${producto.precio.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">${(producto.cantidad * producto.precio).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end mb-6">
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between border-t border-gray-200 py-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 py-2">
                        <span className="text-gray-600">Impuesto:</span>
                        <span className="font-semibold">${((subtotal * 0.19)).toFixed(2)}</span> {/* Asumimos un impuesto del 19% */}
                    </div>
                    <div className="flex justify-between border-t border-gray-200 py-2">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-xl">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg">Observaciones</h3>
                <p className="text-gray-600">{observaciones || "Ninguna"}</p>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                    Gracias por su compra. Si tiene alguna pregunta sobre esta factura, contáctenos a <strong>soporte@empresa.com</strong>.
                </p>
            </div>
        </div>
    );
});


FacturaImprimible.displayName = "FacturaImprimible";
