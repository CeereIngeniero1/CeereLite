import axios from "axios";
import { servidor, port } from "../../config/config";

let Ciudades = [];

const CiudadesCapturadas = async () => {
  try {
    const respuesta = await axios.get(
      `http://${servidor}:${port}/api/registrarusuario/ciudadorigen`
    );
    console.log(respuesta.data);

    Ciudades = respuesta.data.map((Ciudad) => ({
      IdCiudad: Ciudad.IdCiudad,
      Ciudad: Ciudad.Ciudad,
      Departamento: Ciudad.Departamento,
      Pais: Ciudad.Pais,
    }));
  } catch (error) {
    console.error(`Error al mostrar las ciudades. Detalles => ${error}`);
  }
};

export { CiudadesCapturadas, Ciudades };

const columns = [
  { name: "ID", uid: "IdCiudad", sortable: true },
  { name: "CIUDAD", uid: "Ciudad", sortable: true },
  { name: "DEPARTAMENTO", uid: "Departamento", sortable: true },
  { name: "PAIS", uid: "Pais", sortable: true },
  { name: "SELECCIONAR", uid: "Seleccionar", sortable: true },
];

export { columns };
