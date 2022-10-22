const express = require("express");

const router = express.Router();

const authContollers = require("../controllers/authControllers");

router.post("/postUser", authContollers.postUser);
router.post("/getUser", authContollers.getUser);
router.post("/changepass", authContollers.changePass);

module.exports = router;
