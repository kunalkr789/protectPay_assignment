const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "********",
    pass: "*******",
  },
  //to remove transport layer security of mailing and another option is to disable antivirus if dont want to use this
  tls: {
    rejectUnauthorized: false,
  },
});

let renderTemplate = (data, relativepath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailer", relativepath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering", err);
        return;
      }
      mailHTML = template;
    }
  );

  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
