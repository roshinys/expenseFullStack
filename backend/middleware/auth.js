const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    // console.log("toker is=====> ", token);
    const userid = Number(jwt.verify(token, process.env.PRIVATEKEY));
    console.log("userid is ===>", userid);
    User.findByPk(userid)
      .then((user) => {
        console.log(JSON.stringify(user));
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
