const User = require("../models/User");
const Expense = require("../models/Expense");

exports.getExpenses = async (req, res) => {
  res.json("expense routes");
};

exports.postExpense = async (req, res) => {
  // res.json("ok am workin");
  // return;
  const users = await User.findByPk(1);
  const expense = req.body.expense;
  const description = req.body.description;
  const category = req.body.category;
  const newExpense = await users.createExpense({
    expense: expense,
    description: description,
    category: category,
  });
  // console.log(expense, description, category, newExpense);
  res.json({ newExpense });
};
