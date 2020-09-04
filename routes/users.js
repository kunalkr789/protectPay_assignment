const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/dashboard", usersController.dashboard);
router.get("/register", usersController.register);
router.get("/login", usersController.logIn);

router.post("/create", usersController.create);

module.exports = router;
