const User = require("../models/user");
const accountNumber = require("nodejs-unique-numeric-id-generator");

module.exports.dashboard = function (req, res) {
  return res.render("dashboard", {
    title: "dashboard",
  });
};
module.exports.register = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  return res.render("register", {
    title: "protectpay | register",
  });
};

module.exports.logIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  return res.render("login", {
    title: "protectpay | login",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          balance: req.body.balance,
          account_number: accountNumber.generate(new Date().toJSON()),
          password: req.body.password,
        },
        function (err, user) {
          if (err) {
            console.log("error in creating user while signing up", err);
            return;
          } else {
            return res.redirect("/users/login");
          }
        }
      );
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/dashboard");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logged out Successfully");
  return res.redirect("/");
};
