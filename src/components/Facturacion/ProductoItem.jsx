export function ProductoItem({ producto, index, actualizarCantidad, actualizarPrecio, eliminarProducto, esUltimo }) {
    return (
        <div className={`w-full text-black flex items-center bg-[#e6e6e6] p-4 rounded ${!esUltimo ? 'border-b border-gray-500' : ''}`}>
            <div className='w-full lg:w-[35%] text-center'>
                <span className="text-lg">{producto.nombre}</span>
            </div>
            <div className='w-full lg:w-[15%] text-center'>
                <span className="text-lg">{producto.codigo}</span>
            </div>
            <div className='w-full lg:w-[15%] text-center'>
                <input
                    type="text"
                    className="bg-[#e6e6e6] p-[10px] rounded-lg text-center w-[60px]"
                    value={producto.cantidad}
                    onChange={(e) => actualizarCantidad(index, e.target.value)}
                    maxLength={4}
                />
            </div>
            <div className='w-full lg:w-[15%] text-center'>
                <span className="text-lg">$ </span>
                <input
                    type="text"
                    className="bg-[#e6e6e6] p-[10px] rounded-lg text-center w-[100px]"
                    value={producto.precio}
                    onChange={(e) => actualizarPrecio(index, e.target.value)} // Manejador del cambio
                    maxLength={10}
                />
            </div>
            <div className='w-full lg:w-[15%] text-center'>
                <span className="text-lg">${(producto.precio * producto.cantidad).toFixed(2)}</span>
            </div>
            <div className='w-full lg:w-[15%] text-center'>
                <button
                    type="button"
                    className="!text-red-500 text-3xl"
                    onClick={() => eliminarProducto(index)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );

}
