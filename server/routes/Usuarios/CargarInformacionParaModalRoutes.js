import { Router } from "express";
import { poolPromise } from "../../db.js"; // Importamos poolPromise para la conexión de base de datos
import sql from "mssql";

const router = Router();

const FormaVieja = `
    SELECT 
        [Id Sexo] AS 'IdSexo',
        [Sexo] AS 'Sexo',
        CASE
            WHEN [Id Sexo] = 1 THEN 'Seleccionar'
            ELSE [Descripción Sexo]
        END AS 'DescripcionSexo'
    FROM 
        Sexo
`;
router.get("/registrarusuario/tipodedocumento", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                [Id Tipo de Documento] AS 'IdTipoDeDocumento',
                [Tipo de Documento] AS 'TipoDeDocumento',
                [Descripción Tipo de Documento] AS 'DescripcionTipoDeDocumento'
            FROM
                [Tipo de Documento]
            WHERE 
                LEN(LTRIM(RTRIM([Descripción Tipo de Documento]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdTipoDeDocumento"],
      text: row["DescripcionTipoDeDocumento"],
    }));

    console.log(
      `Tabla [Tipo de Documento] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/sexo", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT 
                [Id Sexo] AS 'IdSexo',
                [Sexo] AS 'Sexo',
				[Descripción Sexo] AS 'DescripcionSexo'
            FROM 
                Sexo
			WHERE				
				LEN(LTRIM(RTRIM([Descripción Sexo]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdSexo"],
      text: row["DescripcionSexo"],
    }));

    console.log(
      `Tabla [Sexo] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/unidadmedidaedad", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
			SELECT
                [Id Unidad de Medida Edad] AS 'IdUnidadDeMedidaEdad',
                [Unidad de Medida Edad] AS 'UnidadDeMedidaEdad',
				[Descripción Unidad de Medida Edad] AS 'DescripcionUnidadDeMedidaEdad'
            FROM 
                [Unidad de Medida Edad]
			WHERE				
				LEN(LTRIM(RTRIM([Descripción Unidad de Medida Edad]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdUnidadDeMedidaEdad"],
      text: row["DescripcionUnidadDeMedidaEdad"],
    }));

    console.log(
      `Tabla [Unidad de Medida Edad] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/paisdeorigen", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT 
                TOP(299)
                [Id País] AS 'IdPais',
                [Código País] AS 'CodigoPais',
				[Descripción País] AS 'DescripcionPais'
            FROM 
                País
			WHERE
				LEN(LTRIM(RTRIM([Descripción País]))) > 0
            ORDER BY
                [Descripción País] ASC
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdPais"],
      text: row["DescripcionPais"],
    }));

    console.log(
      `Tabla [País] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/ciudadorigen", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
          SELECT
            Ciudad.[Id Ciudad] AS 'IdCiudad',
            Ciudad.Ciudad AS 'Ciudad',
            Depar.Departamento AS 'Departamento',
            País.[Descripción País] AS 'Pais'
          FROM 
            Ciudad
          INNER JOIN
            Departamento Depar ON Ciudad.[Id Departamento] = Depar.[Id Departamento]
          INNER JOIN
            País ON Depar.[Id País] = País.[Id País]
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      IdCiudad: row["IdCiudad"],
      Ciudad: row["Ciudad"],
      Departamento: row["Departamento"],
      Pais: row["Pais"],
    }));

    console.log(
      `Tabla [Ciudad] => [Ciudad De Origen/Nacimiento] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/paisderesidencia", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
              SELECT 
                  TOP(299)
                  [Id País] AS 'IdPais',
                  [Código País] AS 'CodigoPais',
                  [Descripción País] AS 'DescripcionPais'
              FROM 
                  País
              WHERE
                  LEN(LTRIM(RTRIM([Descripción País]))) > 0
                  AND
                  ([Descripción País] LIKE '%Colombia%')
              ORDER BY
                  [Descripción País] ASC
          `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdPais"],
      text: row["DescripcionPais"],
    }));

    console.log(
      `Tabla [País] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

// router.get("/registrarusuario/departamento", async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query(`
// 			SELECT
//         [Id Departamento] AS 'IdDepartamento',
//         [Código Departamento] AS 'CodigoDepartamento',
//         [Departamento] AS 'Departamento'
//       FROM
//         Departamento
// 			WHERE
// 				[Id País] =
//       ORDER BY
//         [Departamento] ASC
//         `);

//     const ListaTipoDeDocumento = result.recordset.map((row) => ({
//       value: row["IdDepartamento"],
//       text: row["Departamento"],
//     }));

//     console.log(
//       `Tabla [Departamento] - Registros capturados => ${result.rowsAffected}`
//     );
//     res.json(ListaTipoDeDocumento);
//   } catch (err) {
//     console.error("Error al mostrar la información del usuario:", err);
//     res.status(500).send("Error al mostrar la información del usuario");
//   }
// });

router.get("/registrarusuario/departamento", async (req, res) => {
  try {
    const { pais } = req.query; // Recibe el Id del país desde la query string

    if (!pais) {
      return res.status(400).send("El parámetro 'pais' es requerido.");
    }

    const pool = await poolPromise;
    const result = await pool.request().input("IdPais", pais) // Agrega el Id del país como parámetro de la consulta
      .query(`
        SELECT
          [Id Departamento] AS 'IdDepartamento',
          [Código Departamento] AS 'CodigoDepartamento',
          [Departamento] AS 'Departamento'
        FROM
          Departamento
        WHERE
          [Id País] = @IdPais
        ORDER BY 
          [Departamento] ASC
      `);

    const ListaDepartamentos = result.recordset.map((row) => ({
      value: row["IdDepartamento"],
      text: row["Departamento"],
    }));

    console.log(
      `Tabla [Departamento] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaDepartamentos);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

// router.get("/registrarusuario/ciudad", async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query(`
// 			SELECT
//         [Id Ciudad] AS 'IdCiudad',
//         Ciudad AS 'Ciudad',
//         [Código Ciudad] AS 'CodigoCiudad'
//       FROM
//         Ciudad
// 			WHERE
// 				LEN(LTRIM(RTRIM([Ciudad]))) > 0
// 				AND
// 				[Id Departamento] =
//     `);

//     const ListaTipoDeDocumento = result.recordset.map((row) => ({
//       value: row["IdCiudad"],
//       text: row["Ciudad"],
//     }));

//     console.log(
//       `Tabla [Ciudad] - Registros capturados => ${result.rowsAffected}`
//     );
//     res.json(ListaTipoDeDocumento);
//   } catch (err) {
//     console.error("Error al mostrar la información del usuario:", err);
//     res.status(500).send("Error al mostrar la información del usuario");
//   }
// });

router.get("/registrarusuario/ciudad", async (req, res) => {
  const { departamento } = req.query; // Obtener el IdDepartamento de los parámetros de la consulta

  if (!departamento) {
    return res.status(400).send("El parámetro 'departamento' es requerido");
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("IdDepartamento", departamento) // Pasar el IdDepartamento como parámetro
      .query(`
        SELECT
          [Id Ciudad] AS 'IdCiudad',
          Ciudad AS 'Ciudad',
          [Código Ciudad] AS 'CodigoCiudad'
        FROM
          Ciudad
        WHERE
          LEN(LTRIM(RTRIM([Ciudad]))) > 0
          AND
          [Id Departamento] = @IdDepartamento
      `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdCiudad"],
      text: row["Ciudad"],
    }));

    console.log(
      `Tabla [Ciudad] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/zonaterritorial", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT 
                [Id Zona Residencia] AS 'IdZonaResidencia',
                [Zona Residencia] AS 'ZonaResidencia',
				[Descripción Zona Residencia] AS 'DescripcionZonaResidencia'
            FROM
                [Zona Residencia]
			WHERE				
				LEN(LTRIM(RTRIM([Descripción Zona Residencia]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdZonaResidencia"],
      text: row["DescripcionZonaResidencia"],
    }));

    console.log(
      `Tabla [Zona Residencia] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/estadocivil", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT 
                [Id Estado Civil] AS 'IdEstadoCivil',
				[Estado Civil] AS 'EstadoCivil'
            FROM
                [Estado Civil]
			WHERE				
				LEN(LTRIM(RTRIM([Estado Civil]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdEstadoCivil"],
      text: row["EstadoCivil"],
    }));

    console.log(
      `Tabla [Estado Civil] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/ocupacion", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                [Id Ocupación] AS 'IdOcupacion',
				Ocupación AS 'Ocupacion'
            FROM
                Ocupación
			WHERE				
				LEN(LTRIM(RTRIM([Ocupación]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdOcupacion"],
      text: row["Ocupacion"],
    }));

    console.log(
      `Tabla [Ocupación] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/aseguradora", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                Ent.[Documento Entidad] AS 'DocumentoAseguradora',
                Ent.[Primer Nombre Entidad] AS 'NombreAseguradora'

            FROM
                Entidad Ent
            INNER JOIN 
                [Función Por Entidad] FunPorEnt ON Ent.[Documento Entidad] = FunPorEnt.[Documento Entidad]
            INNER JOIN
                Función Fun ON FunPorEnt.[Id Función] = Fun.[Id Función]
            WHERE
                ( Fun.[Id Función] = 23 ) AND
				LEN(LTRIM(RTRIM([Primer Nombre Entidad]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["DocumentoAseguradora"],
      text: row["NombreAseguradora"],
    }));

    console.log(
      `Aseguradoras - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/tipoafiliado", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                [Id Tipo de Afiliado] AS 'IdTipoAfiliado',
                [Tipo de Afiliado] AS 'TipoDeAfiliado'
            FROM
                [Tipo de Afiliado]
            WHERE
                LEN(LTRIM(RTRIM([Tipo de Afiliado]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdTipoAfiliado"],
      text: row["TipoDeAfiliado"],
    }));

    console.log(
      `Tabla [Tipo de Afiliado] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/tipousuario", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                [Id Tipo Entidad] AS 'IdTipoEntidad',
                [Tipo Entidad] AS 'TipoEntidad',
                [Descripción Tipo Entidad] AS 'DescripcionTipoEntidad'
            FROM
                [Tipo Entidad]
            WHERE
                LEN(LTRIM(RTRIM([Descripción Tipo Entidad]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdTipoEntidad"],
      text: row["DescripcionTipoEntidad"],
    }));

    console.log(
      `Tabla [Tipo Entidad] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

router.get("/registrarusuario/parentesco", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
            SELECT
                [Id Parentesco] AS 'IdParentesco',
                Parentesco AS 'Parentesco'
            FROM	
                Parentesco
            WHERE
                LEN(LTRIM(RTRIM([Parentesco]))) > 0
        `);

    const ListaTipoDeDocumento = result.recordset.map((row) => ({
      value: row["IdParentesco"],
      text: row["Parentesco"],
    }));

    console.log(
      `Tabla [Parentesco] - Registros capturados => ${result.rowsAffected}`
    );
    res.json(ListaTipoDeDocumento);
  } catch (err) {
    console.error("Error al mostrar la información del usuario:", err);
    res.status(500).send("Error al mostrar la información del usuario");
  }
});

const transformarFecha = (fechaObj) => {
  // Extraer los valores del objeto fecha
  const { year, month, day } = fechaObj;

  // Asegurarse de que el mes y el día tengan dos dígitos
  const mes = String(month).padStart(2, "0");
  const dia = String(day).padStart(2, "0");

  // Formatear la fecha como 'YYYY-MM-DD'
  return `${year}-${mes}-${dia}`;
};

router.post("/registrarusuario/insertardatos", async (req, res) => {
  const {
    documento,
    primerApellido,
    segundoApellido,
    primerNombre,
    segundoNombre,
    tipoDocumento,
    IdCiudad,
    Direccion,
    Telefono,
    Correo,
    IdZonaResidencial,
    TipoDeUsuario,
    EstadoCivil,
    FechaDeNacimiento,
    edad,
    UnidadDeMedidaEdad,
    Sexo,
    // PaisDeOrigen,
    PaisDeResidencia,
    Departamento,
    Ocupacion,
    Aseguradora,
    TipoDeVinculacion,
    NombreDelResponsable,
    ParentescoDelResponsable,
    TelefonoDelResponsable,
    IdCiudadNacimiento,
  } = req.body;
  const NombreCompletoUsuario = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`;
  const DocumentoEntidadRegistro = "70123456";

  // Convertir la fecha recibida a 'YYYY-MM-DD'
  const FechaDeNacimientoFormateada = transformarFecha(FechaDeNacimiento);
  console.log("FechaDeNacimiento:", FechaDeNacimiento); // Imprime el valor recibido
  console.log("Fecha de Nacimiento formateada:", FechaDeNacimientoFormateada);

  let DiccionarioConTodaLaInfoEnviadaDesdeElCliente = {
    "Documento Usuario": documento,
    "Primer Nombre": primerNombre,
    "Segundo Nombre": segundoNombre,
    "Primer Apellido": primerApellido,
    "Segundo Apellido": segundoApellido,
    "Tipo Documento": tipoDocumento,
    Ciudad: IdCiudad,
    Dirección: Direccion,
    Telefono: Telefono,
    Correo: Correo,
    IdZonaResidencial: IdZonaResidencial,
    "Tipo De Usuario": TipoDeUsuario,
    "Estado Civil": EstadoCivil,
    "Fecha De Nacimiento": FechaDeNacimiento,
    Edad: edad,
    "Unidad De Medida Edad": UnidadDeMedidaEdad,
    Sexo: Sexo,
    // "Pais De Origen": PaisDeOrigen,
    "Pais De Residencia": PaisDeResidencia,
    Departamento: Departamento,
    Ocupacion: Ocupacion,
    Aseguradora: Aseguradora,
    "Tipo De Vinculacion": TipoDeVinculacion,
    "Nombre Del Responsable": NombreDelResponsable,
    "Parentesco Del Responsable": ParentescoDelResponsable,
    "Telefono Del Responsable": TelefonoDelResponsable,
    "Id Ciudad De Nacimiento": IdCiudadNacimiento,
  };
  console.log("-----------------------------------------------------------");
  console.log("Información enviada desde el cliente:");
  console.log("-----------------------------------------------------------");
  for (const propiedad in DiccionarioConTodaLaInfoEnviadaDesdeElCliente) {
    console.log(
      `${propiedad}: ${DiccionarioConTodaLaInfoEnviadaDesdeElCliente[propiedad]}`
    );
  }
  console.log("-----------------------------------------------------------");

  try {
    // // Obtener la conexión del pool
    const pool = await poolPromise;

    // Preparar y ejecutar la consulta
    const result = await pool
      .request()
      .input("documento", sql.VarChar, documento)
      .input("IdTipoDocumento", sql.VarChar, tipoDocumento)
      .input("primerApellido", sql.VarChar, primerApellido)
      .input("segundoApellido", sql.VarChar, segundoApellido)
      .input("primerNombre", sql.VarChar, primerNombre)
      .input("segundoNombre", sql.VarChar, segundoNombre)
      .input("nombreCompletoUsuario", sql.VarChar, NombreCompletoUsuario)
      .input("IdCiudad", sql.VarChar, IdCiudad)
      .input("DocumentoEntidadRegistro", sql.VarChar, DocumentoEntidadRegistro)
      .input("Direccion", sql.VarChar, Direccion)
      .input("Telefono", sql.VarChar, Telefono)
      .input("Correo", sql.VarChar, Correo)
      .input("IdZonaResidencial", sql.VarChar, IdZonaResidencial)
      .input("TipoDeUsuario", sql.VarChar, TipoDeUsuario)
      .input("EstadoCivil", sql.VarChar, EstadoCivil || null)
      .input("FechaDeNacimiento", sql.Date, FechaDeNacimientoFormateada)
      .input("Edad", sql.Int, edad)
      .input("UnidadDeMedidaEdad", sql.VarChar, UnidadDeMedidaEdad)
      .input("Sexo", sql.VarChar, Sexo)
      // .input("PaisDeOrigen", sql.VarChar, PaisDeOrigen)
      .input("PaisDeResidencia", sql.VarChar, PaisDeResidencia)
      .input("Departamento", sql.VarChar, Departamento)
      .input("Ocupacion", sql.VarChar, Ocupacion || null)
      .input("Aseguradora", sql.VarChar, Aseguradora)
      .input("TipoDeVinculacion", sql.VarChar, TipoDeVinculacion || null)
      .input("NombreDelResponsable", sql.VarChar, NombreDelResponsable)
      .input("ParentescoDelResponsable", sql.VarChar, ParentescoDelResponsable || null)
      .input("TelefonoDelResponsable", sql.VarChar, TelefonoDelResponsable)
      .input("IdCiudadNacimiento", sql.VarChar, IdCiudadNacimiento)
      .query(`
                -- INSERT EN [Entidad]
              INSERT INTO 
                    [Entidad]
                        (
                            [Documento Entidad], [Id Tipo de Documento], [Primer Apellido Entidad], [Segundo Apellido Entidad], [Primer Nombre Entidad], 
                            [Segundo Nombre Entidad], [Nombre Completo Entidad], [Id Ciudad], [Código Entidad], [DocumentoEntidadRegistró]
                        )
                VALUES 
                    (
                        @documento, @IdTipoDocumento, @primerApellido, @segundoApellido, @primerNombre, 
                        @segundoNombre, @nombreCompletoUsuario, @IdCiudad, @documento, @DocumentoEntidadRegistro
                    );
                -- INSERT EN [EntidadII]
                INSERT INTO 
                    [EntidadII]
                        (
                            [Documento Entidad], [Dirección EntidadII], [Teléfono Celular EntidadII], [E-mail Nro 1 EntidadII],
                            [Id Ciudad]
                        )
                VALUES
                    (
                        @documento, @Direccion, @Telefono, @Correo, @IdCiudad
                    );
                -- INSERT EN [Entidad Responsable]
                INSERT INTO
                  [Entidad Responsable]
                  (
                    [Documento Entidad]
                  )
                VALUES
                  (
                    @documento
                  )
                -- INSERT EN [Entidad Usuario]
                INSERT INTO
                  [Entidad Usuario]
                  (
                    [Documento Entidad]
                  )
                VALUES
                  (
                    @documento
                  )
                -- INSERT EN [Función por Entidad]
                INSERT INTO 
                  [Función por Entidad]
                  (
                    [Documento Entidad], [Id Función]
                  )
                VALUES
                  ( @documento, 3 ),
                  ( @documento, 7 )
                -- INSERT EN [EntidadIII]
                INSERT INTO
                    [EntidadIII]
                    (
                        [Documento Entidad], [Id Zona Residencia], [Id Tipo Entidad], [Id Estado Civil],
                        [Fecha Nacimiento EntidadIII], [Edad EntidadIII], [Id Unidad de Medida Edad],
                        [Id Sexo], [Acompañante EntidadIII], [Tel Acompañante EntidadIII], [Documento Responsable],
                        [Id Parentesco], [Id Ciudad]
                    )
                VALUES
                    (
                        @documento, @IdZonaResidencial, @TipoDeUsuario, @EstadoCivil, @FechaDeNacimiento,
                        @Edad, @UnidadDeMedidaEdad, @Sexo, @NombreDelResponsable, @TelefonoDelResponsable, @documento,
                        @ParentescoDelResponsable, @IdCiudadNacimiento
                    );
                -- INSERT EN [EntidadVI]
                INSERT INTO
                    [EntidadVI]
                    (
                      [Documento Entidad], [Id Ocupación]
                    )
                VALUES
                  (
                    @documento, @Ocupacion
                  )
                -- INSERT EN [EntidadXVI]
                INSERT INTO
                  [EntidadXVI]
                  (
                    [Documento Entidad], [Documento Entidad Salud], [Id Tipo de Afiliado]
                  )
                VALUES
                  (
                    @documento, @Aseguradora, @TipoDeVinculacion
                  )
                -- INSERT EN [EntidadXXIV]
                INSERT INTO
                  [EntidadXXIV]
                  (
                    [Documento Entidad], [Documento Entidad Prepago], [Id Tipo de Afiliado]
                  )
                VALUES
                  (
                    @documento, @Aseguradora, @TipoDeVinculacion
                  )
        `);

    // res.status(200).send('Usuario insertado correctamente');
    console.log("Usuario insertado correctamente :)");
    res.status(200).send({
      message: "Usuario insertado correctamente",
      tipoDocumento: tipoDocumento,
    });
  } catch (err) {
    console.error("Error al insertar el usuario :(", err);
    res.status(500).send({
      message: `Error al insertar el usuario: ${err.message}`,
      tipoDocumento: tipoDocumento,
    });
  }
});

export default router;
