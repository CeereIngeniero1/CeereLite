import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@nextui-org/react";

import "./Styles.css";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
// import { columns, users, statusOptions } from "./data";
import { fetchUsers, users, columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { MostrarModalResgistrarUsuario } from "./MostrarModal";
import { MostrarModalCiudadOrigen } from "./MostrarModalCiudadOrigen";
import axios from "axios";
import { servidor } from "../../config/config";
import { port } from "../../config/config";
import { useDisclosure } from "@nextui-org/react";
import { ModalActualizarUsuario } from "./Actualizar/ModalActualizarUsuario";


// const statusColorMap = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };

const statusColorMap = {
  Activo: "success",
  Inactivo: "danger",
  vacation: "warning",
};

// const INITIAL_VISIBLE_COLUMNS = ["name", "id", "role", "status", "actions"];
const INITIAL_VISIBLE_COLUMNS = ["name", "id", "typeuser", "actions"];

export function TablaUsuarios() {
  // const navigate = useNavigate();

  // // const [users, setUsers] = React.useState([]); // Estado para almacenar los usuarios
  // const [filterValue, setFilterValue] = React.useState("");
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  // const [visibleColumns, setVisibleColumns] = React.useState(
  //   new Set(INITIAL_VISIBLE_COLUMNS)
  // );
  // const [statusFilter, setStatusFilter] = React.useState("all");
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [sortDescriptor, setSortDescriptor] = React.useState({
  //   column: "age",
  //   direction: "ascending",
  // });
  // const [page, setPage] = React.useState(1);

  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = React.useState(users);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);
  const [DocumentoUsuarioSeleccionado, setDocumentoUsuarioSeleccionado] = React.useState(users.documentousuario);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  // Lógica para hacer la solicitud HTTP al montar el componente
  // React.useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://${servidor}:${port}/api/infousuarios`
  //       );
  //       console.log("Datos recibidos:", response.data);

  //       const mappedUsers = response.data.map((user) => ({
  //         id: user.id,
  //         name: user.name,
  //         role: "Desarrollador BackEnd", // Asignar valor predeterminado
  //         team: "Scrum Top", // Asignar valor predeterminado
  //         status: "active", // Asignar valor predeterminado
  //         age: user.age,
  //         avatar: `http://${servidor}:${port}/images/${user.avatar}`,
  //         email: user.email,
  //       }));

  //       setUsers(mappedUsers);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []); // El array vacío asegura que la solicitud solo se haga una vez al montar

  // Cargar los usuarios al montar el componente
  React.useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
      setFilteredUsers(users);
    };

    loadUsers();
  }, []);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // const EditarActualizarUsuario = () => {
  //     // Encuentra el usuario en función de su documento o ID
  // const usuarioEditado = users.find(user => user.id);

  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Registro editado correctamente!',
  //     showConfirmButton: false,
  //     timer: 1500
  //   })
  //   console.log(usuarioEditado);
  // }

  const [DocumentoUsuarioAEditar, setDocumentoUsuarioAEditar] = React.useState();
  const EditarActualizarUsuario = (documentousuario) => {
    // Encuentra el usuario en función de su documento
    const usuarioEditado = users.find(user => user.documentousuario === documentousuario);

    console.log("Usuario editado:", usuarioEditado.documentousuario);
    setDocumentoUsuarioAEditar(usuarioEditado.documentousuario); // Actualiza el estado

    onOpen();
  }


  const handleNavegar = (documento) => {
    console.log(documento);
    // navigate("/Evolucion");
    navigate("/Evolucion", { state: { documentoPaciente: documento } });
  };

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu>
                {/* <DropdownItem>Ver</DropdownItem> */}
                {/* <DropdownItem onClick={EditarActualizarUsuario}>Editar</DropdownItem> */}
                <DropdownItem onClick={() => EditarActualizarUsuario(user.documentousuario)}>
                  Editar
                </DropdownItem>
                <DropdownItem onClick={() => handleNavegar(user.documentousuario)}>Evolucionar</DropdownItem>
                {/* <DropdownItem>Delete</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  /* FUNCIONALIDAD PARA EL BOTÓN AGREGAR */
  const AgregarNuevoPaciente = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres agregar un nuevo ítem?",
      icon: "question",
      html: `
        
            <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Nombre</label>
            <Input className="w-full" />
            </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      confirmButtonColor: "#0070f0",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#0070f0",
    });
  };
  /* FIN FIN FIN */
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4" id="ContenedorPrincipal">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre o documento..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              {/* <DropdownTrigger className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger> */}
              {/* <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu> */}
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className=" sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <MostrarModalResgistrarUsuario />
            {/* <MostrarModalCiudadOrigen/> */}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total: {users.length} usuarios
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {/* {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`} */}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className=" sm:flex w-[30%] justify-end gap-2">
          {/* <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button> */}
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <ModalActualizarUsuario
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        DocumentoUsuarioAEditar={ DocumentoUsuarioAEditar }
      />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No se encontraron usuarios"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
