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
    console.log("input required");
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
      console.log("smtg went wrong or check email");
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
  if (!email || !password) {
    console.log("input required");
    return;
  }
  try {
    const result = await axios.post("http://localhost:3000/getUser", {
      email,
      password,
    });
    // console.log(result.data);
    if (!result.data.msg) {
      alert("check for pass or username is not valid");
      return;
    }
    alert("ur logged in");
    console.log(result.data);
  } catch (err) {
    console.log(err);
    return;
  }
}
