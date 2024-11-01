import { Router } from 'express';
import { sql, poolPromise } from '../../db.js';

const router = Router();

// Insertar un registro
router.post('/insert', async (req, res) => {
    try {
        const { tipoRips, entidad, modalidadAtencion, grupoServicios, servicios, finalidadConsulta, finalidadProcedimiento, causaExterna, tipoDiag, viaIngreso, codigoProcedimiento, codigoDiagnostico } = req.body;

        // console.log('Datos recibidos:', req.body);
        const pool = await poolPromise;
        const result = await pool.request()
            .input('TipoRips', sql.Int, tipoRips)
            .input('Entidad', sql.VarChar, entidad)
            .input('modalidadAtencion', sql.Int, modalidadAtencion)
            .input('GrupoServicio', sql.Int, grupoServicios)
            .input('Servicio', sql.Int, servicios)
            .input('finalidadConsulta', sql.Int, finalidadConsulta)
            .input('finalidadProcedimiento', sql.Int, finalidadProcedimiento)
            .input('CausaExterna', sql.Int, causaExterna)
            .input('TipoDiagPrincipal', sql.Int, tipoDiag)
            .input('ViaIngreso', sql.Int, viaIngreso)
            .input('codigoProcedimiento', sql.VarChar, codigoProcedimiento)
            .input('codigoDiagnostico', sql.VarChar, codigoDiagnostico)
            .query(`
                INSERT INTO [RIPS Por Defecto] 
                ([Tipo de Rips], Entidad, [Modalidad Atencion], [Grupo Servicio], [Servicio], [Finalidad Consulta], [Finalidad Procedimiento], [Causa Externa], [Tipo Diag Principal], [Via Ingreso], CUPS, CIE) 
                VALUES (@TipoRips, @Entidad, @modalidadAtencion, @GrupoServicio, @Servicio, @finalidadConsulta, @finalidadProcedimiento, @CausaExterna, @TipoDiagPrincipal, @ViaIngreso, @codigoProcedimiento, @codigoDiagnostico)
            `);

        res.status(201).json({ message: 'Registro insertado correctamente', data: result });
    } catch (error) {
        console.error('Error al insertar:', error);
        res.status(500).json({ message: 'Error al insertar el registro', error });
    }
});

// Actualizar un registro
router.put('/update', async (req, res) => {
    try {
        const { tipoRips, entidad, modalidadAtencion, grupoServicios, servicios, finalidadConsulta, finalidadProcedimiento, causaExterna, tipoDiag, viaIngreso, codigoProcedimiento, codigoDiagnostico } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('TipoRips', sql.Int, tipoRips)
            .input('Entidad', sql.VarChar, entidad)
            .input('modalidadAtencion', sql.Int, modalidadAtencion)
            .input('GrupoServicio', sql.Int, grupoServicios)
            .input('Servicio', sql.Int, servicios)
            .input('finalidadConsulta', sql.Int, finalidadConsulta)
            .input('finalidadProcedimiento', sql.Int, finalidadProcedimiento)
            .input('CausaExterna', sql.Int, causaExterna)
            .input('TipoDiagPrincipal', sql.Int, tipoDiag)
            .input('ViaIngreso', sql.Int, viaIngreso)
            .input('codigoProcedimiento', sql.VarChar, codigoProcedimiento)
            .input('codigoDiagnostico', sql.VarChar, codigoDiagnostico)
            .query(`
                UPDATE [RIPS Por Defecto] 
                SET 
                    [Tipo de Rips] = @TipoRips,
                    Entidad = @Entidad,
                    [Modalidad Atencion] = @ModalidadAtencion,
                    [Grupo Servicio] = @GrupoServicio,
                    [Servicio] = @Servicio,
                    [Finalidad Consulta] = @finalidadConsulta,
                    [Finalidad Procedimiento] = @finalidadProcedimiento,
                    [Causa Externa] = @CausaExterna,
                    [Tipo Diag Principal] = @TipoDiagPrincipal,
                    [Via Ingreso] = @ViaIngreso,
                    CUPS = @codigoProcedimiento,
                    CIE = @codigoDiagnostico
                WHERE [Tipo de Rips] = @TipoRips
            `);

        res.status(200).json({ message: 'Registro actualizado correctamente', data: result });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ message: 'Error al actualizar el registro', error });
    }
});

// Eliminar un registro
router.delete('/delete', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`DELETE FROM [RIPS Por Defecto]`); // Elimina todos los registros de la tabla

        res.status(200).json({ message: 'Todos los registros eliminados correctamente', data: result });
    } catch (error) {
        console.error('Error al eliminar todos los registros:', error);
        res.status(500).json({ message: 'Error al eliminar los registros', error });
    }
});

// Verificar si un registro ya existe
router.get('/exists', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT COUNT(*) as count FROM [RIPS Por Defecto]`);

        const exists = result.recordset[0].count > 0; // true si hay registros, false si no
        res.status(200).json({ exists });
    } catch (error) {
        console.error('Error al verificar la tabla:', error);
        res.status(500).json({ message: 'Error al verificar la existencia del registro', error });
    }
});



export default router;
