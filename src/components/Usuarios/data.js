// import React from "react";
// import axios from "axios";
// import { servidor } from "../../config/config";
// import { port } from "../../config/config";

// let users = [];

// const fetchUsers = async () => {
//     try {
//         // const response = await axios.get('/infousuarios'); // Ajusta la ruta según tu backend
//         const response = await axios.get(`http://${servidor}:${port}/api/infousuarios`);
//         console.log(response.data); // Verifica qué formato tienen los datos

//         users = response.data.map(user => ({
//             id: user.id,
//             name: user.name,
//             // role: user.role,
//             role: 'Desarrollador BackEnd',
//             // team: user.team,
//             team: 'Scrum Top',
//             // status: user.status,
//             status: 'active',
//             age: user.age,
//             avatar: `http://${servidor}:${port}/images/${user.avatar}`,
//             email: user.email,
//         }));
//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// };

// // Llamar a la función para obtener los datos
// fetchUsers();

// const columns = [
//   { name: "ID", uid: "id", sortable: true },
//   { name: "NOMBRE", uid: "name", sortable: true },
//   { name: "EDAD", uid: "age", sortable: true },
//   { name: "ROLE", uid: "role", sortable: true },
//   { name: "TEAM", uid: "team" },
//   { name: "CORREO", uid: "email" },
//   { name: "STATUS", uid: "status", sortable: true },
//   { name: "ACCIONES", uid: "actions" },
// ];

// const statusOptions = [
//   { name: "Active", uid: "active" },
//   { name: "Paused", uid: "paused" },
//   { name: "Vacation", uid: "vacation" },
// ];

// export { columns, users, statusOptions };

// data.js
import axios from "axios";
import { servidor, port } from "../../config/config";

let users = [];

const fetchUsers = async () => {
  try {
    const response = await axios.get(
      `http://${servidor}:${port}/api/infousuarios`
    );
    console.log(response.data);

    users = response.data.map((user) => ({
      id: user.id2,
      name: user.name,
      role: "Desarrollador BackEnd", // Valor predeterminado
      team: "Scrum Top", // Valor predeterminado
      // status: "active", // Valor predeterminado
      status: user.status, // Valor predeterminado
      age: user.age,
      avatar: user.avatar,
      // avatar: user.avatar
      //   ? `http://${servidor}:${port}/images/${user.avatar}`
      //   : `http://${servidor}:${port}/images/AvatarPorDefecto.png`, // Avatar por defecto
      email: user.email,
      typeuser: user.tipoentidad,
      documentousuario: user.id
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// No llamamos fetchUsers aquí, lo exportamos para que sea utilizado en TablaUsuarios.jsx
export { fetchUsers, users };

const columns = [
  { name: "NOMBRE", uid: "name", sortable: true },
  { name: "DOCUMENTO", uid: "id", sortable: true },
  { name: "EDAD", uid: "age", sortable: true },
  // { name: "ROLE", uid: "role", sortable: true },
  // { name: "TEAM", uid: "team" },
  { name: "TIPO DE USUARIO", uid: "typeuser", sortable: true },
  { name: "CORREO", uid: "email" },
  // { name: "ESTADO", uid: "status", sortable: true },
  { name: "ACCIONES", uid: "actions" },
  // { name: "documentousuario", uid: "documentousuario" }
];

// const statusOptions = [
//   { name: "Active", uid: "active" },
//   { name: "Paused", uid: "paused" },
//   { name: "Vacation", uid: "vacation" },
// ];

const statusOptions = [
  { name: "Active", uid: "Activo" },
  { name: "Paused", uid: "Inactivo" },
  { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
