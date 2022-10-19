const regiterButton = document.getElementById("register");
window.addEventListener("DOMContentLoaded", () => {
  regiterButton.addEventListener("click", addUser);
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
    const result = await axios.post("http://localhost:3000/", {
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
