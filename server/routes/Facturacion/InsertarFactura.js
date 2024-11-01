import { sql, poolPromise } from '../../db.js';
import { Router } from 'express';

const router = Router();

router.post('/insertarFactura', async (req, res) => {
    const { docEmpresa, resolucion, numeroFactura, fechaFactura, fechaVencimiento, docPaciente, observaciones, subtotal, total, docUsuario, productos } = req.body;

    console.log('datos a insertar en factura son', req.body);

    const nroItems = productos.length;  // Número de productos
    const cantidadArticulos = productos.reduce((acc, prod) => acc + prod.cantidad, 0);

    let transaction; // Declara la transacción aquí para que esté disponible globalmente

    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);

        await transaction.begin();

        // Insertar en Factura y obtener el idFactura generado
        const result = await transaction.request()
            .input('docEmpresa', sql.VarChar, docEmpresa)
            .input('resolucion', sql.Int, resolucion)
            .input('numeroFactura', sql.VarChar, numeroFactura)
            .input('fechaFactura', sql.DateTime, fechaFactura)
            .input('fechaVencimiento', sql.DateTime, fechaVencimiento)
            .input('docPaciente', sql.NVarChar, docPaciente)
            .input('observaciones', sql.VarChar, observaciones)
            .input('subtotal', sql.Float, subtotal)
            .input('total', sql.Float, total)
            .input('docUsuario', sql.NVarChar, docUsuario)
            .input('nroItems', sql.Int, nroItems)
            .input('cantidadArticulos', sql.Int, cantidadArticulos)
            .query(`
                DECLARE @InsertedIds TABLE (IdFactura INT);


                INSERT INTO [dbo].[Factura]
                ([Documento Empresa], [Id EmpresaV], [No Factura], [Id Período de Inventario Bodega], 
                [Id Bodega], [Id Pedido], [Id Tipo Tarifa], [Id Remisión], [Fecha Digitación Factura], 
                [Fecha Factura], [Fecha Vencimiento Factura], [Id Condición de Pago Factura], 
                [Id Moneda], [Tasa de Cambio Vigente], [Documento Responsable], [Documento Paciente], 
                [Documento Beneficiario], [Id EntidadXXVI Sucursal], [Documento Vendedor], 
                [Porcentaje Descuento Pronto Pago Factura], [Valor Propina Factura], [Domicilio Factura], 
                [Nro de Items Factura], [Cantidad de Artículos Factura], [Valor Acumulado Factura], 
                [Descuentos Factura], [Descuento Adicional $ Factura], [Descuento Adicional % Factura], 
                [Comisión Factura], [Comisión Adicional % Factura], [Comisión Adicional $ Factura], 
                [Iva Factura], [SubTotal Factura], [Total Factura], [Retención en la Fuente Factura], 
                [Id Retención Fuente], [Retención Iva Factura], [Id Retención Iva], [Retención Otros Factura], 
                [Id Retención Otros], [Valor En Letras Factura], [Observaciones Factura], [Documento Usuario], 
                [Id Terminal], [Id Estado Contabilidad], [Id Estado], [Id Período Inventario], [Id Estado Impresión], 
                [Id Tipo de Comprobante], [Documento Sede], [Retención Cancelada], [EstadoFacturaElectronica])
                OUTPUT inserted.[Id Factura] INTO @InsertedIds(IdFactura)
                VALUES 
                (@docEmpresa, @resolucion, @numeroFactura, 2, 2, 0, 0, 0, @fechaFactura, 
                @fechaFactura, @fechaVencimiento, 2, 2, 1, @docPaciente, @docPaciente, @docPaciente, 
                0, '70123456', 0, 0, 'False', @nroItems, @cantidadArticulos, @total, 0, 0, 0, 0, 0, 
                0, 0, @subtotal, @total, 0, 1, 0, 1, 0, 1, 'Cien', @observaciones, @docUsuario, 
                NULL, 1, 12, 1, 1, 1, @docEmpresa, 'False', NULL);

                SELECT IdFactura FROM @InsertedIds;

            `);

        const idFactura = result.recordset[0].IdFactura;

        // Insertar los productos en FacturaII
        for (let producto of productos) {
            const { codigo, nombre, precio, cantidad } = producto;

            console.log('productos son: ', producto);

            await transaction.request()
                .input('idFactura', sql.Int, idFactura)
                .input('codigoObjeto', sql.VarChar, codigo)
                .input('nombreProducto', sql.VarChar, nombre)
                .input('valorProducto', sql.Decimal(18, 2), precio)
                .input('cantidadArticulos', sql.Int, cantidad)
                .query(`
                    INSERT INTO [dbo].[FacturaII]
                    ([Id Factura], [Código Objeto], [Descripción FacturaII], [Valor FacturaII], 
                    [Valor Costo FacturaII], [Cantidad FacturaII], [Descuento % FacturaII], 
                    [Descuento $ FacturaII], [Valor Iva % FacturaII], [Valor Iva $ FacturaII], 
                    [Comisión % FacturaII], [Comisión $ FacturaII], [Comentario FacturaII], 
                    [Fecha Devolución], [Cantidad Devuelta FacturaII], [Id Estado], [Id Plan de Tratamiento])
                    VALUES 
                    (@idFactura, @codigoObjeto, @nombreProducto, @valorProducto, 0, @cantidadArticulos, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                `);
        }

        await transaction.commit();
        res.status(200).send("Factura y productos insertados exitosamente");
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error al insertar la factura y los productos:', error);
        res.status(500).send("Error al insertar la factura y los productos");
    }
});

export default router;
