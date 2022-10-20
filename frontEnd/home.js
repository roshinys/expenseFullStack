window.addEventListener("DOMContentLoaded", () => {
  var addExpenseButton = document.getElementById("add-expense");
  console.log(addExpenseButton);
  addExpenseButton.addEventListener("click", addExpense);
});
async function addExpense() {
  try {
    var expense = document.getElementById("expense").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    //   console.log(expense, description, category);
    const result = await axios.post("http://localhost:3000/postExpense", {
      expense: expense,
      description: description,
      category: category,
    });

    const expenseItems = document.getElementsByClassName("expense-items")[0];
    console.log(expenseItems);
    const newchild = document.createElement("div");
    newchild.className = "expense-item";
    newchild.innerHTML = `<span>${expense}</span><span>${category}</span><span>${description}</span><button class="change" id="1">X</button>`;
    expenseItems.appendChild(newchild);
  } catch (err) {
    console.log(err);
    return;
  }
}
