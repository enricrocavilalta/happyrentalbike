const express = require('express');
const app = express();

app.get('/profile', (req, res) => {
  res.send({ message: 'Profile route works!' });
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
