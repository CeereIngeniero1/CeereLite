import { sql, poolPromise } from '../../db.js';
import { Router } from 'express';

const router = Router();

const FormatearCompromiso = (fechaObj) => {
    const { year, month, day } = fechaObj;
    const ano = String(year).padStart(2, '0');
    const mes = String(month).padStart(2, '0');
    const dia = String(day).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

router.post('/insertarCompromiso', async (req, res) => {
    const { fechaCompromiso, horaInicio, horaFin, asunto, profesional, tipoAtencion, pacienteId, docEmpresa } = req.body;

    // Validaciones del backend
    if (!fechaCompromiso || !horaInicio || !horaFin || !asunto || !profesional || !tipoAtencion || !pacienteId) {
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    try {
        // Convertir la fecha y horas
        const formattedHoraInicio = `1899-12-30T${horaInicio.hour.toString().padStart(2, '0')}:${horaInicio.minute.toString().padStart(2, '0')}:00.000`;
        const formattedHoraFin = `1899-12-30T${horaFin.hour.toString().padStart(2, '0')}:${horaFin.minute.toString().padStart(2, '0')}:00.000`;

        const Fecha = FormatearCompromiso(fechaCompromiso);

        const pool = await poolPromise;

        await pool.request()
            .input('FechaCompromiso', sql.VarChar, Fecha)
            .input('HoraInicio', sql.VarChar, formattedHoraInicio)
            .input('HoraFin', sql.VarChar, formattedHoraFin)
            .input('Asunto', sql.NVarChar, asunto)
            .input('Profesional', sql.NVarChar, profesional)
            .input('TipoAtencion', sql.Int, tipoAtencion)
            .input('PacienteId', sql.NVarChar, pacienteId)
            .input('docEmpresa', sql.NVarChar, docEmpresa)
            .query(`
                INSERT INTO CompromisoVI 
                ([Entidad Principal], [Entidad Responsable], [Entidad Atendida], [Entidad Que Atendio], [Descripción CompromisoIV], 
                [Fecha Inicio CompromisoVI], [Fecha Fin CompromisoVI], [Hora Inicio CompromisoVI], [Hora Fin CompromisoVI], 
                [Id Tipo Compromiso], [Id Etiqueta Compromiso], [Id Entidad Que Atendio], [Id Fecha Real Atención], 
                [Fecha Real Atención CompromisoVI], [Hora Real Atención CompromisoVI], [Id Recordatorio], [Id Aviso Compromiso], 
                [Fecha Aviso CompromisoVI], [Hora Aviso CompromisoVI], [Id Estado], [Documento Personal], [Documento Empresa], 
                [Id Plan de Tratamiento], [Nro Autorización], [Id Plan de Tratamiento Tratamientos], [FechaHoraRegistropte]) 
                VALUES 
                (@Profesional, @Profesional, @PacienteId, @Profesional, @Asunto, @FechaCompromiso, @FechaCompromiso, 
                @HoraInicio, @HoraFin, @TipoAtencion, 1, 1, 1, @FechaCompromiso, 
                @HoraInicio, 29, 29, @FechaCompromiso, @HoraInicio, 58, 
                @Profesional, @docEmpresa, 0, 0, 0, @FechaCompromiso)
            `);

        res.status(200).send("Compromiso agendado exitosamente");
    } catch (error) {
        console.error('Error al insertar el compromiso:', error);
        res.status(500).send("Error al agendar el compromiso");
    }
});

export default router;
