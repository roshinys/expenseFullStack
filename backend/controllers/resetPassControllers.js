const uuid = require("uuid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPass");

exports.updatePass = async (req, res) => {
  const resetpassid = req.params.id;
  const newpass = JSON.stringify(req.query.newpassword);
  const response = await ForgotPassword.findByPk(resetpassid);
  // console.log(response);
  const user = await User.findByPk(response.userId);
  const newhashpass = await bcrypt.hash(newpass, saltRounds);
  const updateduser = await user.update({ password: newhashpass });
  res.status(200).json({ msg: "ok", user });
};

exports.forgotpass = async (req, res) => {
  //   console.log(req.body);
  try {
    const email = req.body.email;
    // console.log(email);
    const users = await User.findAll({ where: { email: email } });
    const user = users[0];
    if (!user) {
      throw new Error("user not in db");
    }
    const id = uuid.v4();
    // console.log(id);
    const response = await ForgotPassword.create({
      id,
      isActive: true,
      userId: user.id,
    });
    res
      .status(200)
      .json({ msg: true, link: `http://localhost:3000/resetPass/${id}` });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: false });
  }
};

exports.resetPass = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ForgotPassword.findByPk(id);
    //   console.log(response);
    if (!response.isActive) {
      throw new Error("cant use the same link again to change pass");
    }
    // const newres = await response.update({ isActive: false });
    // console.log(newres);
    res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "smtg went wrong" });
  }
};
