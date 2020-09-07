const User = require("../models/user");
const Payee = require("../models/payee");
const signupMailer = require("../mailer/sign-up");
const fundTransferMailer = require("../mailer/fund_transfer");
const accountNumber = require("nodejs-unique-numeric-id-generator");
const cron = require("node-cron");

//to render the dashboard
module.exports.dashboard = function (req, res) {
  res.header(
    "Cache-Control",
    "no-cache, private , no-store , must-revalidate , max-stale=0 , post-check=0, pre-check=0"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  return res.render("dashboard", {
    title: "dashboard",
  });
};

//to render the register page
module.exports.register = function (req, res) {

  return res.render("register", {
    title: "protectpay | register",
  });
};

//to render the login page
module.exports.logIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  return res.render("login", {
    title: "protectpay | login",
  });
};

//to sign up the user
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
    if (req.body.balance < 1000) {
      req.flash("error", "Amount cannot be less than 1000.");
      return res.redirect("back");
    }

    if (!user && req.body.balance >= 1000) {
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
            signupMailer.signup(user);
            req.flash("success", "Registered Successfully");
            return res.redirect("/users/login");
          }
        }
      );
    } else {
      return res.redirect("back");
    }
  });
};

// login and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/dashboard");
};

//logout and destroy the session
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logged out Successfully");
  return res.redirect("/");
};

//to transfer the money (one time payment)
module.exports.moneytransfer = function (req, res) {
  Payee.findOne(
    { account_number: req.body.account_number, user: req.user._id },
    function (err, user) {
      if (err) {
        console.log("error in finding user", err);
        return;
      }
      console.log(user);
      console.log(req.user._id);
      console.log(req.body.account_number);
      if (user && req.user.balance >= req.body.balance) {
        User.findOne({ account_number: req.body.account_number }, function (
          err,
          user
        ) {
          if (!user) {
            req.flash("error", "No account found");
            return res.redirect("/");
          }
          req.user.balance =
            parseInt(req.user.balance) - parseInt(req.body.balance);
          req.user.lastTrans = parseInt(req.body.balance);
          console.log(req.user.balance);
          console.log(req.body.balance);
          req.user.save();
          var balance = parseInt(req.body.balance) + parseInt(user.balance);
          user.balance = balance;
          user.lastTrans = parseInt(req.body.balance);

          user.save();
          fundTransferMailer.fundTransferCredit(user);
          fundTransferMailer.fundTransferDebit(req.user);
          req.flash("success", "Amount transferred successfully.");
          return res.redirect("/users/dashboard");
        });
      } else {
        req.flash("error", "Not enough amount in your account.");
        return res.redirect("back");
      }
    }
  );
};

//to render the payee on money transfer page
module.exports.moneyTransfer = function (req, res) {
  Payee.find({ user: req.user._id }, function (err, listAll) {
    if (err) {
      console.log("error in fetching work from db");
      return;
    }
    return res.render("moneyTransfer", {
      title: "moneyTransfer",
      payee_list: listAll,
    });
  });
};

//to add the payee under the current user 
module.exports.addPayee = function (req, res) {
  User.findOne({ account_number: req.body.account_number }, function (
    err,
    user
  ) {
    if (err) {
      console.log("error in finding payee");
      return;
    }

    if (req.body.account_number == req.user.account_number) {
      req.flash('error', 'LoggedIn user cannot add himself as a payee');
      return res.redirect("back");
    }

    if (user) {

      Payee.findOne(
        { account_number: req.body.account_number, user: req.user._id },
        function (err, user) {
          if (err) {
            console.log("error in finding payee");
            return;
          }

          if (!user) {

            Payee.create(
              {
                name: req.body.name,
                account_number: req.body.account_number,
                user: req.user._id,
              },
              function (err, user) {
                if (err) {
                  console.log("error in adding payee", err);
                  return;
                } else {
                  req.flash("success", "payee added Successfully");
                  return res.redirect("/users/dashboard");
                }
              }
            );
          } else {
            req.flash("error", "Payee already added to your list.");
            return res.redirect("back");
          }
        }
      );
    } else {
      req.flash("error", "Payee does not exist.");
      return res.redirect("back");
    }
  });
};
