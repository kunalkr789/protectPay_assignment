const nodeMailer = require("../config/nodemailer");

//to send the mail to payee once the money transfer have done
exports.fundTransferCredit = (user) => {
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/signup/fund-transfer-credit.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "********", //you have to enter the mail id from which u want to send mail
      to: user.email,
      subject: "Amount Credited",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      }
      console.log("Message Sent", info);
      return;
    }
  );
};

//to send the mail to payer
exports.fundTransferDebit = (user) => {
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/signup/fund-transfer-debit.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "********",
      to: user.email,
      subject: "Amount Debited",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      }
      console.log("Message Sent", info);
      return;
    }
  );
};
