import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Input, Button } from '@nextui-org/react';
import axios from 'axios';
import { servidor, port } from '../../../config/config';
import * as XLSX from 'xlsx';
import ModalAgregar from './ModalAgregarProducto';
import { GrUpdate } from "react-icons/gr";
import { IoTrashBin } from "react-icons/io5";
import Swal from 'sweetalert2';


export default function TablaProductos() {
    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = useState(""); 
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const rowsPerPage = 10;

    // Función para obtener los datos desde el backend usando Axios
    const fetchData = async () => {
        setIsLoading(true); // Indicar que está cargando los datos
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/productos/productos`);
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setIsLoading(false); // Desactivar el estado de carga
        }
    };

    // Llamada inicial para obtener los datos cuando cambia la página
    useEffect(() => {
        fetchData();
    }, [page]);

    // Filtrar los elementos basados en el valor de búsqueda (nombre o código)
    const filteredItems = React.useMemo(() => {
        return data.filter((item) =>
            item.nombreProducto.toLowerCase().includes(filterValue) ||
            item.codigoProducto.toLowerCase().includes(filterValue)
        );
    }, [data, filterValue]);

    // Calcular el número total de páginas basadas en los elementos filtrados
    const pages = React.useMemo(() => {
        return filteredItems.length
            ? Math.ceil(filteredItems.length / rowsPerPage)
            : 0;
    }, [filteredItems, rowsPerPage]);

    // Dividir los elementos filtrados según la página actual
    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const loadingState = isLoading || filteredItems.length === 0 ? "loading" : "idle";

    // Función para exportar los datos a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredItems); // Convierte los datos filtrados a una hoja de Excel
        const workbook = XLSX.utils.book_new(); // Crea un nuevo libro de trabajo
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos"); // Añade la hoja al libro
        XLSX.writeFile(workbook, "productos.xlsx"); // Descarga el archivo Excel
    };

    const handleEliminarIndividual = async (idProducto) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar la resolución: ${idProducto}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios({
                        method: 'delete',
                        url: `http://${servidor}:${port}/api/productos/eliminarProducto`,
                        data: { producto: idProducto },
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.status === 200) {
                        fetchData();
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminada',
                            text: 'El producto ha sido eliminado correctamente.',
                            showConfirmButton: 'OK',
                            confirmButtonColor: '#2c3e50'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetchData();
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar',
                        text: 'Ocurrió un error al eliminar el producto.',
                        confirmButtonColor: '#2c3e50'
                    });
                }
            }
        });
    };

    return (
        <>
            <div className="flex justify-between ">
                <div>
                    <h1 className="text-3xl mb-2 ml-2 font-bold text-gray-600">Lista de Productos</h1>
                    {/* Campo de búsqueda */}
                    <Input
                        isClearable
                        className="w-[744px] sm:max-w-[44%] mb-4"
                        placeholder="Buscar Producto por nombre o código..."
                        value={filterValue}
                        onClear={() => setFilterValue("")}
                        onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
                    />
                </div>

                <div className="grid gap-2">
                    <ModalAgregar actualizarTabla={fetchData} />
                    <Button color="default" onClick={exportToExcel}>
                        Exportar
                    </Button>
                </div>

            </div>

            {/* Tabla con paginación */}
            <Table
                aria-label="Tabla de productos"
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
            >
                <TableHeader>
                    <TableColumn key="nombreProducto">Nombre Producto</TableColumn>
                    <TableColumn key="codigoProducto">Código</TableColumn>
                    <TableColumn key="subcapitulo">Subcapítulo</TableColumn>
                    <TableColumn key="accion">Acción</TableColumn>

                </TableHeader>

                <TableBody
                    items={paginatedItems}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow key={item?.idProducto}>
                            {/* Renderiza solo las columnas que están definidas en el encabezado */}
                            <TableCell>{item.nombreProducto}</TableCell>
                            <TableCell>{item.codigoProducto}</TableCell>
                            <TableCell>{item.subcapitulo}</TableCell>
                            <TableCell className="flex gap-1">
                                <Button color="error"
                                    onClick={() => handleEliminarIndividual(item.idProducto)}
                                    className="text-xl p-0 m-0 min-w-[30px]"
                                >
                                    <IoTrashBin color="red" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
