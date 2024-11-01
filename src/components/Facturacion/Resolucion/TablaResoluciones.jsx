import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination } from "@nextui-org/react";
import { servidor, port } from '../../../config/config';
import Swal from "sweetalert2";
import { GrUpdate } from "react-icons/gr";
import { IoTrashBin } from "react-icons/io5";



const columns = [
    { key: "NombreEmpresa", label: "Empresa" },
    { key: "prefijo", label: "Prefijo" },
    { key: "resolucion", label: "No. Resolución" },
    { key: "fechaInicio", label: "Fecha Resolución" },
    { key: "fechaFinal", label: "Fecha Vencimiento" },
    { key: "NoInicio", label: "No. Inicio" },
    { key: "NoFin", label: "No. Fin" },
    { key: "estado", label: "Estado" },
    { key: "accion", label: "Acción" }, // Mantén la columna para el botón de "Eliminar"
];

const TablaResoluciones = forwardRef((props, ref) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5; // Número de filas por página

    // Calcular el número de páginas totales
    const pages = Math.ceil(data.length / rowsPerPage);

    // Obtener las resoluciones por página
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    }, [page, data]);

    // Función para obtener los datos del backend
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${servidor}:${port}/api/resolucion/infoResoluciones`);
            setData(response.data); // Guardar los datos en el estado
        } catch (error) {
            console.error("Error al obtener los datos de resoluciones:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Llamar a la función cuando el componente se monte
    }, []);

    // Expone fetchData a través de la referencia usando useImperativeHandle
    useImperativeHandle(ref, () => ({
        fetchData
    }));

    // Nueva función para eliminar una resolución individual
    const handleEliminarIndividual = async (idEmpresaV) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar la resolución: ${idEmpresaV}`,
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
                        url: `http://${servidor}:${port}/api/resolucion/eliminarResolucion`,
                        data: { resolucion: idEmpresaV },
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.status === 200) {
                        fetchData();
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminada',
                            text: 'La resolución ha sido eliminada correctamente.',
                            showConfirmButton: 'OK',
                            confirmButtonColor: '#2c3e50'
                        });
                    }
                } catch (error) {
                    console.error("Error al eliminar resolución:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar',
                        text: 'Ocurrió un error al eliminar la resolución.',
                        confirmButtonColor: '#2c3e50'
                    });
                }
            }
        });
    };

    const handleActualizarIndividual = async (idEmpresaV) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `De querer desactivar la resolución: ${idEmpresaV}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios({
                        method: 'put',
                        url: `http://${servidor}:${port}/api/resolucion/actualizarEstado`,
                        data: { resolucion: idEmpresaV },
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.status === 200) {
                        fetchData();
                        Swal.fire({
                            icon: 'success',
                            title: 'Desactivada',
                            text: 'La resolución ha sido desactivada correctamente.',
                            showConfirmButton: 'OK',
                            confirmButtonColor: '#2c3e50'
                        });
                    }
                } catch (error) {
                    console.error("Error al actualizar resolución:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: 'Ocurrió un error al actualizar la resolución.',
                    });
                }
            }
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <Table
                aria-label="Tabla de resoluciones con paginación"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.IdEmpresaV}>
                            {columns.slice(0, -1).map((column) => (
                                <TableCell key={column.key}>
                                    {column.key === "estado" ? (
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-center ${item.estado === "Activado"
                                                ? "bg-green-500 text-slate-100"
                                                : "bg-red-500 text-slate-100"
                                                }`}
                                        >
                                            {item.estado === "Activado" ? "Active" : "Stop"}
                                        </span>
                                    ) : (
                                        item[column.key] || "N/A"
                                    )}
                                </TableCell>
                            ))}
                            <TableCell key="accion" className="flex gap-1 justify-center items-center">
                                <Button color="error"
                                    onClick={() => handleEliminarIndividual(item.IdEmpresaV)}
                                    className="text-xl p-0 m-0 min-w-[30px]"
                                >
                                    <IoTrashBin color="red" />
                                </Button>
                                <Button color="error"
                                    onClick={() => handleActualizarIndividual(item.IdEmpresaV)}
                                    className="text-lg p-0 m-0 min-w-0"
                                >
                                    <GrUpdate color="blue" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
});

TablaResoluciones.displayName = "TablaResoluciones";
export default TablaResoluciones;
