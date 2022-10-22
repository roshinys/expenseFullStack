const express = require("express");

const router = express.Router();

const expenseContollers = require("../controllers/expenseControllers");
const middleware = require("../middleware/auth");

router.get(
  "/getExpenses",
  middleware.authenticate,
  expenseContollers.getExpenses
);
router.post(
  "/postExpense",
  middleware.authenticate,
  expenseContollers.postExpense
);
router.delete(
  "/deleteExpense/:expenseId",
  middleware.authenticate,
  expenseContollers.deleteExpense
);

module.exports = router;