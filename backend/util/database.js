const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "expensetracker",
  process.env.DBUSER,
  process.env.DBPASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;
