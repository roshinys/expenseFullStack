const express = require("express");

const router = express.Router();

const expenseContollers = require("../controllers/expenseControllers");

router.get("/", expenseContollers.getExpenses);
router.post("/postExpense", expenseContollers.postExpense);

module.exports = router;
