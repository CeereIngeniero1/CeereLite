import { Router } from 'express';
import { sql, poolPromise } from '../../db.js'; 

const router = Router();

router.get('/HC/:documento', async (req, res) => {
    const { documento } = req.params;

    try {
        const pool = await poolPromise; // Obtén el pool de conexiones

        const result = await pool.request()
            .input('documento', sql.NVarChar, documento)
            .query(`SELECT en.[Nombre Completo Entidad] as [Nombre Paciente], en.[Documento Entidad] as [Documento Paciente], 
                en2.[Dirección EntidadII] as [Direccion Paciente], Ciudad.[Id Ciudad], Ciudad.Ciudad,  
                en2.[Teléfono Celular EntidadII] as [Celular Paciente], 
                CONVERT(DATE, en3.[Fecha Nacimiento EntidadIII], 101) as [Fecha Nacimiento Paciente], en3.[Edad EntidadIII] 
                as [Edad Paciente], en3.[Id Unidad de Medida Edad], ume.[Descripción Unidad de Medida Edad], Sexo.[Id Sexo], Sexo.[Descripción Sexo] as Sexo, en3.[Id Estado Civil], esc.[Estado Civil], 
                ocu.[Id Ocupación], ocu.Ocupación, en24.[Id Tipo de Afiliado], tpa.[Descripción Tipo de Afiliado], 
                en24.[Documento Entidad Prepago] as [Documento EPS], en3.[Acompañante EntidadIII] as [Nombre Responsable], en3.[Id Parentesco], en3.[Tel Acompañante EntidadIII] as [Teléfono Responsable]
            FROM Entidad as en
            LEFT JOIN EntidadII as en2 ON en.[Documento Entidad] = en2.[Documento Entidad]
            LEFT JOIN EntidadIII as en3 ON en.[Documento Entidad] = en3.[Documento Entidad]
            INNER JOIN Ciudad ON en2.[Id Ciudad] = Ciudad.[Id Ciudad]
            LEFT JOIN Sexo ON en3.[Id Sexo] = Sexo.[Id Sexo]
            LEFT JOIN [Estado Civil] as esc ON en3.[Id Estado Civil] = esc.[Id Estado Civil]
            LEFT JOIN EntidadVI as en6 ON en.[Documento Entidad] = en6.[Documento Entidad]
            INNER JOIN Ocupación as ocu ON en6.[Id Ocupación] = ocu.[Id Ocupación]
            LEFT JOIN EntidadXXIV as en24 ON en.[Documento Entidad] = en24.[Documento Entidad]
            INNER JOIN [Tipo de Afiliado] as tpa ON en24.[Id Tipo de Afiliado] = tpa.[Id Tipo de Afiliado]
            LEFT JOIN Entidad as enr ON en3.[Documento Responsable] = enr.[Documento Entidad]
            LEFT JOIN [Unidad de Medida Edad] as ume ON en3.[Id Unidad de Medida Edad] = ume.[Id Unidad de Medida Edad]
            WHERE en.[Documento Entidad] = @documento`);

        const pacientesData = result.recordset.map(row => ({
            nombrePaciente: row['Nombre Paciente'],
            documentoPaciente: row['Documento Paciente'],
            direccionPaciente: row['Direccion Paciente'],
            idListaCiudad: row['Id Ciudad'],
            ciudadPaciente: row['Ciudad'],
            celularPaciente: row['Celular Paciente'],
            nacimientoPaciente: row['Fecha Nacimiento Paciente'].toISOString().split('T')[0],
            edadPaciente: row['Edad Paciente'],
            idUnidad: row['Id Unidad de Medida Edad'],
            nombreUnidad: row['Descripción Unidad de Medida Edad'],                
            idSexoPaciente: row['Id Sexo'],
            sexoPaciente: row['Sexo'],
            idEstadoCivil: row['Id Estado Civil'],
            estadoCivilPaciente: row['Estado Civil'],
            idOcupacion: row['Id Ocupación'],
            ocupacionPaciente: row['Ocupación'],
            documentoAseguradora: row['Documento EPS'],
            idTipoAfiliado: row['Id Tipo de Afiliado'],
            idParentescoResponsable: row['Id Parentesco'],
            nombreResponsable: row['Nombre Responsable'],
            telefonoResponsable: row['Teléfono Responsable']
        }));

        res.json(pacientesData);

    } catch (err) {
        console.error('Error al ejecutar la consulta de HC:', err.message);
        res.status(500).json({ error: 'Error al obtener datos de HC' });
    }
});

export default router;
