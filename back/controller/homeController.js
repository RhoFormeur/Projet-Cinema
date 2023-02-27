const { mailSend } = require("../config/other/nodeMailer")

exports.pageHome = function (req, res) {
    res.render('pages/home')
}

exports.pageContact = function (req, res) {
    res.render('pages/contact')
}

exports.mailContact = async function (req, res) {
    const { name, content, sujet, email } = req.body
    mailSend(`${name} <${email}>`, `Contact-ScreenMaze <${process.env.MAIL_USER}>`, sujet, `${content}<BR>${email}`, async function (err, info) {
        if (err) throw err
        console.log(info)
        res.render('pages/contact', { flash: "Votre mail a bien été envoyé !" })
    })
}

exports.page404 = function (req, res) {
    res.render('pages/404')
}