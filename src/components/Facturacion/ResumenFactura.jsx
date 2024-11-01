// components/Facturacion/ResumenFactura.jsx
import React from 'react';

export function ResumenFactura({ subtotal, descuento, total, impuesto, setObservaciones, observaciones }) {

    const HandleChange = (event) => {
        setObservaciones(event.target.value)
    }
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm mb-1 text-black">Observaciones factura:</label>
                    <textarea
                        className="w-full p-2 bg-[#e6e6e6] border border-gray-600 rounded text-black"
                        rows="4"
                        value={observaciones}
                        onChange={HandleChange}
                    />
                </div>
            </div>
            <div className="mt-6 bg-[#e6e6e6] p-4 text-black rounded-xl">
                <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span>COP {subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Descuento:</span>
                    <span>COP {descuento.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Total:</span>
                    <span>COP {total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Impuesto:</span>
                    <span>{impuesto}%</span>
                </div>
            </div>
        </>
    );

}
