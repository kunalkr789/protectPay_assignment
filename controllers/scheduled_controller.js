const User = require("../models/user");
const Payee = require("../models/payee");
const cron = require("node-cron");

module.exports.ScheduleTransfer = function (req, res) {
  if (req.user.balance >= req.body.balance) {
    Payee.findOne(
      { account_number: req.body.account_number, user: req.user._id },
      function (err, user) {
        if (err) {
          console.log("error in finding user", err);
          return;
        }
        console.log(req.user._id);
        console.log(req.body.account_number);
        if (user && req.user.balance >= req.body.balance) {
          User.findOne({ account_number: req.body.account_number }, function (
            err,
            user
          ) {
            if (!user) {
              req.flash("error", "No account found");
              return res.redirect("back");
            } else {
              var date = "";
              if (req.body.term == "Daily") {
                date = "30 10 * * *";
              } else if (req.body.term == "Monthly") {
                date = "* 10 01 * *";
              } else if (req.body.term == "Quarterly") {
                date = "2 3 1 1,4,7,10 *";
              }
              console.log(req.body.term);
              cron.schedule(date, function () {
                req.user.balance =
                  parseInt(req.user.balance) - parseInt(req.body.balance);
                console.log(req.user.balance);
                req.user.save();
                var balance =
                  parseInt(req.body.balance) + parseInt(user.balance);
                user.balance = balance;
                user.save(function (err) {
                  //console.log("transfered");
                  //return res.redirect("back");
                });
              });
            }
          });
          req.flash("Success", "Amount will be transferred at specified time.");
          console.log("Amount will be transferred at specified time.");
          res.redirect("back");
        } else {
          req.flash("error", "Not enough amount in your account.");
          return res.redirect("back");
        }
      }
    );
    return;
  }
};
