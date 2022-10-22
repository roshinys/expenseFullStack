const User = require("../models/User");
const Expense = require("../models/Expense");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getOneUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findByPk(userid);
    console.log(user);
    const expense = await user.getExpenses();
    res.status(200).json({ msg: true, expense });
  } catch (err) {
    console.log(err);
  }
};

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

exports.isPremUser = async (req, res) => {
  console.log(req.user.isPremium);
  console.log("ok prem");
  if (!req.user.isPremium) {
    return res.status(200).json({ isPrem: false });
  } else {
    return res.status(200).json({ isPrem: true });
  }
};

exports.usersExpense = async (req, res) => {
  try {
    const userloggedin = req.user;
    let userExpense = [];
    const users = await User.findAll();
    console.log(users.length);
    for (let i = 0; i < users.length; i++) {
      let obj = {};
      obj.id = users[i].id;
      obj.username = users[i].username;
      let total = await exp(users[i]);
      // console.log("ayoo", total);
      obj.total = total;
      userExpense.push({ ...obj });
    }
    // console.log(all);
    res.status(200).json({ userExpense });
    return;
  } catch (err) {
    console.log(err);
    res.status(404).json({ mag: "this is a prem feature" });
    return;
  }
};

async function exp(user) {
  const expenses = await user.getExpenses();

  return new Promise((resolve, reject) => {
    let total = 0;
    expenses.forEach((ex) => {
      total += parseInt(ex.expense);
    });
    // console.log(total);
    resolve(total);
  });
}
