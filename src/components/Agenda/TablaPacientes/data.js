const columns = [
    { name: "NOMBRE PACIENTE", uid: "name", sortable: true },
    { name: "IDENTIFICACIÓN", uid: "id", sortable: true },
    { name: "SELECCIONAR", uid: "SELECCIONAR", sortable: true },

];

const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
