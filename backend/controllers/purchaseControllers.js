const Razorpay = require("razorpay");
const Order = require("../models/Order");

exports.purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RZRID,
      key_secret: process.env.RZRKEY,
    });
    const amount = 1000;
    // console.log(rzp);
    const order = await rzp.orders.create({ amount, currency: "INR" });
    // console.log(response);
    const neworder = await req.user.createOrder({
      orderid: order.id,
      status: "PENDING",
    });
    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderid: order_id } })
      .then((order) => {
        order
          .update({ paymentid: payment_id, status: "SUCCESSFUL" })
          .then(() => {
            req.user.update({ isPremium: true });
            return res
              .status(202)
              .json({ sucess: true, message: "Transaction Successful" });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Something went wrong" });
  }
};
