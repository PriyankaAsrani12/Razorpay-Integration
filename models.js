const { db } = require('index.js');
const { DataTypes } = require('sequelize');

const User = db.define('customer_table', {
  customer_id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer_phone_number: {
    type: DataTypes.INTEGER(15),
    // allowNull: false
    allowNull: true,
  },
  customer_amount: {
    type: DataTypes.INTEGER(15),
    allowNull: false
  }
});

db.sync();

module.exports = { db, User };
