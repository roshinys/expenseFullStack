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

exports.getUser = async (req, res) => {
  try {
    if (req.user) {
      console.log("user already exists");
      res.json({ msg: false, msgText: "user exists" });
    }
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const userExists = await User.findAll({ where: { email: email } });
    const user = userExists[0];
    console.log(user.password, password);
    if (!userExists) {
      res.json({ msg: false, msgText: "no user exists" });
      return;
    }
    // console.log(user.password === password);
    if (user.password !== password) {
      res.json({ msg: false, msgText: "check password" });
      return;
    }
    req.user = user;
    res.json({ user, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false, err });
  }
};
