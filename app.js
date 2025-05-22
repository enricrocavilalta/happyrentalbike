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
//pp.use(session({ ... }));
const session = require('express-session');
const bcrypt = require('bcrypt');

const mysql = require('mysql2/promise'); // For database connections

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

const dbOptions = {
  host: 'localhost',
  user: 'root',
  password: 'fghjFGHJ85',
  database: 'happyrental'
};

app.get('/profile', authMiddleware, async (req, res) => {
  const conn = await mysql.createConnection(dbOptions);
  const [rows] = await conn.execute('SELECT id, username FROM users WHERE id = ?', [req.session.userId]);
  conn.end();

  if (!rows.length) return res.status(404).send({ error: 'User not found' });

  res.send(rows[0]);
});

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

const MySQLStore = require('express-mysql-session')(session);

// Configure MySQL session store
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root', // Usuario de MySQL
  password: 'fghjFGHJ85', // Contraseña de MySQL
  database: 'happyrental' // Nombre de la base de datos
});

// Plug session middleware into Express
app.use(session({
  secret: 'yourSecretKey', // Use a strong, random string in production
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));


// Register
app.post('/register', async (req, res) => {
  try {
    const username = req.body.username;
    const password  = req.body.password;
    const conn = await mysql.createConnection(dbOptions);
    
    const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length) return res.status(400).send({ error: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    await conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    conn.end();

    res.send({ message: 'Registered' });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  //const { username, password } = req.body;
    const username = req.body.username;
    const password  = req.body.password;

  const conn = await mysql.createConnection(dbOptions);

  const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
  conn.end();
  if (!rows.length) return res.status(400).send({ error: 'Invalid credentials' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  res.send({ message: 'Logged in' });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.send({ message: 'Logged out' }));
});

function authMiddleware(req, res, next) {
  if (!req.session.userId) return res.status(401).send({ error: 'Unauthorized' });
  next();
}






