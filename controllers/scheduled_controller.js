const User = require("../models/user");
const Payee = require("../models/payee");

//importing cron to do schedule payment
const cron = require("node-cron");
const fundTransferMailer = require('../mailer/fund_transfer');


//to do transfer the payment according to the schedule
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
                date = "19 22 * * *";
              } else if (req.body.term == "Monthly") {
                date = "* 10 01 * *";
              } else if (req.body.term == "Quarterly") {
                date = "2 3 1 1,4,7,10 *";
              }
              console.log(req.body.term);
              cron.schedule(date, function () {
                req.user.balance =
                  parseInt(req.user.balance) - parseInt(req.body.balance);
                req.user.lastTrans = parseInt(req.body.balance);
                console.log(req.user.balance);
                req.user.save();
                var balance =
                  parseInt(req.body.balance) + parseInt(user.balance);
                user.balance = balance;
                user.lastTrans = parseInt(req.body.balance);
                user.save();

                //to send the mail to both users(payee and payer)
                fundTransferMailer.fundTransferCredit(user);
                fundTransferMailer.fundTransferDebit(req.user);


              });
            }
          });
          //to show the noty notification
          req.flash("success", "Amount will be transferred at specified time.");
          // console.log("Amount will be transferred at specified time.");
          return res.redirect("back");
        } else {
          req.flash("error", "Not enough amount in your account.");
          return res.redirect("back");
        }
      }
    );
    return;
  }
};
