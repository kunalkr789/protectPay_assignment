const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

//create transport of mails using nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    //email id from which u want to send mail
    //You have to pass your gmailid and password and if you are login with that id in your browser that it will be work fine
    user: "********",
    pass: "********",
  },
  //to remove transport layer security of mailing and another option is to disable antivirus if dont want to use this
  tls: {
    rejectUnauthorized: false,
  },
});

//to render the mail content using html
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
