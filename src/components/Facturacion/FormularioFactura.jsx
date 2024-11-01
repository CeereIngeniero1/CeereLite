// components/Facturacion/FormularioFactura.jsx
import React from 'react';
import { SelectFacturacion } from '../Facturacion/Select';
import { ModalPacientesCita } from '../Agenda/ModalPacientesCita';
import { servidor, port } from '../../config/config';

export function FormularioFactura({
    handleOpen,
    handleClose,
    isOpen,
    empresaSeleccionada,
    documentoResponsable,
    setDocumentoResponsable,
    idPacienteCita,
    resolucion,
    setResolucion,
    prefijo,
    numeroFactura,
    setFechaFactura,
    fechaFactura,
    setFechaVencimiento,
    fechaVencimiento,
    setSubcapitulo,
    agregarProducto,
    objetos,
    handleOptionSelect
}) {

    const handleChange = (event) => {
        setFechaFactura(event.target.value);
    };

    const handleVencimiento = (event) => {
        setFechaVencimiento(event.target.value)
    }

    const handleInputChange = (event) => {
        const value = event.target.value;
        // Lógica para decidir qué estado actualizar
        setDocumentoResponsable(value); // O setIdPacienteCita(value) según corresponda
    };



    return (
        <form className='text-black bg-[#e6e6e6] p-5 rounded-xl mb-6'>
            <div className="flex flex-wrap gap-4 2xl:mb-2 xl:mb-2">
                {/* Resolución */}
                <div className="flex flex-col w-full 2xl:w-[200px] xl:w-[150px]">
                    <label className="block text-sm mb-1">Resolución</label>
                    <SelectFacturacion
                        apiEndpoint={`http://${servidor}:${port}/api/facturacion/resolucion/${empresaSeleccionada.documentoEmpresa}`}
                        style="p-2 bg-[#e6e6e6] border border-gray-600 rounded 
                        2xl:w-[200px] 2xl:text-lg 2xl:h-[36px]
                        xl:w-[150px] xl:text-sm"
                        onValueChange={setResolucion}
                        defaultValue={resolucion}
                        showDefaultOption={false}
                    />
                </div>

                {/* Cliente */}
                <div className="flex flex-col w-full 2xl:w-[320px] xl:w-[220px]">
                    <div className="grid items-center space-x-2">
                        <label className="block text-sm mb-1 ml-3">Cliente *</label>
                        <div className="flex gap-1">
                            <input
                                type="text"
                                placeholder="Seleccione un cliente"
                                value={documentoResponsable || idPacienteCita}
                                readOnly
                                className="p-2 bg-[#e6e6e6] border border-gray-600 rounded 
                                2xl:w-[200px] 2xl:text-lg 
                                xl:w-[110px] xl:text-sm xl:p-1 xl:h-[36px]"
                            />
                            <button
                                type="button"
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                                2xl:w-[120px] 2xl:text-md 
                                xl:w-[100px] xl:h-[36px] xl:text-sm"
                                onClick={handleOpen}
                            >
                                🔍 Buscar
                            </button>
                        </div>
                    </div>
                    <ModalPacientesCita isOpen={isOpen} onClose={handleClose} />
                </div>

                {/* Nro Factura */}
                <div className="flex flex-col">
                    <label className="block text-sm mb-1">Nro Factura</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={prefijo}
                            readOnly
                            className="w-[70px] p-2 bg-[#e6e6e6] border border-gray-600 rounded
                                2xl:w-[90px] 2xl:text-lg 
                                xl:w-[70px] xl:text-sm xl:p-1 xl:h-[36px]"
                        />
                        <input
                            type="text"
                            value={numeroFactura}
                            readOnly
                            className="w-[80px] p-2 bg-[#e6e6e6] border border-gray-600 rounded
                                2xl:w-[90px] 2xl:text-lg 
                                xl:w-[70px] xl:text-sm xl:p-1 xl:h-[36px]"
                        />
                    </div>
                </div>

                {/* Fecha */}
                <div className="flex flex-col w-full xl:w-[150px] 2xl:w-[200px]">
                    <label className="block text-sm mb-1">Fecha de la factura</label>
                    <input
                        type="date"
                        className="w-full p-2 bg-[#e6e6e6] border border-gray-600 rounded
                        2xl:w-[200px] 2xl:text-lg 2xl:h-[36px]
                        xl:w-[150px] xl:text-sm xl:h-[36px]"
                        value={fechaFactura}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col xl:w-[200px] 2xl:w-[200px]">
                    <label className="block text-sm mb-1">Fecha vencimiento factura</label>
                    <input
                        type="date"
                        className="w-full p-2 bg-[#e6e6e6] border border-gray-600 rounded 
                        2xl:w-[200px] 2xl:text-lg 2xl:h-[36px]
                        xl:w-[150px] xl:text-sm xl:h-[36px]"
                        value={fechaVencimiento}
                        onChange={handleVencimiento}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                    <label className="block text-sm mb-1">Subcapítulo</label>
                    <SelectFacturacion
                        apiEndpoint={`http://${servidor}:${port}/api/facturacion/subcapitulo`}
                        style="w-full p-2 bg-[#e6e6e6] border border-gray-600 rounded"
                        onValueChange={setSubcapitulo}
                        showDefaultOption={true}
                    />
                    <label className="block text-sm mb-1">Producto *</label>
                    <SelectFacturacion
                        style="w-full p-2 bg-[#e6e6e6] border border-gray-600 rounded"
                        onOptionSelect={handleOptionSelect}
                        options={objetos}
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="button"
                        className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        onClick={agregarProducto}
                    >
                        Agregar nuevo producto
                    </button>
                </div>
            </div>
        </form>

    );
}
