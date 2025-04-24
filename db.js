const mysql = require('mysql2');

// Crear la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuario de MySQL
  password: 'fghjFGHJ85', // Contraseña de MySQL
  database: 'happyrental' // Nombre de la base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión establecida con la base de datos');
});

module.exports = connection;
