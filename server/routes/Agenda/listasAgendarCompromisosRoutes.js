import { Router } from 'express';
import { poolPromise } from '../../db.js'; // Importamos poolPromise para la conexión de base de datos

const router = Router();

router.get('/agenda/profesionales', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtenemos una conexión de la piscina
        const result = await pool.request()
            .query(`SELECT dbo.Entidad.[Documento Entidad] AS [Documento profesional], 
                    dbo.Entidad.[Nombre Completo Entidad] AS [Nombre del Profesional]
                    FROM dbo.Entidad 
                    INNER JOIN dbo.[Función Por Entidad] 
                    ON dbo.Entidad.[Documento Entidad] = dbo.[Función Por Entidad].[Documento Entidad]
                    WHERE dbo.[Función Por Entidad].[Id Función] = 17`);

        const listaProfesionalesData = result.recordset.map(row => ({
            value: row['Documento profesional'],
            text: row['Nombre del Profesional']
        }));

        console.log(`Consulta de Profesionales al asignar cita ejecutada con éxito. Filas afectadas: ${result.rowsAffected}`);
        res.json(listaProfesionalesData);
    } catch (err) {
        console.error('Error al ejecutar la consulta que trae las listas de los Profesionales al asignar cita:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Profesionales al asignar cita' });
    }
});

router.get('/agenda/tipoAtencion', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtenemos una conexión de la piscina
        const result = await pool.request()
            .query(`SELECT [Id Tipo Compromiso] AS IdTipoCompromiso, 
                    [Tipo Compromiso] AS TipoCompromiso
                    FROM [Tipo Compromiso]`);

        const listaTiposAtencionData = result.recordset.map(row => ({
            value: row['IdTipoCompromiso'],
            text: row['TipoCompromiso']
        }));

        res.json(listaTiposAtencionData);
    } catch (err) {
        console.error('Error al ejecutar la consulta que trae las listas de los Tipos de Atención:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de Tipos de Atención' });
    }
});

// Ruta para verificar disponibilidad del horario
router.get('/agenda/compromisoDisponible', async (req, res) => {
    const { fecha, profesional, horaInicio, horaFin } = req.query;

    try {
        const query = `
            SELECT 
                [Fecha Inicio CompromisoVI] AS fecha, 
                [Hora Inicio CompromisoVI] AS horaInicio,
                [Hora Fin CompromisoVI] AS horaFin 
            FROM CompromisoVI 
            WHERE CONVERT(DATE, [Fecha Inicio CompromisoVI], 120) = @fecha 
            AND [Entidad Principal] = @profesional
            AND (
                (CONVERT(TIME, [Hora Inicio CompromisoVI], 120) < @horaFin AND CONVERT(TIME, [Hora Fin CompromisoVI], 120) > @horaInicio)
            )
        `;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('fecha', fecha)
            .input('profesional', profesional)
            .input('horaInicio', horaInicio)
            .input('horaFin', horaFin)
            .query(query);

        const compromisos = result.recordset;

        if (compromisos.length > 0) {
            res.json({ disponible: false });
        } else {
            res.json({ disponible: true });
        }
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ error: "Error al verificar la disponibilidad" });
    }
});

router.get('/disponibilidad', async (req, res) => {

    const { fecha, profesional } = req.query;

    try {
        // Realiza la consulta a tu base de datos para obtener los compromisos del profesional en la fecha dada
        const query = `
            SELECT 
                [Fecha Inicio CompromisoVI] AS fecha, 
                [Hora Inicio CompromisoVI] AS horaInicio,
                [Hora Fin CompromisoVI] AS horaFin 
            FROM CompromisoVI 
            WHERE CONVERT(DATE, [Fecha Inicio CompromisoVI], 120) = @fecha 
            AND [Entidad Principal] = @profesional
            ORDER BY [Hora Inicio CompromisoVI]
        `;

        // Usa poolPromise para la conexión a la base de datos
        const pool = await poolPromise;
        const result = await pool.request()
            .input('fecha', fecha)
            .input('profesional', profesional)
            .query(query);

        const compromisos = result.recordset;

        // Filtra las horas que ya están ocupadas
        const disponibilidad = generarDisponibilidad(compromisos, fecha);

        res.json(disponibilidad);
    } catch (error) {
        console.error("Error fetching disponibilidad:", error);
        res.status(500).json({ error: "Error al obtener la disponibilidad" });
    }
});

function generarDisponibilidad(compromisos, fecha) {
    // Rango de horas de trabajo (6:00 AM a 12:00 AM)
    const horaInicioTrabajo = 6; // 6:00 AM
    const horaFinTrabajo = 24; // 12:00 AM (medianoche)
    const intervaloMinutos = 15; // Intervalo de 15 minutos

    // Crear un array con todas las horas disponibles del día en intervalos de 15 minutos
    const horasDelDia = [];
    for (let hora = horaInicioTrabajo; hora < horaFinTrabajo; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervaloMinutos) {
            const horaInicio = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
            const siguienteMinuto = minuto + intervaloMinutos;
            const horaFin = siguienteMinuto < 60 
                ? `${hora.toString().padStart(2, '0')}:${siguienteMinuto.toString().padStart(2, '0')}`
                : `${(hora + 1).toString().padStart(2, '0')}:00`; // Cambia la hora si se excede el minuto

            horasDelDia.push({ horaInicio, horaFin });
        }
    }

    // Filtrar las horas ocupadas
    const disponibilidad = horasDelDia.filter((horaDisponible) => {
        // Verificar si el intervalo actual está ocupado
        const estaOcupado = compromisos.some((compromiso) => {
            const compromisoInicio = compromiso.horaInicio.toISOString().split('T')[1].substring(0, 5); // Extraer la hora de inicio
            const compromisoFin = compromiso.horaFin.toISOString().split('T')[1].substring(0, 5); // Extraer la hora de fin

            // Verificar si la hora disponible se solapa con algún compromiso existente
            return (
                (horaDisponible.horaInicio >= compromisoInicio && horaDisponible.horaInicio < compromisoFin) ||
                (horaDisponible.horaFin > compromisoInicio && horaDisponible.horaFin <= compromisoFin)
            );
        });

        return !estaOcupado; // Solo retorna las horas que no están ocupadas
    });

    // Agregar la fecha a cada intervalo de disponibilidad
    return disponibilidad.map(intervalo => ({
        fecha: fecha, // Incluye la fecha aquí
        ...intervalo
    }));
}


export default router;
