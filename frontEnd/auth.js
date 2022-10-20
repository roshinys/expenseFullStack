const authButton =
  document.getElementById("register") || document.getElementById("login");

window.addEventListener("DOMContentLoaded", () => {
  const pageUrl = window.location.href;
  const page = pageUrl.split("/");
  const authPage = page[page.length - 1].split(".")[0];
  if (authPage == "register") {
    authButton.addEventListener("click", addUser);
  } else {
    authButton.addEventListener("click", getUser);
  }
  //   console.log(authPage);
});

async function addUser(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!username || !email || !password) {
    //console.log("input required");
    sendMessage("input required");
    return;
  }
  try {
    const result = await axios.post("http://localhost:3000/postUser", {
      username,
      email,
      password,
    });
    // console.log(result.data);
    if (!result.data.msg) {
      sendMessage("check email");
      return;
    }
    console.log(result.data);
  } catch (err) {
    console.log(err);
    return;
  }
}

async function getUser(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // console.log(window.location);

  if (!email || !password) {
    sendMessage("input required");
    return;
  }
  try {
    const result = await axios.post("http://localhost:3000/getUser", {
      email,
      password,
    });
    sendMessage("ur logged in");
    window.location.replace(
      "file:///C:/Users/roshi/Desktop/backendSharpener/expenseTracker/frontEnd/home.html?expense=100&description=movie&category=Entertainment#"
    );
    console.log(result.data);
  } catch (err) {
    console.log(err);
    sendMessage("check pass or userid");
    return;
  }
}

function sendMessage(msg) {
  const panelContainer = document.getElementsByClassName("panel-container")[0];
  const message = document.createElement("div");
  message.className = "message";
  message.innerHTML = `<h1>${msg}</h1`;
  panelContainer.appendChild(message);
  //console.log(panelContainer);
  setTimeout(() => {
    message.remove();
  }, 2000);
}
