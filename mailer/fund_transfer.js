const nodeMailer = require('../config/nodemailer');

//another way to exporting a method
exports.fundTransferCredit = (user) => {
    
    let htmlString = nodeMailer.renderTemplate({user:user} , '/signup/fund-transfer-credit.ejs');
    nodeMailer.transporter.sendMail({
        from: 'anshugargg09@gmail.com',
        to: user.email,
        subject: 'Amount Credited',
        html: htmlString
    },(err,info) => {
        if(err){console.log('error in sending mail',err);return;}
        console.log('Message Sent' , info);
        return;
    });
}

exports.fundTransferDebit = (user) => {
    
    let htmlString = nodeMailer.renderTemplate({user:user} , '/signup/fund-transfer-debit.ejs');
    nodeMailer.transporter.sendMail({
        from: 'anshugargg09@gmail.com',
        to: user.email,
        subject: 'Amount Debited',
        html: htmlString
    },(err,info) => {
        if(err){console.log('error in sending mail',err);return;}
        console.log('Message Sent' , info);
        return;
    });
}
