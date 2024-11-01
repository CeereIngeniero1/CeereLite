Main.jsx ->

const handleSelectChangeHC = async (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    setIdEvaluacion('');
    set


    console.log('el valor es:' + selectedValue)

    // Determinar la URL correcta según el valor seleccionado
    const url = selectedValue === '2'
        ? `http://${servidor}:${port}/api/formulas/${documentoPaciente}`
        : `http://${servidor}:${port}/api/evoluciones/${documentoPaciente}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTipoHC(selectedValue === '2' ? 'Fórmula Médica' : 'Evolución');
        // Aquí podrías hacer algo con los datos obtenidos, si es necesario

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

Sidebar.jsx ->

    useEffect(() => {
        const fetchData = async () => {
            if (!documentoPaciente) return;

            try {
                // Obtener evoluciones o fórmulas
                try {
                    const url = tipoHC === 'Fórmula Médica'
                        ? `http://${servidor}:${port}/api/formulas/${documentoPaciente}`
                        : `http://${servidor}:${port}/api/evoluciones/${documentoPaciente}`;

                    const responseEvoluciones = await fetch(url);
                    if (responseEvoluciones.ok) {
                        const dataEvoluciones = await responseEvoluciones.json();
                        setEvoluciones(dataEvoluciones);
                    } else {
                        console.warn('No se pudo obtener evoluciones o fórmulas');
                    }
                } catch (error) {
                    console.error('Error fetching evoluciones o fórmulas:', error);
                }

                // Obtener atención reciente
                try {
                    const responseAtencion = await fetch(`http://${servidor}:${port}/api/atencion-reciente/${documentoPaciente}`);
                    if (responseAtencion.ok) {
                        const dataAtencion = await responseAtencion.json();
                        if (dataAtencion.fecha) {
                            setAtencionReciente(dataAtencion);
                        } else {
                            console.warn('No se encontró la fecha de atención reciente');
                        }
                    } else {
                        console.warn('No se pudo obtener atención reciente');
                    }
                } catch (error) {
                    console.error('Error fetching atención reciente:', error);
                }

                // Obtener nombre del paciente
                try {
                    const responseNamePaciente = await fetch(`http://${servidor}:${port}/api/nombre-paciente/${documentoPaciente}`);
                    if (responseNamePaciente.ok) {
                        const dataNombre = await responseNamePaciente.json();
                        setNamePaciente(dataNombre.nombrePaciente || '');
                    } else {
                        console.warn('No se pudo obtener el nombre del paciente');
                    }
                } catch (error) {
                    console.error('Error fetching nombre paciente:', error);
                }

                // Obtener primera atención
                try {
                    const responsePrimera = await fetch(`http://${servidor}:${port}/api/atencion-primera/${documentoPaciente}`);
                    if (responsePrimera.ok) {
                        const dataPrimera = await responsePrimera.json();
                        if (dataPrimera.fecha) {
                            setPrimeraAtencion(dataPrimera);
                        } else {
                            console.warn('No se encontró la fecha de la primera atención');
                        }
                    } else {
                        console.warn('No se pudo obtener la primera atención');
                    }
                } catch (error) {
                    console.error('Error fetching primera atención:', error);
                }

                // Cargar imagen usando el objeto Image
                const imagenUrl = `http://${servidor}:${port}/api/imagenes/${documentoPaciente}`;
                const formatos = ['jpg', 'jpeg', 'png', 'gif'];
                let imagenValida = false;

                for (const formato of formatos) {
                    const url = `${imagenUrl}.${formato}`;
                    const img = new Image();
                    img.src = url;

                    // Controlador para cuando la imagen se carga correctamente
                    img.onload = () => {
                        setImagenSrc(url);
                        imagenValida = true;
                    };

                    // Controlador para cuando la imagen falla al cargar
                    img.onerror = () => {
                        if (!imagenValida && formato === formatos[formatos.length - 1]) {
                            // Si después de probar todos los formatos no se encuentra una imagen válida
                            setImagenSrc(`http://${servidor}:${port}/api/imagenes/AvatarPorDefecto.png`);
                        }
                    };
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [documentoPaciente, tipoHC]);

const handleEvolucionClick = (idEvaluacion) => {
    setIdEvaluacion(idEvaluacion);
};

return (
    <div className="evolucionGroup">
        {evoluciones.length > 0 ? (
            evoluciones.map((evolucion) => (
                <div key={evolucion.idEvolucion} onClick={() => handleEvolucionClick(evolucion.idEvolucion)}>
                    <h4>{tipoHC === 'Fórmula Médica' ? 'Fórmula Médica' : 'Evolución'}</h4>
                    <span>{`${evolucion.pacienteEvolucion} - ${format(parseISO(evolucion.fechaEvolucion), 'dd/MM/yyyy')}`}</span>
                </div>
            ))
        ) : (
            <p>No hay evoluciones disponibles.</p>
        )}
    </div>
)
