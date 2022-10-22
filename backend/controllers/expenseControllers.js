const User = require("../models/User");
const Expense = require("../models/Expense");

exports.getExpenses = async (req, res) => {
  try {
    // const users = await User.findByPk(1)
    // console.log(req.user);
    const expenses = await req.user.getExpenses();
    res.json({ expenses, msg: true });
  } catch (err) {
    console.log(err);
    res.status(401).send({ msg: false });
  }
};

exports.postExpense = async (req, res) => {
  // res.json("ok am workin");
  // return;
  // const users = await User.findByPk(1);
  const expense = req.body.expense;
  const description = req.body.description;
  const category = req.body.category;
  // console.log(req.user);
  const newExpense = await req.user.createExpense({
    expense: expense,
    description: description,
    category: category,
  });
  // console.log(expense, description, category, newExpense);
  res.json({ newExpense });
};

exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.expenseId;
    console.log(req.user);
    const removedExpense = await Expense.destroy({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    res.status(202).json({ id, removedExpense });
  } catch (err) {
    res.status(404).json({ msg: false });
  }
};
