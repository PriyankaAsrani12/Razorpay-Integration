const { db } = require('../db/sql');
const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');
const Customer = db.define('customer_info', {
  order_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
  },
  payment_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  signature: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isSuccess: {
    type: DataTypes.STRING(255),
    defaultValue:null
}});


db.sync();

module.exports=Customer;