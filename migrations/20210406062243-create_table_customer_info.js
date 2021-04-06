const { DataTypes } = require('sequelize');
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("customer_info",{
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
    }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("customer_info");
  }
};
