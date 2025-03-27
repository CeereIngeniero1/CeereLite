// import React, { useEffect, useState } from "react";
// import { Select, SelectItem } from "@nextui-org/react";
// import axios from "axios";

// export default function ReutilizarSelect({
//     apiEndpoint,
//     placeholder,
//     label,
//     onChange,
//     options = [], // Asegúrate de que options se pueda pasar
//     value, // Añadido para controlar el valor seleccionado
//     setValue, // Añadido para permitir que el componente controle el valor
//     isRequired,
//     ValorEnviadoCapturadoDesdeElServidor
// }) {
//     const [items, setItems] = useState([]);
//     const OpcionPorDefecto = "SinSeleccionar";

//     const fetchData = async () => {
//         if (!options.length && apiEndpoint) {
//             try {
//                 const response = await axios.get(apiEndpoint);
//                 // console.log("Datos recibidos:", response.data);
//                 setItems(response.data);

//                 const Valores = response.data;
//                 console.log(Valores);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [apiEndpoint]);

//   return (
//     // <Select
//     //   isRequired={isRequired}
//     //   variant="bordered"
//     //   labelPlacement={"outside"}
//     //   placeholder={placeholder}
//     // //   className="max-w-xs"
//     //   className="w-11/12  rounded-md"
//     //   label={label}
//     //   // value={value} // Controla el valor seleccionado desde el estado padre
//     //   // value={value || OpcionPorDefecto} // Controla el valor seleccionado desde el estado padre
//     //   onChange={onChange} // Usar onChange
//     //   defaultSelectedKeys={[OpcionPorDefecto]}
//     // >
//     //   <SelectItem key={OpcionPorDefecto} value={OpcionPorDefecto}>
//     //     Sin Seleccionar
//     //   </SelectItem>
//     //   {/* Usar options si están disponibles, de lo contrario usar items */}
//     //   {(options.length ? options : items).map((item) => (
//     //     <SelectItem key={item.value} value={item.value}>
//     //       {item.text}
//     //     </SelectItem>
//     //   ))}
//     // </Select>

//     <Select
//   isRequired={isRequired}
//   variant="bordered"
//   labelPlacement={"outside"}
//   placeholder={placeholder}
//   className="w-11/12 rounded-md"
//   label={label}
//   value={value} // Controlado por el estado padre
//   onChange={onChange} // Usar el evento de cambio
// defaultSelectedKeys={[OpcionPorDefecto]}
// >
//   <SelectItem key={OpcionPorDefecto} value={OpcionPorDefecto}>
//     Sin Seleccionar
//   </SelectItem>
//   {(options.length ? options : items).map((item) => (
//     <SelectItem key={item.value} value={item.value}>
//       {item.text}
//     </SelectItem>
//   ))}
// </Select>
//   );
// }
// // _________________________________________________________________________________________________

// 777777777777777777777777777777777777777777777777777777777777777777

// import React, { useEffect, useState } from "react";
// import { Select, SelectItem } from "@nextui-org/react";
// import axios from "axios";

// export default function ReutilizarSelect({
//     apiEndpoint,
//     placeholder,
//     label,
//     onChange,
//     options = [],
//     value,
//     setValue,
//     isRequired,
//     ValorEnviadoCapturadoDesdeElServidor
// }) {
//     const [items, setItems] = useState([]);
//     const [valorSeleccionado, setValorSeleccionado] = useState("SinSeleccionar");

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!options.length && apiEndpoint) {
//                 try {
//                     const response = await axios.get(apiEndpoint);
//                     const opciones = response.data;
//                     setItems(opciones);

//                     // Convertimos todo a string para evitar errores de comparación
//                     const valoresDisponibles = opciones.map(item => String(item.value));
//                     const valorServidor = String(ValorEnviadoCapturadoDesdeElServidor);

//                     console.log("Valores disponibles:", valoresDisponibles);
//                     console.log("Valor recibido del servidor:", valorServidor);

//                     if (valoresDisponibles.includes(valorServidor)) {
//                         console.warn("✅ Valor válido encontrado:", valorServidor);
//                         setValorSeleccionado(valorServidor);
//                         setValue(valorServidor);
//                     } else {
//                         console.warn("❌ El valor recibido no está en la lista, usando 'SinSeleccionar'");
//                         setValorSeleccionado("SinSeleccionar");
//                         setValue("SinSeleccionar");
//                     }
//                 } catch (error) {
//                     console.error("Error al obtener datos:", error);
//                 }
//             }
//         };

//         fetchData();
//     }, [apiEndpoint, ValorEnviadoCapturadoDesdeElServidor]);

//     // Efecto adicional para manejar cambios en el value
//     useEffect(() => {
//         if (value) {
//             setValorSeleccionado(String(value));
//         }
//     }, [value]);

//     return (
//         <Select
//             isRequired={isRequired}
//             variant="bordered"
//             labelPlacement="outside"
//             placeholder={placeholder}
//             className="w-11/12 rounded-md"
//             label={label}
//             value={valorSeleccionado} // Usa el estado para controlar la opción seleccionada
//             onChange={(e) => {
//                 const nuevoValor = e.target.value;
//                 setValorSeleccionado(nuevoValor);
//                 setValue(nuevoValor); // Actualiza el estado en el padre
//                 onChange(e); // Llama al onChange externo
//             }}
//         >
//             <SelectItem key="SinSeleccionar" value="SinSeleccionar">
//                 Sin Seleccionar
//             </SelectItem>
//             {(options.length ? options : items).map((item) => (
//                 <SelectItem key={String(item.value)} value={String(item.value)}>
//                     {item.text}
//                 </SelectItem>
//             ))}
//         </Select>
//     );
// }

// 777777777777777777777777777777777777777777777777777777777777777777
import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { servidor, port } from "../../../config/config"; // PARA IMPORTAR LOS VALORES DE LAS VARIABLES SERVIDOR Y PUERTO A TRABAJAR

export default function ReutilizarSelect({
    apiEndpoint,
    // placeholder,
    // label,
    onChange,
    options = [],
    value,
    setValue,
    // isRequired,
    ValorEnviadoCapturadoDesdeElServidor
}) {
    const [items, setItems] = useState([]);
    const [valorSeleccionado, setValorSeleccionado] = useState("");
    const [ValorParaEntidad, SetValorParaEntidad] = useState("");
    const [ValorParaCodigoServicio, SetValorParaCodigoServicio] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!options.length && apiEndpoint) {
                try {
                    if (apiEndpoint === `http://${servidor}:${port}/api/Rips/`)
                    console.log(`
                        SERVIDOR => ${servidor}
                        PUERTO => ${port}    
                    `);
                    const response = await axios.get(apiEndpoint);
                    const opciones = response.data;
                    setItems(opciones);

                    // Convertimos todo a string para evitar errores de comparación
                    const valoresDisponibles = opciones.map(item => String(item.value));
                    const valorServidor = String(ValorEnviadoCapturadoDesdeElServidor);

                    // console.log("Valores disponibles:", valoresDisponibles);
                    console.log("Valor recibido del servidor:", valorServidor);

                    if (valoresDisponibles.includes(valorServidor)) {
                        // console.warn("✅ Valor válido encontrado:", valorServidor);
                        setValorSeleccionado(valorServidor);
                        setValue(valorServidor);
                    } else {
                        // console.warn("❌ El valor recibido no está en la lista, usando 'SinSeleccionar'");
                        setValorSeleccionado("SinSeleccionar");
                        setValue("SinSeleccionar");
                    }
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
            }
        };

        fetchData();
    }, [apiEndpoint, ValorEnviadoCapturadoDesdeElServidor]);

    
    useEffect(() => {
        if (value !== undefined && value !== valorSeleccionado) {
            // console.log("🔄 Actualizando valor seleccionado:", value);
            setValorSeleccionado(String(value));
        }
    }, [value]);

    return (
        <Select
            // isRequired={isRequired}
            variant="bordered"
            labelPlacement="outside"
            // placeholder={placeholder}
            className="w-11/12 rounded-md"
            // label={label}
            selectedKeys={[valorSeleccionado]} // <-- Cambio importante para NextUI
            onChange={(e) => {
                const nuevoValor = e.target.value;
                // console.log("🖱️ Usuario seleccionó:", nuevoValor);
                setValorSeleccionado(nuevoValor);
                setValue(nuevoValor);
                onChange(e);
            }}
        >
            <SelectItem key="SinSeleccionar" value="SinSeleccionar">
                Sin Seleccionar
            </SelectItem>
            {(options.length ? options : items).map((item) => (
                <SelectItem key={String(item.value)} value={String(item.value)}>
                    {item.text}
                </SelectItem>
            ))}
        </Select>
    );
}


// import React, { useEffect, useState } from "react";
// import { Select, SelectItem } from "@nextui-org/react";

// export default function ReutilizarSelect({
//     options = [],
//     placeholder,
//     label,
//     onChange,
//     value,
//     setValue,
//     isRequired,
//     ValorEnviadoCapturadoDesdeElServidor
// }) {
//     const [valorSeleccionado, setValorSeleccionado] = useState("SinSeleccionar");

//     useEffect(() => {
//         if (options.length) {
//             const valoresDisponibles = options.map(item => String(item.value));
//             const valorServidor = String(ValorEnviadoCapturadoDesdeElServidor);

//             console.log("Valores disponibles:", valoresDisponibles);
//             console.log("Valor recibido del servidor:", valorServidor);

//             if (valoresDisponibles.includes(valorServidor)) {
//                 console.warn("✅ Valor válido encontrado:", valorServidor);
//                 setValorSeleccionado(valorServidor);
//                 setValue(valorServidor);
//             } else {
//                 console.warn("❌ El valor recibido no está en la lista, usando 'SinSeleccionar'");
//                 setValorSeleccionado("SinSeleccionar");
//             }
//         }
//     }, [options, ValorEnviadoCapturadoDesdeElServidor]);

//     return (
//         <Select
//             isRequired={isRequired}
//             variant="bordered"
//             labelPlacement="outside"
//             placeholder={placeholder}
//             className="w-11/12 rounded-md"
//             label={label}
//             value={valorSeleccionado} 
//             onChange={(e) => {
//                 const nuevoValor = e.target.value;
//                 setValorSeleccionado(nuevoValor);
//                 setValue(nuevoValor); 
//                 onChange(e); 
//             }}
//         >
//             <SelectItem key="SinSeleccionar" value="SinSeleccionar">
//                 Sin Seleccionar
//             </SelectItem>
//             {options.map((item) => (
//                 <SelectItem key={String(item.value)} value={String(item.value)}>
//                     {item.text}
//                 </SelectItem>
//             ))}
//         </Select>
//     );
// }
