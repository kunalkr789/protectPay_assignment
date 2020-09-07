const nodeMailer = require('../config/nodemailer');

// to send the mail to the registered user once he/she register or sign up on your website
exports.signup = (user) => {
    
    let htmlString = nodeMailer.renderTemplate({user:user} , '/signup/sign-up-mail.ejs');
    nodeMailer.transporter.sendMail({
        from: 'anshugargg09@gmail.com',
        to: user.email,
        subject: 'User Account Created',
        html: htmlString
    },(err,info) => {
        if(err){console.log('error in sending mail',err);return;}

        console.log('Message Sent' , info);
        return;

    });
}