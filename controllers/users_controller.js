const User = require("../models/user");

module.exports.dashboard = function (req, res) {
  return res.render("dashboard", {
    title: "dashboard",
  });
};
module.exports.register = function (req, res) {
  return res.render("sign_up", {
    title: "protectpay | register",
  });
};

module.exports.logIn = function (req, res) {
  return res.render("sign_in", {
    title: "protectpay | login",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up", err);
          return;
        }

        return res.redirect("/users/login");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  // TODO later
};
