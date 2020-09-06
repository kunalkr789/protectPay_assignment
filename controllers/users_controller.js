const User = require("../models/user");
const Payee = require("../models/payee");
const signupMailer = require("../mailer/sign-up");
const fundTransferMailer = require("../mailer/fund_transfer");
const accountNumber = require("nodejs-unique-numeric-id-generator");
const cron = require("node-cron");

module.exports.dashboard = function (req, res) {
  res.header('Cache-Control' , 'no-cache, private , no-store , must-revalidate , max-stale=0 , post-check=0, pre-check=0');
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  return res.render("dashboard", {
    title: "dashboard",
  });
};

module.exports.register = function (req, res) {
  // if (req.isAuthenticated()) {
  //   return res.redirect("/users/dashboard");
  // }
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

// module.exports.moneyTransfer = function (req, res) {
//   return res.render("moneyTransfer", {
//     title: "protectpay | Transfer",
//   });
// };

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
        User.findOne({ account_number: req.body.account_number }, function (err, user) {
          if (!user) {
            req.flash("error", "No account found");
            return res.redirect("/");
          }
          req.user.balance = parseInt(req.user.balance) - parseInt(req.body.balance);
          console.log(req.user.balance);
          console.log(req.body.balance);
          req.user.save();
          var balance = parseInt(req.body.balance) + parseInt(user.balance);
          user.balance = balance;
          fundTransferMailer.fundTransferCredit(user);
          fundTransferMailer.fundTransferDebit(req.user);
          user.save();
            
            req.flash("success", "Amount transferred successfully");
            return res.redirect("/users/dashboard");
          });
        
      console.log(req.user._id);
      console.log(req.body.account_number);
      if (user && req.user.balance >= req.body.balance) {
        req.flash("Success", "Amount transferred successfully.");
        User.findOne({ account_number: req.body.account_number }, function (
          err,
          user
        ) {
          if (!user) {
            req.flash("error", "No account found");
            return res.redirect("back");
          } else {
            req.user.balance =
              parseInt(req.user.balance) - parseInt(req.body.balance);
            console.log(req.user.balance);
            req.user.save();
            var balance = parseInt(req.body.balance) + parseInt(user.balance);
            user.balance = balance;
            user.save(function (err) {
              req.flash("Success", "Amount transferred successfully.");
              //console.log("transfered");
              //return res.redirect("back");
            });
          }
        });
        req.flash("Success", "Amount transferred successfully.");
        console.log("transfered");
        //console.log(req);

        return res.redirect("/users/dashboard");
      } else {
        req.flash("error", "Not enough amount in your account.");
        return res.redirect("back");
      }
    }
  );
};

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

module.exports.addPayee = function (req, res) {
  User.findOne({ account_number: req.body.account_number }, function (
    err,
    user
  ) {
    if (err) {
      console.log("error in finding payee");
      return;
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
