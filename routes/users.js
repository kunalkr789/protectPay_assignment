const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");
const scheduleController = require("../controllers/scheduled_controller");

router.get(
  "/dashboard",
  passport.checkAuthentication,
  usersController.dashboard
);

router.get("/register", usersController.register);
router.get("/login", usersController.logIn);
router.get("/moneyTransfer", usersController.moneyTransfer);
//router.get("/addPayee", usersController.addPayee);

//to create the user
router.post("/create", usersController.create);

//to login the user
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  usersController.createSession
);

//for money transfer according to schedule
router.post("/ScheduleTransfer", scheduleController.ScheduleTransfer);

//for money transfer(One time)
router.post("/moneyTransfer", usersController.moneytransfer);

//to add payee for money transfer
router.post("/ScheduleTransfer", scheduleController.ScheduleTransfer);
router.post("/moneyTransfer", usersController.moneytransfer);
router.post("/addPayee", usersController.addPayee);

//to destroy the session
router.get("/logout", usersController.destroySession);
module.exports = router;
