const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 8;

exports.postUser = async (req, res) => {
  //   console.log(req.body);
  try {
    const username = req.body.username;
    const email = req.body.email;
    if (!email.includes("@")) {
      throw new Error("not a valid email");
    }
    const password = JSON.stringify(req.body.password);
    // console.log(username, email, password);
    if (!username || !email || !password) {
      throw new Error("input needed backend");
    }
    // console.log(req.user);
    if (req.user) {
      res.json({ msg: false, msgtext: "already logged in" });
      return;
    }
    // console.log(password);
    const hashPass = await bcrypt.hash(password, saltRounds);
    const newuser = await User.create({
      username: username,
      email: email,
      password: hashPass,
    });
    req.user = newuser;
    res.json({ newuser, msg: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: false });
  }
};

exports.getUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  try {
    // console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findAll({ where: { email: email } });
    //console.log(user.password, password);
    if (user.length === 0) {
      res.status(404).json({ msg: false, msgText: "no user exists" });
      return;
    }
    // console.log(password, user.password, user);
    const result = await bcrypt.compare(password, user[0].password);
    console.log(result);
    if (!result) {
      res.status(401).json({ msg: false, msgText: "check password" });
      return;
    }
    const userId = user[0].id;
    // console.log(user[0].id);
    const jwttoken = generateToken(userId);
    res.json({
      token: jwttoken,
      success: true,
      msg: "Successfully Logged In",
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: false, err });
  }
};

function generateToken(id) {
  return jwt.sign(id, process.env.PRIVATEKEY);
}
