const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

//db
const Sequelize = require("sequelize");
const sequelize = require("./util/database");

//routers
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoute");
const purchaseRoutes = require("./routes/purchaseRoutes");
const forgotpassRoutes = require("./routes/resetPassRoute");

//exporting models
const User = require("./models/User");
const Expense = require("./models/Expense");
const Order = require("./models/Order");
const ForgotPass = require("./models/ForgotPass");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPass);
ForgotPass.belongsTo(User);

app.use("/", authRoutes);
app.use("/", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/", forgotpassRoutes);

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server started at port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
