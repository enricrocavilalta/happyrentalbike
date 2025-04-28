const express = require('express');
const connection = require('../db'); // Importamos la conexión a la base de datos
const router = express.Router();

// Ruta para obtener todos los tours
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tours';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener tour:', err);
      return res.status(500).json({ error: 'Error al obtener los tours' });
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo tour
router.post('/', (req, res) => {
  const { name, description, price_per_hour, image_url } = req.body;
  const query = 'INSERT INTO tours (name, description, price_per_hour, image_url) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [name, description, price_per_hour, image_url], (err, result) => {
    if (err) {
      console.error('Error al crear el tour:', err);
      return res.status(500).json({ error: 'Error al crear el tour' });
    }
    res.status(201).json({ id: result.insertId, name, description, price_per_hour, image_url });
  });
});

// Ruta para actualizar una ruta
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_hour, image_url } = req.body;
  const query = 'UPDATE tours SET name = ?, description = ?, price_per_hour = ?, image_url = ? WHERE id = ?';
  
  connection.query(query, [name, description, price_per_hour, image_url, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar bicicleta:', err);
      return res.status(500).json({ error: 'Error al actualizar el tour' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tour no encontrada' });
    }
    res.json({ id, name, description, price_per_hour, image_url });
  });
});

// Ruta para eliminar una bicicleta
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tours WHERE id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el tour:', err);
      return res.status(500).json({ error: 'Error al eliminar el tour' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tour no encontrado' });
    }
    res.status(204).end(); // Respuesta sin contenido
  });
});

module.exports = router;
