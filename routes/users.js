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
router.get("/moneyTransfer", usersController.moneyTransfer);
//router.get("/addPayee", usersController.addPayee);

router.post("/create", usersController.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  usersController.createSession
);


router.post("/moneyTransfer" , usersController.moneytransfer);
router.post("/addPayee", usersController.addPayee);

router.get("/logout", usersController.destroySession);
module.exports = router;
