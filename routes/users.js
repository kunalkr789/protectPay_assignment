const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.get(
  "/dashboard",
  passport.checkAuthentication,
  usersController.dashboard
);

router.get("/register", usersController.register);
router.get("/login", usersController.logIn);
router.get("/moneyTransfer" , usersController.moneyTransfer);

router.post("/create", usersController.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  usersController.createSession
);
router.get("/logout", usersController.destroySession);
module.exports = router;
