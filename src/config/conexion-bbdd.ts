import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Carga las variables del .env
dotenv.config();

// Crea un pool de conexiones a MySQL
// Un pool mantiene varias conexiones abiertas y las reutiliza,
// es más eficiente que abrir y cerrar una conexión por cada consulta
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z', // UTC puro, sin conversión
  dateStrings: true, // Devuelve fechas como string YYYY-MM-DD sin convertir
  waitForConnections: true,
  connectionLimit: 10,
});

// Comprueba al arrancar que la conexión funciona
pool.getConnection()
  .then(() => console.log('Conectado a la base de datos MySQL'))
  .catch((err) => console.error('Error conectando a MySQL:', err));

export default pool;