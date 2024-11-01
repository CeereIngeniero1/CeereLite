import fs from 'fs';
import sql from 'mssql';

// Leer la configuración desde un archivo .ini o de otra fuente
const filePath = 'C:/CeereSio/CRInfo.ini';
const fileContent = fs.readFileSync(filePath, 'utf-8');
const dataSourceLine = fileContent.split('\n').find(line => line.includes('DataSource'));
const dataSourceValue = dataSourceLine.split('=')[1].split('\\')[0].trim();
// Buscar la línea que contiene exactamente Catalog
const CatalogLine = fileContent.split('\n').find(line => line.trim().startsWith('Catalog='));
const CatalogLineValue = CatalogLine.split('=')[1].split('\\')[0].trim();
console.log(CatalogLineValue);

// Configuración de la base de datos
const config = {
    server: dataSourceValue,
    user: 'CeereRIPS',
    password: 'crsoft',
    database: CatalogLineValue,
    port: 1433,
    options: {
        encrypt: false, // Cambia a true si usas cifrado
        trustServerCertificate: true
    }
};

// Crear el pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a la base de datos');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectarse a la base de datos:', err.message);
        process.exit(1);
    });

export { sql, poolPromise };
