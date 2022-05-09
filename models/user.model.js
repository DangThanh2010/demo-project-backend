const { DataTypes } = require('sequelize');
const {dbMySQL} = require('../database');

const User = dbMySQL.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER, //0: admin, 1: user
    allowNull: false,
  }
}, {
    tableName: 'User',
    timestamps: true,
});

dbMySQL.sync({ alter: true }).then(()=> console.log('Create userModel successfully'));

module.exports = User;