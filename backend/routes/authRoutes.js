const express = require("express");

const router = express.Router();

const authContollers = require("../controllers/authControllers");

router.post("/", authContollers.postUser);

module.exports = router;
