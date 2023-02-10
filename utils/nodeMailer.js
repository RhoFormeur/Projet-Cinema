const nodemailer = require("nodemailer");
const { MAIL_SERVICE, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_TLS } = process.env;

let transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    },
    tls: {
        ciphers: MAIL_TLS
    }
});

exports.mailSend = function (emailFrom, emailSend, sujet, content, callback) {
    let mailOptions = {
        from: emailFrom,
        to: emailSend,
        subject: sujet,
        html: content
    };

    transporter.sendMail(mailOptions, function (err, info) {
        transporter.close();
        if (err) callback(err, info);
        else callback(null, info);
    });
}