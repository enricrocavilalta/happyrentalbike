const express = require('express');
const connection = require('../db'); // Importamos la conexión a la base de datos
const router = express.Router();

// Ruta para obtener todas las bicicletas
router.get('/', (req, res) => {
  const query = 'SELECT * FROM bikes';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener bicicletas:', err);
      return res.status(500).json({ error: 'Error al obtener las bicicletas' });
    }
    res.json(results);
  });
});

// Ruta para agregar una nueva bicicleta
router.post('/', (req, res) => {
  const { name, description, price_per_hour, image_url } = req.body;
  const query = 'INSERT INTO bikes (name, description, price_per_hour, image_url) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [name, description, price_per_hour, image_url], (err, result) => {
    if (err) {
      console.error('Error al crear bicicleta:', err);
      return res.status(500).json({ error: 'Error al crear la bicicleta' });
    }
    res.status(201).json({ id: result.insertId, name, description, price_per_hour, image_url });
  });
});

// Ruta para actualizar una bicicleta
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_hour, image_url } = req.body;
  const query = 'UPDATE bikes SET name = ?, description = ?, price_per_hour = ?, image_url = ? WHERE id = ?';
  
  connection.query(query, [name, description, price_per_hour, image_url, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar bicicleta:', err);
      return res.status(500).json({ error: 'Error al actualizar la bicicleta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bicicleta no encontrada' });
    }
    res.json({ id, name, description, price_per_hour, image_url });
  });
});

// Ruta para eliminar una bicicleta
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM bikes WHERE id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar bicicleta:', err);
      return res.status(500).json({ error: 'Error al eliminar la bicicleta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bicicleta no encontrada' });
    }
    res.status(204).end(); // Respuesta sin contenido
  });
});

module.exports = router;
