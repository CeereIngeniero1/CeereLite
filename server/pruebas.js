import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } from 'graphql';
import { poolPromise, sql } from '../db.js';

// Definimos los tipos de datos
const EmpresaType = new GraphQLObjectType({
    name: 'Empresa',
    fields: {
        nombreEmpresa: { type: GraphQLString },
        documentoEmpresa: { type: GraphQLString },
        direccionEmpresa: { type: GraphQLString },
        telefonoEmpresa: { type: GraphQLString },
        correoEmpresa: { type: GraphQLString },
    }
});

// Definimos el root query que maneja las consultas
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        empresa: {
            type: EmpresaType,
            args: { docEmpresa: { type: GraphQLString } },
            async resolve(parent, args) {
                const pool = await poolPromise;
                const result = await pool.request()
                    .input('docEmpresa', sql.VarChar, args.docEmpresa)
                    .query(`
                        SELECT em.[Nombre Comercial Empresa] as [Nombre Empresa], em.[Documento Empresa],
                        em3.[Dirección EmpresaIII] as [Direccion Empresa], em3.[Teléfono No 1 EmpresaIII] as [Telefono Empresa],
                        em3.[E-mail 1 EmpresaIII] as [Correo Empresa]
                        FROM Empresa as em
                        LEFT JOIN EmpresaIII as em3 ON em.[Documento Empresa] = em3.[Documento Empresa]
                        WHERE em.[Documento Empresa] = @docEmpresa
                    `);
                return result.recordset[0];
            }
        },
        seleccionEmpresa: {
            type: new GraphQLList(EmpresaType),
            async resolve() {
                const pool = await poolPromise;
                const result = await pool.request()
                    .query(`
                        SELECT [Documento Empresa] as DocumentoEmpresa, [Nombre Comercial Empresa] as NombreComercialEmpresa
                        FROM Empresa
                    `);
                return result.recordset;
            }
        }
    }
});

// Definimos una mutation para actualizar la imagen
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        uploadImage: {
            type: GraphQLString,
            args: {
                docEmpresa: { type: GraphQLString },
                imageBase64: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const pool = await poolPromise;
                await pool.request()
                    .input('imageData', sql.VarChar(sql.MAX), args.imageBase64)
                    .input('docEmpresa', sql.VarChar(50), args.docEmpresa)
                    .query('UPDATE Empresa SET [Logo Empresa] = @imageData WHERE [Documento Empresa] = @docEmpresa');
                return 'Imagen actualizada exitosamente';
            }
        },
        getImage: {
            type: GraphQLString,
            args: { docEmpresa: { type: GraphQLString } },
            async resolve(parent, args) {
                const pool = await poolPromise;
                const result = await pool.request()
                    .input('docEmpresa', sql.VarChar(50), args.docEmpresa)
                    .query('SELECT [Logo Empresa] FROM Empresa WHERE [Documento Empresa] = @docEmpresa');
                const imageBase64 = result.recordset[0]['Logo Empresa'];
                if (imageBase64) {
                    return imageBase64;
                } else {
                    throw new Error('Imagen no encontrada');
                }
            }
        }
    }
});

// Finalmente, definimos el esquema de GraphQL
export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
