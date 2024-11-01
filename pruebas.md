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
