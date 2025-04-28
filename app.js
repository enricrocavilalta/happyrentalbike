const express = require('express');
const bodyParser = require('body-parser');
const bikesRouter = require('./routes/bikes'); // Importa las rutas de bikes
const toursRouter = require('./routes/tours'); // Importa las rutas de tours
const app = express();

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(bodyParser.json());

// Usamos la ruta de las bicicletas
app.use('/bikes', bikesRouter);
// Usamos la ruta de los tours
app.use('/tours', toursRouter);

app.use(express.static('public'));

// Arrancar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



