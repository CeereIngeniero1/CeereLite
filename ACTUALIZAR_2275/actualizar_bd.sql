USE CeereSio;
GO

BEGIN TRY
    ALTER TABLE [Evaluación Entidad Rips]
    ADD [Id Factura] int NULL;
    PRINT 'Columna [Id Factura] agregada exitosamente a la tabla [Evaluación Entidad Rips].';
END TRY
BEGIN CATCH
    PRINT 'Error al agregar la columna [Id Factura]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    -- Agregar columnas a la tabla Evaluación Entidad
    ALTER TABLE [Evaluación Entidad]
    ADD 
        [Con Orden] BIT NULL  DEFAULT 0,  -- 0 o False como valor por defecto
        [Firma Evaluación Entidad] NVARCHAR(MAX) NULL,
        [Sincronizado] BIT NULL  DEFAULT 0,  -- 0 o False como valor por defecto
        [PreguntarControl] BIT NULL  DEFAULT 0,  -- 0 o False como valor por defecto
        [NombreFormatoAux] NVARCHAR(100) NULL;
        
    -- Si se ejecuta correctamente
    PRINT 'Columnas de [Evaluación Entidad] agregadas exitosamente.';
    
END TRY
BEGIN CATCH
    -- Captura del error
    PRINT 'Error al agregar columnas en [Evaluación Entidad]:';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    INSERT INTO [dbo].[Vía de Ingreso] ([Código Vía de Ingreso], [Vía de Ingreso], [Descripción Vía de Ingreso], [Orden Vía de Ingreso], [Id Estado])
    VALUES
        (NULL, '3', 'Remitido',  1, 7),
        (NULL, '4', 'Nacido en la Institución', 1, 7);
    PRINT 'Datos insertados en la tabla [Vía de Ingreso].';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en [Vía de Ingreso]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    ALTER TABLE [Evaluación Entidad]
    ALTER COLUMN [Firma Evaluación Entidad] NVARCHAR(MAX);
    PRINT 'Campo [Firma Evaluación Entidad] Actualizado correctamente.';
END TRY
BEGIN CATCH
    PRINT 'Error al actualizar [Firma Evaluación Entidad] ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    UPDATE País 
    SET País = 170
    WHERE [Descripción País] = 'Colombia';
    PRINT 'Datos del país actualizados en la tabla [País].';
END TRY
BEGIN CATCH
    PRINT 'Error al actualizar datos en [País]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    UPDATE Ciudad 
    SET [Código Ciudad] = '05001'
    WHERE Ciudad = 'Medellín';
    PRINT 'Datos del municipio actualizados en la tabla [Ciudad].';
END TRY
BEGIN CATCH
    PRINT 'Error al actualizar datos en [Ciudad]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    UPDATE [Zona Residencia] 
    SET [Código Zona Residencia] = 01
    WHERE [Descripción Zona Residencia] = 'Rural';
    PRINT 'Datos de la zona de residencia [Rural] actualizados en la tabla [Zona Residencia].';
END TRY
BEGIN CATCH
    PRINT 'Error al actualizar datos de la zona [Rural]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    UPDATE [Zona Residencia] 
    SET [Código Zona Residencia] = 02
    WHERE [Descripción Zona Residencia] = 'Urbana';
    PRINT 'Datos de la zona de residencia [Urbana] actualizados en la tabla [Zona Residencia].';
END TRY
BEGIN CATCH
    PRINT 'Error al actualizar datos de la zona [Urbana]: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
	ALTER TABLE Empresa
	ADD NroIDPrestador NVARCHAR(50) NULL;
	PRINT 'Columna NroIDPrestador agregado correctamente, NO OLVIDE AGREGAR EL NÚMERO DE SU EMPRESA EN LA BASE DE DATOOS';
END TRY
BEGIN CATCH
	PRINT 'Error al insertar la columna NroIDPrestador: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
-- CREAR TABLA VIA INGRESO USUARIO
CREATE TABLE [dbo].[RIPS Via Ingreso Usuario](
    [Id Via Ingreso Usuario] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Codigo] [nvarchar](50) NULL,
    [Nombre Via Ingreso Usuario] [nvarchar](100) NULL,
    [Descripción Via Ingreso Usuario] [nvarchar](200) NULL,
    [Orden Via Ingreso Usuario] [int] NULL,
    [Id Estado] [int] NULL
);
	PRINT 'Tabla de RIPS Via Ingreso Usuario creada exitosamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la tabla RIPS Via Ingreso Usuario: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY
    -- Insertar solo si no existe el registro con el mismo 'Codigo'
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '01')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('01', 'Demanda espontánea', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '02')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('02', 'Derivado de consulta externa', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '03')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('03', 'Derivado de urgencias', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '04')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('04', 'Derivado de hospitalización', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '05')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('05', 'Derivado de sala de cirugía', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '06')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('06', 'Derivado de sala de partos', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '07')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('07', 'Recién nacido en la institución', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '08')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('08', 'Recién nacido en otra institución', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '09')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('09', 'Derivado o referido de hospitalización domiciliaria', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '10')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('10', 'Derivado de atención domiciliaria', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '11')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('11', 'Derivado de telemedicina', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '12')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('12', 'Derivado de jornada de salud', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '13')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('13', 'Referido de otra institución', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Via Ingreso Usuario] WHERE [Codigo] = '14')
    BEGIN
        INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
        VALUES ('14', 'Contrarreferido de otra institución', NULL, 1, 7);
    END

    PRINT 'Datos insertados en RIPS Via Ingreso Usuario correctamente';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en la tabla RIPS Via Ingreso Usuario: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
-- CREAR TABLA VIA MODALIDAD ATENCIÓN
CREATE TABLE [dbo].[RIPS Modalidad Atención](
    [Id Modalidad Atencion] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Codigo] [nvarchar](50) NULL,
    [Nombre Modalidad Atencion] [nvarchar](100) NULL,
    [Descripción Modalidad Atencion] [nvarchar](200) NULL,
    [Orden Modalidad Atencion] [int] NULL CONSTRAINT [DF_ModalidadAtencion_OrdenModalidadAtencion] DEFAULT (1),
    [Id Estado] [int] NULL CONSTRAINT [DF_ModalidadAtencion_IdEstado] DEFAULT (7)
);
	PRINT 'Tabla de RIPS Modalidad Atención creada exitosamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la tabla RIPS Modalidad Atención: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    -- Insertar solo si no existe el registro con el mismo 'Codigo'
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '01')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('01', 'Intramural', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '02')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('02', 'Extramural unidad móvil', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '03')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('03', 'Extramural domiciliaria', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '04')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('04', 'Extramural jornada de salud', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '06')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('06', 'Telemedicina interactiva', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '07')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('07', 'Telemedicina no interactiva', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '08')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('08', 'Telemedicina telexperticia', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Modalidad Atención] WHERE [Codigo] = '09')
    BEGIN
        INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
        VALUES ('09', 'Telemedicina telemonitoreo', NULL, 1, 7);
    END

    PRINT 'Datos insertados en RIPS Modalidad Atención correctamente';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en la tabla RIPS Modalidad Atención: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
-- CREAR TABLA GRUPO DE SERVICIOS
CREATE TABLE [dbo].[RIPS Grupo Servicios](
    [Id Grupo Servicios] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Codigo] [nvarchar](50) NULL,
    [Nombre Grupo Servicios] [nvarchar](100) NULL,
    [Descripción Grupo Servicios] [nvarchar](200) NULL,
    [Orden Grupo Servicios] [int] NULL DEFAULT (1),
    [Id Estado] [int] NULL DEFAULT (7)
);
	PRINT 'Tabla de RIPS Grupo Servicios creada exitosamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la tabla RIPS Grupo Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    -- Insertar solo si no existe el registro con el mismo 'Codigo'
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Grupo Servicios] WHERE [Codigo] = '01')
    BEGIN
        INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
        VALUES ('01', 'Consulta externa', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Grupo Servicios] WHERE [Codigo] = '02')
    BEGIN
        INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
        VALUES ('02', 'Apoyo diagnóstico y complementación terapéutica', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Grupo Servicios] WHERE [Codigo] = '03')
    BEGIN
        INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
        VALUES ('03', 'Internación', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Grupo Servicios] WHERE [Codigo] = '04')
    BEGIN
        INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
        VALUES ('04', 'Quirúrgico', NULL, 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Grupo Servicios] WHERE [Codigo] = '05')
    BEGIN
        INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
        VALUES ('05', 'Atención inmediata', NULL, 1, 7);
    END

    PRINT 'Datos insertados en RIPS Grupo Servicios correctamente';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en la tabla RIPS Grupo Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
-- CREAR TABLA SERVICIOS QUE CORRESPONDE AL CODSERVICIO QUE ES UN CAMPO DE LOS RIPS
CREATE TABLE [dbo].[RIPS Servicios](
	[Id Servicios] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[Código Servicios] [nvarchar](20) NULL,
	[Nombre Servicios] [nvarchar](500) NULL,
	[Descripción Servicios] [nvarchar](100) NULL,
	[Id Estado] [INT] NULL DEFAULT (7)
	)
	PRINT 'Tabla de RIPS Servicios creada exitosamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la tabla RIPS Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '105')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('105', 'CUIDADO INTERMEDIO NEONATAL', 'INTERNACION', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '106')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('106', 'CUIDADO INTERMEDIO PEDIATRICO', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '107')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('107', 'CUIDADO INTERMEDIO ADULTOS', 'INTERNACION', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '108')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('108', 'CUIDADO INTENSIVO NEONATAL', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '109')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('109', 'CUIDADO INTENSIVO PEDIATRICO', 'INTERNACION', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '110')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('110', 'CUIDADO INTENSIVO ADULTOS', 'INTERNACION', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '1101')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('1101', 'ATENCION DEL PARTO', 'ATENCION INMEDIATA', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '1102')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('1102', 'URGENCIAS', 'ATENCION INMEDIATA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '1103')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('1103', 'TRANSPORTE ASISTENCIAL BASICO', 'ATENCION INMEDIATA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '1104')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('1104', 'TRANSPORTE ASISTENCIAL MEDICALIZADO', 'ATENCION INMEDIATA', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '1105')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('1105', 'ATENCION PREHOSPITALARIA', 'ATENCION INMEDIATA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '120')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('120', 'CUIDADO BASICO NEONATAL', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '129')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('129', 'HOSPITALIZACION ADULTOS', 'INTERNACION', 7);
        END
    
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '130')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('130', 'HOSPITALIZACION PEDIATRICA', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '131')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('131', 'HOSPITALIZACION EN SALUD MENTAL', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '132')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('132', 'HOSPITALIZACION PARCIAL', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '133')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('133', 'HOSPITALIZACION PACIENTE CRONICO CON VENTILADOR', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '134')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('134', 'HOSPITALIZACION PACIENTE CRONICO SIN VENTILADOR', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '135')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('135', 'HOSPITALIZACION EN  CONSUMO DE SUSTANCIAS PSICOACTIVAS', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '138')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('138', 'CUIDADO BASICO DEL CONSUMO DE SUSTANCIAS PSICOACTIVAS', 'INTERNACION', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '201')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('201', 'CIRUGIA DE CABEZA Y CUELLO', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '202')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('202', 'CIRUGIA CARDIOVASCULAR', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '203')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('203', 'CIRUGIA GENERAL', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '204')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('204', 'CIRUGIA GINECOLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '205')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('205', 'CIRUGIA MAXILOFACIAL', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '207')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('207', 'CIRUGIA ORTOPEDICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '208')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('208', 'CIRUGIA OFTALMOLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '209')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('209', 'CIRUGIA OTORRINOLARINGOLOGIA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '210')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('210', 'CIRUGIA ONCOLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '211')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('211', 'CIRUGIA ORAL', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '212')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('212', 'CIRUGIA PEDIATRICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '213')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('213', 'CIRUGIA PLASTICA Y ESTETICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '214')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('214', 'CIRUGIA VASCULAR Y ANGIOLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '215')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('215', 'CIRUGIA UROLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '215')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('215', 'CIRUGIA UROLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '217')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('217', 'OTRAS CIRUGIAS', 'QUIRURGICOS', 7);
        END
        
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '218')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('218', 'CIRUGIA ENDOVASCULAR NEUROLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '227')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('227', 'CIRUGIA ONCOLOGICA PEDIATRICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '231')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('231', 'CIRUGIA DE LA MANO', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '232')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('232', 'CIRUGIA DE MAMA Y TUMORES TEJIDOS BLANDOS', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '233')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('233', 'CIRUGIA DE TORAX', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '234')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('234', 'CIRUGIA DE TORAX', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '235')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('235', 'CIRUGIA GASTROINTESTINAL', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '237')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('237', 'CIRUGIA PLASTICA ONCOLOGICA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '245')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('245', 'NEUROCIRUGIA', 'QUIRURGICOS', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '301')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('301', 'ANESTESIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '302')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('302', 'CARDIOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '303')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('303', 'CIRUGIA CARDIOVASCULAR', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '304')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('304', 'CIRUGIA GENERAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '306')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('306', 'CIRUGIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '308')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('308', 'DERMATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '309')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('309', 'DOLOR Y CUIDADOS PALIATIVOS', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '310')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('310', 'ENDOCRINOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '311')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('311', 'ENDODONCIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '312')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('312', 'ENFERMERIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '313')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('313', 'ESTOMATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '316')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('316', 'GASTROENTEROLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '317')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('317', 'GENETICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '318')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('318', 'GERIATRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '320')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('320', 'GINECOBSTETRICIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '321')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('321', 'HEMATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '323')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('323', 'INFECTOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '324')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('324', 'INMUNOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '325')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('325', 'MEDICINA FAMILIAR', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '326')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('326', 'MEDICINA FISICA Y DEL DEPORTE', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '327')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('327', 'MEDICINA FISICA Y REHABILITACION', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '328')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('328', 'MEDICINA GENERAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '329')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('329', 'MEDICINA INTERNA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '330')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('330', 'NEFROLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '331')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('331', 'NEUMOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '332')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('332', 'NEUROLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '333')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('333', 'NUTRICION Y DIETETICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '334')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('334', 'ODONTOLOGIA GENERAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '335')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('335', 'OFTALMOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '336')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('336', 'ONCOLOGIA CLINICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '337')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('337', 'OPTOMETRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '338')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('338', 'ORTODONCIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '339')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('339', 'ORTOPEDIA Y/O TRAUMATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '340')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('340', 'OTORRINOLARINGOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '342')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('342', 'PEDIATRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '343')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('343', 'PERIODONCIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '344')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('344', 'PSICOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '345')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('345', 'PSIQUIATRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '346')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('346', 'REHABILITACION ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '347')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('347', 'REHABILITACION ORAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '348')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('348', 'REUMATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '354')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('354', 'TOXICOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '355')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('355', 'UROLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '356')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('356', 'OTRAS CONSULTAS DE ESPECIALIDAD', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '361')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('361', 'CARDIOLOGIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '362')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('362', 'CIRUGIA DE CABEZA Y CUELLO', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '363')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('363', 'CIRUGIA DE MANO', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '364')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('364', 'CIRUGIA DE MAMA Y TUMORES TEJIDOS BLANDOS', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '365')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('365', 'CIRUGIA DERMATOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '366')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('366', 'CIRUGIA DE TORAX', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '367')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('367', 'CIRUGIA GASTROINTESTINAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '368')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('368', 'CIRUGIA GINECOLOGICA LAPAROSCOPICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '369')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('369', 'CIRUGIA PLASTICA Y ESTETICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '370')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('370', 'CIRUGIA PLASTICA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '371')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('371', 'OTRAS CONSULTAS GENERALES', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '372')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('372', 'CIRUGIA VASCULAR', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '373')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('373', 'CIRUGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END
        
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '374')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('374', 'CIRUGIA ONCOLOGICA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '375')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('375', 'DERMATOLOGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '377')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('377', 'COLOPROCTOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '379')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('379', 'GINECOLOGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '383')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('383', 'MEDICINA NUCLEAR', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '384')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('384', 'NEFROLOGIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '385')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('385', 'NEONATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '386')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('386', 'NEUMOLOGIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '387')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('387', 'NEUROCIRUGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '388')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('388', 'NEUROPEDIATRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '390')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('390', 'OFTALMOLOGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '391')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('391', 'ONCOLOGIA Y HEMATOLOGIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '393')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('393', 'ORTOPEDIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '395')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('395', 'UROLOGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '396')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('396', 'ODONTOPEDIATRIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '397')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('397', 'MEDICINA ESTETICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '406')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('406', 'HEMATOLOGIA ONCOLOGICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '407')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('407', 'MEDICINA DEL TRABAJO Y MEDICINA LABORAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '408')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('408', 'RADIOTERAPIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '409')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('409', 'ORTOPEDIA PEDIATRICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '410')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('410', 'CIRUGIA ORAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '411')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('411', 'CIRUGIA MAXILOFACIAL', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '412')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('412', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - HOMEOPATICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '413')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('413', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - AYURVEDICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '414')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('414', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - TRADICIONAL CHINA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '415')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('415', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - NATUROPATICA', 'CONSULTA EXTERNA', 7);
        END
        
    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '416')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('416', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - NEURALTERAPEUTICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '417')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('417', 'TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - BIOENERGETICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '418')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('418', 'TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - TERAPIA  CON FILTROS', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '419')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('419', 'TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - TERAPIAS  MANUALES', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '420')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('420', 'VACUNACION', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '421')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('421', 'PATOLOGIA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '422')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('422', 'MEDICINA ALTERNATIVA Y COMPLEMENTARIA - OSTEOPATICA', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '423')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('423', 'SEGURIDAD Y SALUD EN EL TRABAJO', 'CONSULTA EXTERNA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '706')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('706', 'LABORATORIO CLINICO', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '709')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('709', 'QUIMIOTERAPIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '711')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('711', 'RADIOTERAPIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '712')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('712', 'TOMA DE MUESTRAS DE LABORATORIO CLINICO', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '714')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('714', 'SERVICIO FARMACEUTICO', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '715')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('715', 'MEDICINA NUCLEAR', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '717')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('717', 'LABORATORIO CITOLOGIAS CERVICO-UTERINAS', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '728')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('728', 'TERAPIA OCUPACIONAL', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '729')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('729', 'TERAPIA RESPIRATORIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '731')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('731', 'LABORATORIO DE HISTOTECNOLOGIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '733')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('733', 'HEMODIALISIS', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '734')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('734', 'DIALISIS PERITONEAL', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '739')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('739', 'FISIOTERAPIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '740')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('740', 'FONOAUDIOLOGIA Y/O TERAPIA DEL LENGUAJE', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '742')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('742', 'DIAGNOSTICO VASCULAR', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '743')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('743', 'HEMODINAMIA E INTERVENCIONISMO', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '744')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('744', 'IMAGENES DIAGNOSTICAS- IONIZANTES', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '745')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('745', 'IMAGENES DIAGNOSTICAS - NO IONIZANTES', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '746')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('746', 'GESTION PRE-TRANSFUSIONAL', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '747')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('747', 'PATOLOGIA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '748')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('748', 'RADIOLOGIA ODONTOLOGICA', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[RIPS Servicios] WHERE [Código Servicios] = '749')
        BEGIN
            INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
            VALUES ('749', 'TOMA DE MUESTRAS DE CUELLO UTERINO Y GINECOLOGICAS', 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA', 7);
        END

    PRINT 'Datos insertados en RIPS Servicios correctamente';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en la tabla RIPS Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
-- ACTUALIZAR LOS CÓDIGOS DEL TIPO DE DIAGNOSTICO
UPDATE dbo.[Tipo de Diagnóstico Principal]
SET [Código Tipo de Diagnóstico Principal] = 
    CASE
        WHEN [Descripción Tipo de Diagnóstico Principal] = 'Impresión diagnóstica' THEN '01'
        WHEN [Descripción Tipo de Diagnóstico Principal] = 'Confirmado nuevo' THEN '02'
        WHEN [Descripción Tipo de Diagnóstico Principal] = 'Confirmado repetido' THEN '03'
        ELSE [Código Tipo de Diagnóstico Principal] -- Puedes añadir un ELSE si quieres dejar el valor actual en otros casos
    END;
	PRINT 'Datos en Tipo de Diagnóstico Principal actualizados correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar datos en Tipo de Diagnóstico Principal: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 

UPDATE dbo.[Tipo Entidad]
SET [Código Tipo Entidad] = 
    CASE
        WHEN [Descripción Tipo Entidad] = 'Subsidiado' THEN '04'
        WHEN [Descripción Tipo Entidad] = 'Particular' THEN '12'
        ELSE [Código Tipo Entidad] -- Puedes añadir un ELSE si quieres dejar el valor actual en otros casos
    END;

	PRINT 'Datos en Código Tipo Entidad actualizados correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar datos en Código Tipo Entidad: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
UPDATE dbo.[Tipo Entidad]
SET [Id Estado] = 
    CASE

		WHEN [Descripción Tipo Entidad] = 'Subsidiado' THEN '7'
		WHEN [Descripción Tipo Entidad] = 'Particular' THEN '7'
		WHEN [Descripción Tipo Entidad] = 'Contributivo' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Vinculado' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Otro' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Ecopetrol S.A.' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Colsanitas Prepagada' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Extranjero' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Plan Odontologico' THEN '8'
		WHEN [Descripción Tipo Entidad] = 'Medisanitas' THEN '8'
    END;

	PRINT 'Datos en Código Tipo Entidad actualizados correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar datos en Código Tipo Entidad: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    -- Verificación e inserción de registros en [Tipo Entidad] si no existen
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '01')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('01', '11', 'Contributivo cotizante', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '02')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('02', '12', 'Contributivo beneficiario', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '03')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('03', '13', 'Contributivo adicional', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '05')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('05', '14', 'No afiliado', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '06')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('06', '15', 'Especial o Excepción cotizante', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '07')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('07', '16', 'Especial o Excepción beneficiario', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '08')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('08', '13', 'Personas privadas de la libertad a cargo del Fondo Nacional de Salud', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '09')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('09', '13', 'Tomador / Amparado ARL', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '10')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('10', '13', 'Tomador / Amparado SOAT', 1, 7);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Tipo Entidad] WHERE [Código Tipo Entidad] = '11')
    BEGIN
        INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
        VALUES ('11', '13', 'Tomador / Amparado Planes voluntarios de salud', 1, 7);
    END

    PRINT 'Datos insertados en Tipo Entidad correctamente';
END TRY
BEGIN CATCH
    PRINT 'Error al insertar datos en la tabla Tipo Entidad: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
--ACTUALIZAR LOS CODIGOS DE TIPO RIPS
UPDATE dbo.[Tipo Rips]
SET [Código Tipo Rips] = 
    CASE
		WHEN [Tipo Rips] = 'Particulares' THEN '17'
		WHEN [Tipo Rips] = 'Entidad Prepago' THEN '24'
		WHEN [Tipo Rips] = 'EPS' THEN '23'
    END;
	PRINT 'Datos en Tipo Rips actualizados correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar datos en Tipo Rips: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
	ALTER TABLE Empresa
	ADD [Logo Empresa] VARCHAR(MAX) NULL

	PRINT 'Columna Logo Empresa creada en [Empresa]';
END TRY
BEGIN CATCH
	PRINT 'Error al crear columna Logo Empresa en [Empresa]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [Tipo de Evaluación]
ADD [Id Estado] INT DEFAULT 7;
	PRINT 'Columna Id Estado agregada correctamente en Tipo de Evaluación!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Estado en Tipo de Evaluación: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
UPDATE dbo.[Tipo de Evaluación]
SET [Id Estado] = 
    CASE
		WHEN [Tipo de Evaluación] = 'Evolución Médica' THEN 7
		WHEN [Tipo de Evaluación] = 'Fórmula Médica' THEN 7
		WHEN [Tipo de Evaluación] = 'Remisiones' THEN 8
		WHEN [Tipo de Evaluación] = 'Historia Clínica Formato' THEN 8
		WHEN [Tipo de Evaluación] = 'Historia Clínica Inicial' THEN 8
		WHEN [Tipo de Evaluación] = 'Otros Formatos' THEN 8
		WHEN [Tipo de Evaluación] = 'Evolución por Enfermería' THEN 8
		WHEN [Tipo de Evaluación] = 'Ordenes Médicas' THEN 8
		WHEN [Tipo de Evaluación] = 'Otras Ordenes' THEN 8
		WHEN [Tipo de Evaluación] = 'Evolución Médica Formato' THEN 8

    END;
	PRINT 'Estados actualizados correctamente en Tipo de Evaluación!';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar estados en Id Estado en Tipo de Evaluación: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [dbo].[Evaluación Entidad] ADD  DEFAULT (getdate()) FOR [Fecha Evaluación Entidad]

	PRINT 'Constraint para agregar fecha actual en evaluación entidad creada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear constraint para agregar fecha actual en evaluación entidad: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
UPDATE dbo.[Tipo de Afiliado]
SET [Descripción Tipo de Afiliado] = 
    CASE
		WHEN [Tipo de Afiliado] = 'Sin Asignar' THEN 'Sin Asignar'
		WHEN [Tipo de Afiliado] = 'Empleado' THEN 'Empleado'
		WHEN [Tipo de Afiliado] = 'Independiente' THEN 'Independiente'
    END;

	PRINT 'Datos en Tipo de Afiliado actualizados correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar datos en Tipo de Afiliado: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [dbo].[Evaluación Entidad] DROP CONSTRAINT [Evaluación Entidad_FK06]
	PRINT 'Llave de Id Terminal eliminada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al eliminar llave de Id Terminal: ' + ERROR_MESSAGE();
END CATCH;
GO


BEGIN TRY 
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Modalidad Atencion] Int NULL
	PRINT 'Columna Id Modalidad Atención agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Modalidad Atención: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Grupo Servicios] Int NULL

	PRINT 'Columna Id Grupo Servicios agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Grupo Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Servicios] Int NULL

	PRINT 'Columna Id Servicios agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Servicios: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
CREATE TABLE [dbo].[RIPS Por Defecto](
	[Id Rips Por Defecto] [int] IDENTITY(1,1) NOT NULL,
	[Tipo de Rips] INT NULL,
	[Entidad] Nvarchar(30),
	[Modalidad Atencion] INT,
	[Grupo Servicio] INT,
	[Servicio] INT,
	[Finalidad Consulta] INT,
	[Finalidad Procedimiento] INT, 
	[Causa Externa] INT,
	[Tipo Diag Principal] INT,
	[Via Ingreso] INT,
	[CUPS] Nvarchar(30),
	[CIE] Nvarchar(30)
	)

	PRINT 'Tabla Rips defecto creada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la tanla Rips Defecto: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Via Ingreso Usuario] Int NULL

	PRINT 'Columna Id Via Ingreso Usuario agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Via Ingreso Usuario: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY
    ALTER TABLE EmpresaV
    ADD [Fecha Final Resolucion Facturacion Empresa] Nvarchar(30) NULL;
    PRINT 'Columna [Fecha Final Resolucion Facturacion Empresa] agregada exitosamente a la tabla EmpresaV.';
END TRY
BEGIN CATCH
    PRINT 'Error al agregar la columna [Fecha Final Resolucion Facturacion Empresa]: ' + ERROR_MESSAGE();
END CATCH;
GO

BEGIN TRY 
	ALTER TABLE Factura
	ADD XML VARCHAR(MAX);
	PRINT 'Columna de XML en [Factura] agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al crear la columna XML en Factura ' + ERROR_MESSAGE();
END CATCH;
GO


--BEGIN TRY 
--CREATE TRIGGER [dbo].[TRI_ingreso_RIPS_Via_Sio]
--	ON  [dbo].[Evaluación Entidad Rips]
--	AFTER   INSERT 
--AS 
--BEGIN
--	Declare @viaIngresoServicioSalud Int
--	Declare @modalidadGrupoServicioTecSal Int
--	Declare @grupoServicios Int
--	Declare @codServicio Int
--	Declare @IdRIPS int

--	SELECT @IdRIPS =   [Id Evaluación Entidad Rips],
--	@viaIngresoServicioSalud = [Id Via Ingreso Usuario] ,
--	@modalidadGrupoServicioTecSal = [Id Modalidad Atencion],
--	@grupoServicios = [Id Grupo Servicios],
--	@codServicio = [Id Servicios]

--	FROM inserted;

--	if @viaIngresoServicioSalud IS NULL
--		BEGIN
--			UPDATE  [Evaluación Entidad Rips]
--			SET [Id Via Ingreso Usuario] = 1
--			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

--		END 
--	ELSE
--		BEGIN
--			PRINT 'NADA'
--		END
--		if @modalidadGrupoServicioTecSal IS NULL
--		BEGIN
--			UPDATE  [Evaluación Entidad Rips]
--			SET  [Id Modalidad Atencion] = 1
--			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

--		END 
--	ELSE
--		BEGIN
--			PRINT 'NADA'
--		END
--		if @grupoServicios IS NULL
--		BEGIN
--			UPDATE  [Evaluación Entidad Rips]
--			SET [Id Grupo Servicios] = 1
--			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

--		END 
--	ELSE
--		BEGIN
--			PRINT 'NADA'
--		END
--		if @codServicio IS NULL
--		BEGIN
--			UPDATE  [Evaluación Entidad Rips]
--			SET  [Id Servicios] = 99
--			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

--		END 
--	ELSE
--		BEGIN
--			PRINT 'NADA'
--		END

--	-- SET NOCOUNT ON added to prevent extra result sets from
--	-- interfering with SELECT statements.
--	SET NOCOUNT ON;

--    -- Insert statements for trigger here

--END

--	PRINT 'Trigger para agregar Id automatico a RIPS 2275 en [Evaluación Entidad Rips] creado correctamente!';
--END TRY
--BEGIN CATCH
--	PRINT 'Error al crear Trigger para agregar Id automatico a RIPS 2275 en [Evaluación Entidad Rips]: ' + ERROR_MESSAGE();
--END CATCH;
--GO

--BEGIN TRY 
--Create TRIGGER triger_sol_dc_Aseguradora 
--	ON  [Evaluación Entidad] 
--	AFTER   INSERT 
--AS 
--BEGIN
--	Declare @idevaluacion int
--	Declare @DocumentoAseguradora nvarchar(50)
--	Declare @DocumentoAseguradoraENTIDAD nvarchar(50)
--	DECLARE @Busqueda NVARCHAR(52);
--	--Se  traen datos del insert
--	select @idevaluacion = [Id Evaluación Entidad],
--	@DocumentoAseguradora = [Documento Aseguradora]
--	from inserted
--	--Se realiza contatenacion para hacer la busqueda
--	SET @Busqueda = '%' + @DocumentoAseguradora + '%';
--	--Condicion para evaluar si existe almenos uno que el documentoaseguradira de evaluacio sea practicamente el nombre
--	IF EXISTS (SELECT 1 FROM Entidad WHERE [Nombre Completo Entidad] like @Busqueda)
--		BEGIN
--		--Se consulta cual  el documento de ese nombre de documento aseguradora que se guarno erroneamente
--		select @DocumentoAseguradoraENTIDAD = [Documento Entidad] From Entidad Where [Nombre Completo Entidad] like @Busqueda
--			UPDATE [Evaluación Entidad]  SET [Documento Aseguradora] = @DocumentoAseguradoraENTIDAD Where   [Id Evaluación Entidad] = @idevaluacion 
--		END
		

--	SET NOCOUNT ON;

--    -- Insert statements for trigger here
--END
--GO
--	PRINT 'Trigger para agregar carga de aseguradora en aplicación Evolucion creado correctamente!';
--END TRY
--BEGIN CATCH
--	PRINT 'Error al crear Trigger para agregar carga de aseguradora en aplicación Evolucion: ' + ERROR_MESSAGE();
--END CATCH;
--GO

