// import { Router } from 'express';
// import { poolPromise } from '../db.js'; // Importamos poolPromise para la conexión de base de datos

// const router = Router();

// router.get('/infousuarios', async (req, res) => {
//     try {
//         const pool = await poolPromise; // Obtenemos una conexión de la piscina
//         const result = await pool.request()
//             .query(`
//                 SELECT
//                     Ent.[Documento Entidad] AS id,
//                     Ent.[Nombre Completo Entidad] AS name,
//                     'Paciente' AS role,
//                     'Desarrollador' AS team,
//                     'Activo' AS status,
//                     '25' AS age,
//                     Ent.[Foto Entidad] AS avatar,
//                     EntII.[E-mail Nro 1 EntidadII] AS email
//                 FROM
//                     Entidad AS Ent
//                 INNER JOIN
//                     EntidadII AS EntII ON Ent.[Documento Entidad] = EntII.[Documento Entidad]
// 				INNER JOIN
// 					[Función Por Entidad] AS FunEnt ON Ent.[Documento Entidad] = FunEnt.[Documento Entidad]

//                 WHERE
//                     (Ent.[Nombre Completo Entidad] LIKE '%[^ ]%')
// 					AND
// 					(FunEnt.[Id Función] = 3)
//                     --AND
//                     --(EntII.[E-mail Nro 1 EntidadII] LIKE '%[^ ]%')
//                 ORDER BY
//                     Ent.[Nombre Completo Entidad] ASC
//             `);

//         const infoPacientes = result.recordset.map(row => ({
//             id: row['id'],
//             name: row['name'],
//             role: row['role'],
//             team: row['team'],
//             status: row['status'],
//             age: row['age'],
//             avatar: row['avatar'],
//             email: row['email']
//         }));

//         console.log(`Consulta de información de los usuarios ejecutada con éxito. Filas afectadas: ${result.rowsAffected}`);
//         res.json(infoPacientes);
//     } catch (err) {
//         console.error('Error al ejecutar la consulta de información de los usuarios:', err.message);
//         res.status(500).json({ error: 'Error al obtener datos de información de usuarios' });
//     }
// });

// export default router;

import fs from "fs";
import path from "path";
import { Router } from "express";
import { poolPromise } from "../db.js"; // Importamos poolPromise para la conexión de base de datos
import { servidor, port } from "../../src/config/config.js";

const router = Router();

router.get("/infousuarios", async (req, res) => {
  try {
    const pool = await poolPromise; // Obtenemos una conexión de la piscina
    const result = await pool.request().query(`

        SELECT
            --TipoDoc.[Tipo de Documento] + ' ' + Ent.[Documento Entidad] AS id,
            COALESCE(TipoDoc.[Tipo de Documento] + ' ', '') + COALESCE(Ent.[Documento Entidad], '') AS id2,
            Ent.[Documento Entidad] AS id,
            Ent.[Nombre Completo Entidad] AS name,
            'Paciente' AS role,
            'Desarrollador' AS team,
            --'Activo' AS status,
            EstaEnt.[Estado Entidad] AS status,
            EntIII.[Edad EntidadIII] AS age,
            Ent.[Foto Entidad] AS avatar,
            EntII.[E-mail Nro 1 EntidadII] AS email,
            TipoEnt.[Descripción Tipo Entidad] AS tipoentidad
        FROM
            Entidad AS Ent
        INNER JOIN 
            EntidadII AS EntII ON Ent.[Documento Entidad] = EntII.[Documento Entidad]
        INNER JOIN 
            [Función Por Entidad] AS FunEnt ON Ent.[Documento Entidad] = FunEnt.[Documento Entidad]
        INNER JOIN
            [EntidadIII] AS EntIII ON EntII.[Documento Entidad] = EntIII.[Documento Entidad]
        INNER JOIN 
            [Tipo de Documento] AS TipoDoc ON Ent.[Id Tipo de Documento] = TipoDoc.[Id Tipo de Documento]
        INNER JOIN
            [Estado Entidad] EstaEnt ON EntIII.[Id Estado Entidad] = EstaEnt.[Id Estado Entidad]
        INNER JOIN 
            [Tipo Entidad] AS TipoEnt ON EntIII.[Id Tipo Entidad] = TipoEnt.[Id Tipo Entidad]
        WHERE
            (Ent.[Nombre Completo Entidad] LIKE '%[^ ]%')
            AND
            (FunEnt.[Id Función] = 3)
        ORDER BY 
            Ent.[Nombre Completo Entidad] ASC
    `);

    const infoPacientes = result.recordset.map((row) => {
      let avatarUrl;

      if (row["avatar"]) {
        const avatarPath = path.join("C:/CeereSio/Foto Entidad", row["avatar"]);
        // Verificamos si la imagen existe en el servidor
        if (fs.existsSync(avatarPath)) {
          avatarUrl = `http://${servidor}:${port}/images/${row["avatar"]}`;
        } else {
          avatarUrl = `http://${servidor}:${port}/images/AvatarPorDefecto.png`; // Usar avatar por defecto si la imagen no existe
        }
      } else {
        avatarUrl = `http://${servidor}:${port}/images/AvatarPorDefecto.png`; // Usar avatar por defecto si el valor es null
      }

      return {
        id2: row["id2"],
        id: row["id"],
        name: row["name"],
        role: row["role"],
        team: row["team"],
        status: row["status"],
        age: row["age"],
        avatar: avatarUrl,
        email: row["email"],
        tipoentidad: row["tipoentidad"] || "N/A" // Agregamos el campo tipoentidad en caso de que no exista en la base de datos
      };
    });

    console.log(
      `Consulta de información de los usuarios ejecutada con éxito. Filas afectadas: ${result.rowsAffected}`
    );
    res.json(infoPacientes);
  } catch (err) {
    console.error(
      "Error al ejecutar la consulta de información de los usuarios:",
      err.message
    );
    res
      .status(500)
      .json({ error: "Error al obtener datos de información de usuarios" });
  }
});

export default router;
