USE CeereSio;
GO

-- Crear el inicio de sesión (login) a nivel del servidor
BEGIN TRY
    CREATE LOGIN CeereRIPS 
    WITH PASSWORD = 'crsfoft', 
    CHECK_EXPIRATION = OFF, 
    CHECK_POLICY = OFF;
    PRINT 'Login CeereRIPS creado exitosamente.';
END TRY
BEGIN CATCH
    PRINT 'Error al crear el login CeereRIPS: ' + ERROR_MESSAGE();
END CATCH;
GO

-- Crear el usuario en la base de datos específica y asociarlo con el login
BEGIN TRY
    CREATE USER CeereRIPS 
    FOR LOGIN CeereRIPS 
    WITH DEFAULT_SCHEMA = dbo;
    PRINT 'Usuario CeereRIPS creado exitosamente en la base de datos CeereSio.';
END TRY
BEGIN CATCH
    PRINT 'Error al crear el usuario CeereRIPS en la base de datos CeereSio: ' + ERROR_MESSAGE();
END CATCH;
GO

-- Asignar permisos de superusuario
BEGIN TRY
    ALTER ROLE db_owner ADD MEMBER CeereRIPS;
    PRINT 'Usuario CeereRIPS asignado como db_owner en la base de datos CeereSio.';
END TRY
BEGIN CATCH
    PRINT 'Error al asignar el rol db_owner al usuario CeereRIPS: ' + ERROR_MESSAGE();
END CATCH;
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
INSERT INTO [dbo].[RIPS Via Ingreso Usuario] ([Codigo], [Nombre Via Ingreso Usuario], [Descripción Via Ingreso Usuario], [Orden Via Ingreso Usuario], [Id Estado])
VALUES
    ('01', 'Demanda espontánea', NULL, 1, 7),
    ('02', 'Derivado de consulta externa', NULL, 1, 7),
	('03', 'Derivado de urgencias', NULL, 1, 7),
	('04', 'Derivado de hospitalización', NULL, 1, 7),
	('05', 'Derivado de sala de cirugía', NULL, 1, 7),
	('06', 'Derivado de sala de partos', NULL, 1, 7),
	('07', 'Recién nacido en la institución', NULL, 1, 7),
	('08', 'Recién nacido en otra institución', NULL, 1, 7),
	('09', 'Derivado o referido de hospitalización domiciliaria', NULL, 1, 7),
    ('10', 'Derivado de atención domiciliaria', NULL, 1, 7),
    ('11', 'Derivado de telemedicina', NULL, 1, 7),
    ('12', 'Derivado de jornada de salud', NULL, 1, 7),
    ('13', 'Referido de otra institución', NULL, 1, 7),
    ('14', 'Contrarreferido de otra institución', NULL, 1, 7)

	PRINT 'Datos insertados RIPS Via Ingreso Usuario correctamente';
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
INSERT INTO [dbo].[RIPS Modalidad Atención] ([Codigo], [Nombre Modalidad Atencion], [Descripción Modalidad Atencion], [Orden Modalidad Atencion], [Id Estado])
VALUES
    ('01', 'Intramural', NULL, 1, 7),
    ('02', 'Extramural unidad móvil', NULL, 1, 7),
	('03', 'Extramural domiciliaria', NULL, 1, 7),
	('04', 'Extramural jornada de salud', NULL, 1, 7),
	('06', 'Telemedicina interactiva', NULL, 1, 7),
	('07', 'Telemedicina no interactiva', NULL, 1, 7),
	('08', 'Telemedicina telexperticia', NULL, 1, 7),
	('09', 'Telemedicina telemonitoreo', NULL, 1, 7);


	PRINT 'Datos insertados RIPS RIPS Modalidad Atención correctamente';
END TRY
BEGIN CATCH
	PRINT 'Error al insertar datos en la tabla RIPS RIPS Modalidad Atención: ' + ERROR_MESSAGE();
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
INSERT INTO [dbo].[RIPS Grupo Servicios] ([Codigo], [Nombre Grupo Servicios], [Descripción Grupo Servicios], [Orden Grupo Servicios], [Id Estado])
VALUES
    ('01', 'Consulta externa', NULL, 1, 7),
    ('02', 'Apoyo diagnóstico y complementación terapéutica', NULL, 1, 7),
	('03', 'Internación', NULL, 1, 7),
	('04', 'Quirúrgico', NULL, 1, 7),
	('05', 'Atención inmediata', NULL, 1, 7);

	PRINT 'Datos insertados RIPS Grupo Servicios correctamente';
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
INSERT INTO [dbo].[RIPS Servicios] ([Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado])
VALUES
('105','CUIDADO INTERMEDIO NEONATAL','INTERNACION',7),
('106','CUIDADO INTERMEDIO PEDIATRICO','INTERNACION',7),
('107','CUIDADO INTERMEDIO ADULTOS','INTERNACION',7),
('108','CUIDADO INTENSIVO NEONATAL','INTERNACION',7),
('109','CUIDADO INTENSIVO PEDIATRICO','INTERNACION',7),
('110','CUIDADO INTENSIVO ADULTOS','INTERNACION',7),
('1101','ATENCION DEL PARTO','ATENCION INMEDIATA',7),
('1102','URGENCIAS','ATENCION INMEDIATA',7),
('1103','TRANSPORTE ASISTENCIAL BASICO','ATENCION INMEDIATA',7),
('1104','TRANSPORTE ASISTENCIAL MEDICALIZADO','ATENCION INMEDIATA',7),
('1105','ATENCION PREHOSPITALARIA','ATENCION INMEDIATA',7),
('120','CUIDADO BASICO NEONATAL','INTERNACION',7),
('129','HOSPITALIZACION ADULTOS','INTERNACION',7),
('130','HOSPITALIZACION PEDIATRICA','INTERNACION',7),
('131','HOSPITALIZACION EN SALUD MENTAL','INTERNACION',7),
('132','HOSPITALIZACION PARCIAL','INTERNACION',7),
('133','HOSPITALIZACION PACIENTE CRONICO CON VENTILADOR','INTERNACION',7),
('134','HOSPITALIZACION PACIENTE CRONICO SIN VENTILADOR','INTERNACION',7),
('135','HOSPITALIZACION EN  CONSUMO DE SUSTANCIAS PSICOACTIVAS','INTERNACION',7),
('138','CUIDADO BASICO DEL CONSUMO DE SUSTANCIAS PSICOACTIVAS','INTERNACION',7),
('201','CIRUGIA DE CABEZA Y CUELLO','QUIRURGICOS',7),
('202','CIRUGIA CARDIOVASCULAR','QUIRURGICOS',7),
('203','CIRUGIA GENERAL','QUIRURGICOS',7),
('204','CIRUGIA GINECOLOGICA','QUIRURGICOS',7),
('205','CIRUGIA MAXILOFACIAL','QUIRURGICOS',7),
('207','CIRUGIA ORTOPEDICA','QUIRURGICOS',7),
('208','CIRUGIA OFTALMOLOGICA','QUIRURGICOS',7),
('209','CIRUGIA OTORRINOLARINGOLOGIA','QUIRURGICOS',7),
('210','CIRUGIA ONCOLOGICA','QUIRURGICOS',7),
('211','CIRUGIA ORAL','QUIRURGICOS',7),
('212','CIRUGIA PEDIATRICA','QUIRURGICOS',7),
('213','CIRUGIA PLASTICA Y ESTETICA','QUIRURGICOS',7),
('214','CIRUGIA VASCULAR Y ANGIOLOGICA','QUIRURGICOS',7),
('215','CIRUGIA UROLOGICA','QUIRURGICOS',7),
('217','OTRAS CIRUGIAS','QUIRURGICOS',7),
('218','CIRUGIA ENDOVASCULAR NEUROLOGICA','QUIRURGICOS',7),
('227','CIRUGIA ONCOLOGICA PEDIATRICA','QUIRURGICOS',7),
('231','CIRUGIA DE LA MANO','QUIRURGICOS',7),
('232','CIRUGIA DE MAMA Y TUMORES TEJIDOS BLANDOS','QUIRURGICOS',7),
('233','CIRUGIA DERMATOLOGICA','QUIRURGICOS',7),
('234','CIRUGIA DE TORAX','QUIRURGICOS',7),
('235','CIRUGIA GASTROINTESTINAL','QUIRURGICOS',7),
('237','CIRUGIA PLASTICA ONCOLOGICA','QUIRURGICOS',7),
('245','NEUROCIRUGIA','QUIRURGICOS',7),
('301','ANESTESIA','CONSULTA EXTERNA',7),
('302','CARDIOLOGIA','CONSULTA EXTERNA',7),
('303','CIRUGIA CARDIOVASCULAR','CONSULTA EXTERNA',7),
('304','CIRUGIA GENERAL','CONSULTA EXTERNA',7),
('306','CIRUGIA PEDIATRICA','CONSULTA EXTERNA',7),
('308','DERMATOLOGIA','CONSULTA EXTERNA',7),
('309','DOLOR Y CUIDADOS PALIATIVOS','CONSULTA EXTERNA',7),
('310','ENDOCRINOLOGIA','CONSULTA EXTERNA',7),
('311','ENDODONCIA','CONSULTA EXTERNA',7),
('312','ENFERMERIA','CONSULTA EXTERNA',7),
('313','ESTOMATOLOGIA','CONSULTA EXTERNA',7),
('316','GASTROENTEROLOGIA','CONSULTA EXTERNA',7),
('317','GENETICA','CONSULTA EXTERNA',7),
('318','GERIATRIA','CONSULTA EXTERNA',7),
('320','GINECOBSTETRICIA','CONSULTA EXTERNA',7),
('321','HEMATOLOGIA','CONSULTA EXTERNA',7),
('323','INFECTOLOGIA','CONSULTA EXTERNA',7),
('324','INMUNOLOGIA','CONSULTA EXTERNA',7),
('325','MEDICINA FAMILIAR','CONSULTA EXTERNA',7),
('326','MEDICINA FISICA Y DEL DEPORTE','CONSULTA EXTERNA',7),
('327','MEDICINA FISICA Y REHABILITACION','CONSULTA EXTERNA',7),
('328','MEDICINA GENERAL','CONSULTA EXTERNA',7),
('329','MEDICINA INTERNA','CONSULTA EXTERNA',7),
('330','NEFROLOGIA','CONSULTA EXTERNA',7),
('331','NEUMOLOGIA','CONSULTA EXTERNA',7),
('332','NEUROLOGIA','CONSULTA EXTERNA',7),
('333','NUTRICION Y DIETETICA','CONSULTA EXTERNA',7),
('334','ODONTOLOGIA GENERAL','CONSULTA EXTERNA',7),
('335','OFTALMOLOGIA','CONSULTA EXTERNA',7),
('336','ONCOLOGIA CLINICA','CONSULTA EXTERNA',7),
('337','OPTOMETRIA','CONSULTA EXTERNA',7),
('338','ORTODONCIA','CONSULTA EXTERNA',7),
('339','ORTOPEDIA Y/O TRAUMATOLOGIA','CONSULTA EXTERNA',7),
('340','OTORRINOLARINGOLOGIA','CONSULTA EXTERNA',7),
('342','PEDIATRIA','CONSULTA EXTERNA',7),
('343','PERIODONCIA','CONSULTA EXTERNA',7),
('344','PSICOLOGIA','CONSULTA EXTERNA',7),
('345','PSIQUIATRIA','CONSULTA EXTERNA',7),
('346','REHABILITACION ONCOLOGICA','CONSULTA EXTERNA',7),
('347','REHABILITACION ORAL','CONSULTA EXTERNA',7),
('348','REUMATOLOGIA','CONSULTA EXTERNA',7),
('354','TOXICOLOGIA','CONSULTA EXTERNA',7),
('355','UROLOGIA','CONSULTA EXTERNA',7),
('356','OTRAS CONSULTAS DE ESPECIALIDAD','CONSULTA EXTERNA',7),
('361','CARDIOLOGIA PEDIATRICA','CONSULTA EXTERNA',7),
('362','CIRUGIA DE CABEZA Y CUELLO','CONSULTA EXTERNA',7),
('363','CIRUGIA DE MANO','CONSULTA EXTERNA',7),
('364','CIRUGIA DE MAMA Y TUMORES TEJIDOS BLANDOS','CONSULTA EXTERNA',7),
('365','CIRUGIA DERMATOLOGICA','CONSULTA EXTERNA',7),
('366','CIRUGIA DE TORAX','CONSULTA EXTERNA',7),
('367','CIRUGIA GASTROINTESTINAL','CONSULTA EXTERNA',7),
('368','CIRUGIA GINECOLOGICA LAPAROSCOPICA','CONSULTA EXTERNA',7),
('369','CIRUGIA PLASTICA Y ESTETICA','CONSULTA EXTERNA',7),
('370','CIRUGIA PLASTICA ONCOLOGICA','CONSULTA EXTERNA',7),
('371','OTRAS CONSULTAS GENERALES','CONSULTA EXTERNA',7),
('372','CIRUGIA VASCULAR','CONSULTA EXTERNA',7),
('373','CIRUGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('374','CIRUGIA ONCOLOGICA PEDIATRICA','CONSULTA EXTERNA',7),
('375','DERMATOLOGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('377','COLOPROCTOLOGIA','CONSULTA EXTERNA',7),
('379','GINECOLOGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('383','MEDICINA NUCLEAR','CONSULTA EXTERNA',7),
('384','NEFROLOGIA PEDIATRICA','CONSULTA EXTERNA',7),
('385','NEONATOLOGIA','CONSULTA EXTERNA',7),
('386','NEUMOLOGIA PEDIATRICA','CONSULTA EXTERNA',7),
('387','NEUROCIRUGIA','CONSULTA EXTERNA',7),
('388','NEUROPEDIATRIA','CONSULTA EXTERNA',7),
('390','OFTALMOLOGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('391','ONCOLOGIA Y HEMATOLOGIA PEDIATRICA','CONSULTA EXTERNA',7),
('393','ORTOPEDIA ONCOLOGICA','CONSULTA EXTERNA',7),
('395','UROLOGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('396','ODONTOPEDIATRIA','CONSULTA EXTERNA',7),
('397','MEDICINA ESTETICA','CONSULTA EXTERNA',7),
('406','HEMATOLOGIA ONCOLOGICA','CONSULTA EXTERNA',7),
('407','MEDICINA DEL TRABAJO Y MEDICINA LABORAL','CONSULTA EXTERNA',7),
('408','RADIOTERAPIA','CONSULTA EXTERNA',7),
('409','ORTOPEDIA PEDIATRICA','CONSULTA EXTERNA',7),
('410','CIRUGIA ORAL','CONSULTA EXTERNA',7),
('411','CIRUGIA MAXILOFACIAL','CONSULTA EXTERNA',7),
('412','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - HOMEOPATICA','CONSULTA EXTERNA',7),
('413','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - AYURVEDICA','CONSULTA EXTERNA',7),
('414','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - TRADICIONAL CHINA','CONSULTA EXTERNA',7),
('415','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - NATUROPATICA','CONSULTA EXTERNA',7),
('416','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - NEURALTERAPEUTICA','CONSULTA EXTERNA',7),
('417','TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - BIOENERGETICA','CONSULTA EXTERNA',7),
('418','TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - TERAPIA  CON FILTROS','CONSULTA EXTERNA',7),
('419','TERAPIAS ALTERNATIVAS Y COMPLEMENTARIAS - TERAPIAS  MANUALES','CONSULTA EXTERNA',7),
('420','VACUNACION','CONSULTA EXTERNA',7),
('421','PATOLOGIA','CONSULTA EXTERNA',7),
('422','MEDICINA ALTERNATIVA Y COMPLEMENTARIA - OSTEOPATICA','CONSULTA EXTERNA',7),
('423','SEGURIDAD Y SALUD EN EL TRABAJO','CONSULTA EXTERNA',7),
('706','LABORATORIO CLINICO','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('709','QUIMIOTERAPIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('711','RADIOTERAPIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('712','TOMA DE MUESTRAS DE LABORATORIO CLINICO','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('714','SERVICIO FARMACEUTICO','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('715','MEDICINA NUCLEAR','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('717','LABORATORIO CITOLOGIAS CERVICO-UTERINAS','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('728','TERAPIA OCUPACIONAL','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('729','TERAPIA RESPIRATORIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('731','LABORATORIO DE HISTOTECNOLOGIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('733','HEMODIALISIS','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('734','DIALISIS PERITONEAL','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('739','FISIOTERAPIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('740','FONOAUDIOLOGIA Y/O TERAPIA DEL LENGUAJE','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('742','DIAGNOSTICO VASCULAR','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('743','HEMODINAMIA E INTERVENCIONISMO','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('744','IMAGENES DIAGNOSTICAS- IONIZANTES','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('745','IMAGENES DIAGNOSTICAS - NO IONIZANTES','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('746','GESTION PRE-TRANSFUSIONAL','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('747','PATOLOGIA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('748','RADIOLOGIA ODONTOLOGICA','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7),
('749','TOMA DE MUESTRAS DE CUELLO UTERINO Y GINECOLOGICAS','APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA',7)

	PRINT 'Datos insertados RIPS Servicios correctamente';
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
-- INSERTAR LOS TIPOS DE USUARIO DE ACUERDO A LA NUEVA VERSION TIPOUSUARIOVERSIÓN2
INSERT INTO [dbo].[Tipo Entidad] ([Código Tipo Entidad], [Tipo Entidad], [Descripción Tipo Entidad], [Orden Tipo Entidad], [Id Estado])
VALUES
    ('01', '11', 'Contributivo cotizante', 1, 7),
	('02', '12', 'Contributivo beneficiario', 1, 7),
	('03', '13', 'Contributivo adicional', 1, 7),
	('05', '14', 'No afiliado', 1, 7),
	('06', '15', 'Especial o Excepción cotizante', 1, 7),
	('07', '16', 'Especial o Excepción beneficiario', 1, 7),
	('08', '13', 'Personas privadas de la libertad a cargo del Fondo Nacional de Salud', 1, 7),
	('09', '13', 'Tomador / Amparado ARL', 1, 7),
	('10', '13', 'Tomador / Amparado SOAT', 1, 7),
	('11', '13', 'Tomador / Amparado Planes voluntarios de salud', 1, 7)

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
UPDATE Empresa
SET [Id Estado] = 7;
	PRINT 'Empresas actualizadas a Id Estado 7';
END TRY
BEGIN CATCH
	PRINT 'Error al actualizar empresas a Id Estado 7: ' + ERROR_MESSAGE();
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
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Via Ingreso Usuario] Int NULL

	PRINT 'Columna Id Via Ingreso Usuario agregada correctamente!';
END TRY
BEGIN CATCH
	PRINT 'Error al agregar la columna Id Via Ingreso Usuario: ' + ERROR_MESSAGE();
END CATCH;
GO

CREATE TRIGGER [dbo].[TRI_ingreso_RIPS_Via_Sio]
	ON  [dbo].[Evaluación Entidad Rips]
	AFTER   INSERT 
AS 
BEGIN
	
	Declare @viaIngresoServicioSalud Int
	Declare @modalidadGrupoServicioTecSal Int
	Declare @grupoServicios Int
	Declare @codServicio Int
	Declare @IdRIPS int

	SELECT @IdRIPS =   [Id Evaluación Entidad Rips],
	@viaIngresoServicioSalud = [Id Via Ingreso Usuario] ,
	@modalidadGrupoServicioTecSal = [Id Modalidad Atencion],
	@grupoServicios = [Id Grupo Servicios],
	@codServicio = [Id Servicios]

	FROM inserted;

	if @viaIngresoServicioSalud IS NULL
		BEGIN
			UPDATE  [Evaluación Entidad Rips]
			SET [Id Via Ingreso Usuario] = 1
			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

		END 
	ELSE
		BEGIN
			PRINT 'NADA'
		END
		if @modalidadGrupoServicioTecSal IS NULL
		BEGIN
			UPDATE  [Evaluación Entidad Rips]
			SET  [Id Modalidad Atencion] = 1
			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

		END 
	ELSE
		BEGIN
			PRINT 'NADA'
		END
		if @grupoServicios IS NULL
		BEGIN
			UPDATE  [Evaluación Entidad Rips]
			SET [Id Grupo Servicios] = 1
			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

		END 
	ELSE
		BEGIN
			PRINT 'NADA'
		END
		if @codServicio IS NULL
		BEGIN
			UPDATE  [Evaluación Entidad Rips]
			SET  [Id Servicios] = 99
			WHERE  [Id Evaluación Entidad Rips] = @IdRIPS

		END 
	ELSE
		BEGIN
			PRINT 'NADA'
		END


	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
END

PRINT 'Trigger para agregar Id automatico a RIPS 2275 en [Evaluación Entidad Rips] creado correctamente!';


CREATE TRIGGER triger_sol_dc_Aseguradora 
ON  [Evaluación Entidad] 
AFTER INSERT 
AS 
BEGIN
    DECLARE @idevaluacion INT;
    DECLARE @DocumentoAseguradora NVARCHAR(50);
    DECLARE @DocumentoAseguradoraENTIDAD NVARCHAR(50);
    DECLARE @Busqueda NVARCHAR(52);

    -- Se traen datos del insert
    SELECT @idevaluacion = [Id Evaluación Entidad],
           @DocumentoAseguradora = [Documento Aseguradora]
    FROM inserted;

    -- Se realiza concatenación para hacer la búsqueda
    SET @Busqueda = '%' + @DocumentoAseguradora + '%';

    -- Condición para evaluar si existe al menos uno donde el Documento Aseguradora de evaluación sea prácticamente el nombre
    IF EXISTS (SELECT 1 FROM Entidad WHERE [Nombre Completo Entidad] LIKE @Busqueda)
    BEGIN
        -- Se consulta cuál es el documento de ese nombre de Documento Aseguradora que se guardó erróneamente
        SELECT @DocumentoAseguradoraENTIDAD = [Documento Entidad] 
        FROM Entidad 
        WHERE [Nombre Completo Entidad] LIKE @Busqueda;

        -- Se actualiza el documento aseguradora en la tabla de evaluación
        UPDATE [Evaluación Entidad]  
        SET [Documento Aseguradora] = @DocumentoAseguradoraENTIDAD 
        WHERE [Id Evaluación Entidad] = @idevaluacion;
    END;

    SET NOCOUNT ON;
END;
GO

PRINT 'Trigger para agregar carga de aseguradora en aplicación Evolucion creado correctamente!';
