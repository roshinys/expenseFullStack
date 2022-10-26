var total = 0;
const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", () => {
  getAllExpense();
  isPremUser();
  var addExpenseButton = document.getElementById("add-expense");
  const btnchange = document.getElementsByClassName("change");
  // console.log(btnchange);
  for (let i = 0; i < btnchange.length; i++) {
    btnchange.addEventListener("click", changeItem);
  }
  // console.log(addExpenseButton);
  addExpenseButton.addEventListener("click", addExpense);
});

async function isPremUser() {
  try {
    const result = await axios.get("http://localhost:3000/", {
      headers: { Authorization: token },
    });
    // console.log(result);
    const prem = result.data.isPrem || false;
    console.log(prem);
    if (!prem) {
      throw new Error("not a premium user");
    }
    document.getElementsByClassName("prem-features")[0].classList.add("active");
    const response = await axios.get("http://localhost:3000/usersExpense", {
      headers: { Authorization: token },
    });
    // console.log(response.data);
    const userExpenses = response.data.userExpense;
    document.getElementsByClassName("leaderboard")[0].innerHTML = "";
    userExpenses.forEach((oneuser) => {
      addtoLeaderboard(oneuser);
    });
    const leaderboardusers =
      document.getElementsByClassName("leaderboard-users");
    for (let i = 0; i < leaderboardusers.length; i++) {
      leaderboardusers[i].addEventListener("click", getSpecificUser);
    }
    document.body.innerHTML =
      document.body.innerHTML +
      `<button class="download-prem">download</button>`;
    document
      .getElementsByClassName("download-prem")[0]
      .addEventListener("click", downloadfile);
    // addtoLeaderboard(userExpenses);
  } catch (err) {
    console.log(err);
    return;
  }
}

async function downloadfile() {
  try {
    const response = await axios.get("http://localhost:3000/downloadExpense", {
      headers: { Authorization: token },
    });
    console.log(response.data);
    var a = document.createElement("a");
    a.href = response.data.fileurl;
    a.download = "myexpense.csv";
    a.click();
  } catch (err) {
    console.log(err);
  }
}

async function getSpecificUser(e) {
  // console.log(e.target);
  const id = e.target.id;
  // console.log(id)
  const response = await axios.get(`http://localhost:3000/user-expense/${id}`, {
    headers: { Authorization: token },
  });
  console.log(response.data);
  const expenses = response.data.expense;
  document.getElementsByClassName("modal")[0].classList.add("active");
  const modalContainer = document.getElementsByClassName("modal-items")[0];
  expenses.forEach((expense) => {
    const newdiv = `<div class="modal-expense-items"><span>${expense.expense}</span>
            <span>${expense.description}</span>
            <span>${expense.category}</span></div>`;
    modalContainer.innerHTML = modalContainer.innerHTML + newdiv;
  });
  document.getElementsByClassName("modal-exit")[0].onclick = function () {
    document.getElementsByClassName("modal")[0].classList.remove("active");
    modalContainer.innerHTML = "";
  };
}

function addtoLeaderboard(oneuser) {
  const leaderboardhtml = document.getElementsByClassName("leaderboard")[0];
  // console.log(leaderboardhtml);
  const childhtml = `<tr>
            <th><button class="leaderboard-users" id=${oneuser.id}>${oneuser.username}</button></th>
            <th>${oneuser.total}</th>
          </tr>`;
  leaderboardhtml.innerHTML = leaderboardhtml.innerHTML + childhtml;
}

async function addExpense() {
  try {
    var expense = document.getElementById("expense").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;

    //   console.log(expense, description, category);
    const token = localStorage.getItem("token");
    const result = await axios.post(
      "http://localhost:3000/postExpense",
      {
        expense: expense,
        description: description,
        category: category,
      },
      {
        headers: { Authorization: token },
      }
    );
    // console.log(result);
    addexpensehtml(result.data.newExpense.id, expense, category, description);
    const totalhtml = document.getElementsByClassName("expense-total")[0];
    totalhtml.innerText = `Total = ${total}`;
    isPremUser();
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}
async function getAllExpense() {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.get("http://localhost:3000/getExpenses", {
      headers: { Authorization: token },
    });
    // console.log(result);
    const expenses = result.data.expenses;
    expensehtml(expenses);
    const totalhtml = document.getElementsByClassName("expense-total")[0];
    totalhtml.innerText = `Total = ${total}`;

    // console.log(result);
  } catch (err) {
    console.log(err);
    return;
  }
}

async function changeItem(e) {
  // console.log("button");
  try {
    // console.log(e.target);
    const token = localStorage.getItem("token");
    const delId = e.target.id;
    const result = await axios.delete(
      `http://localhost:3000/deleteExpense/${delId}`,
      {
        headers: { Authorization: token },
      }
    );
    // console.log(result);
    removeItem(delId);
    isPremUser();
  } catch (err) {
    console.log(err);
  }
}

function expensehtml(expenses) {
  expenses.forEach((element) => {
    addexpensehtml(
      element.id,
      element.expense,
      element.category,
      element.description
    );
  });
}

function addexpensehtml(id, expense, category, description) {
  total += parseInt(expense);
  const expenseItems = document.getElementsByClassName("expense-items")[0];
  // console.log(expenseItems);
  const newchild = document.createElement("div");
  newchild.className = "expense-item";
  newchild.innerHTML = `<span>${expense}</span><span>${category}</span><span>${description}</span><button class="change" id="${id}">X</button>`;
  expenseItems.appendChild(newchild);
  const newexpenseid = document.getElementById(id);
  newexpenseid.addEventListener("click", changeItem);
}

function removeItem(id) {
  // console.log(id);
  const element = document.getElementById(id);
  const el = element.parentElement;
  total -= el.firstChild.innerText;
  const totalhtml = document.getElementsByClassName("expense-total")[0];
  totalhtml.innerText = `Total = ${total}`;
  el.parentNode.removeChild(el);
}

document.getElementById("rzrpaybtn").addEventListener("click", rzyPayment);

async function rzyPayment(e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    {
      headers: { Authorization: token },
    }
  );
  console.log(response.data);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    name: "Express Tracker",
    order_id: response.data.order.id, // For one time payment
    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "7003442036",
    },
    theme: {
      color: "#3399cc",
    },
    // This handler function will handle the success payment
    handler: function (response) {
      console.log(response);
      axios
        .post(
          "http://localhost:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        )
        .then(() => {
          alert("You are a Premium User Now");
        })
        .catch(() => {
          alert("Something went wrong. Try Again!!!");
        });
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
}
