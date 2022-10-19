const User = require("../models/User");

exports.postUser = async (req, res) => {
  //   console.log(req.body);
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // console.log(username, email, password);
    if (!username || !email || !password) {
      throw new Error("input needed backend");
    }
    // console.log(req.user);
    if (req.user) {
      res.json({ msg: false, msgtext: "already logged in" });
      return;
    }
    // console.log("lets c");
    // console.log(username, email, password);
    const newuser = await User.create({
      username: username,
      email: email,
      password: password,
    });
    res.user = newuser;
    res.json({ newuser, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};
