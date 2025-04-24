const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de tener la configuración correcta para tu conexión.

const Bike = sequelize.define('Bike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price_per_hour: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.TIMESTAMP,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'bikes',
  timestamps: false, // Si prefieres manejar las fechas con tus propios campos (como created_at)
});

module.exports = Bike;
