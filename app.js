const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const bikesRouter = require('./routes/bikes'); // Importa las rutas de bikes
const toursRouter = require('./routes/tours'); // Importa las rutas de tours
const app = express();
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(bodyParser.json());
app.use(express.json());

// Usamos la ruta de las bicicletas
app.use('/bikes', bikesRouter);
// Usamos la ruta de los tours
app.use('/tours', toursRouter);

app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
console.log(req.body);
console.log(name);
console.log(email);
console.log(message);
  // configure transport (use your actual email credentials or SMTP service)
  const transporter = nodemailer.createTransport({
    service: 'happyrentalbike',
    auth: {
      user: 'tienda@happyrentalbike.com',
      pass: ''
    }
  });

  const mailOptions = {
    from: req.body.contact_email,
    to: 'tienda@happyrentalbike.com',
    subject: `New message from ${req.body.contact_name}`,
    text: req.body.contact_message
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error sending email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Message sent successfully!');
    }
  });
});

// Arrancar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Set the views folder where EJS templates are located
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the homepage
app.get('/', (req, res) => {
  res.render('index'); // This will render views/index.ejs
});

app.get('/:page', (req, res) => {
  const page = req.params.page;

  res.render(page, (err, html) => {
    if (err) {
      res.status(404).send('Página no encontrada');
    } else {
      res.send(html);
    }
  });
});


