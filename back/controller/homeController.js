const { mailSend } = require("../config/other/nodeMailer")

exports.pageHome = function (req, res) {
    if (!req.session.user) res.render('pages/home')
    else if (req.session.user.is_admin === 1) res.render("pages/home", { layout: "layout_admin" })
    else res.render('pages/home', { layout: 'layout_user' })
}

exports.pageContact = function (req, res) {
    if (!req.session.user) res.render('pages/contact')
    else if (req.session.user.is_admin === 1) res.render("pages/contact", { layout: "layout_admin" })
    else res.render('pages/contact', { layout: 'layout_user' })
}

exports.mailContact = async function (req, res) {
    const { name, content, sujet, email } = req.body
    mailSend(`${name} <${email}>`, `Contact-ScreenMaze <${process.env.MAIL_USER}>`, sujet, `${content}<BR>${email}`, async function (err, info) {
        if (err) throw err
        console.log(info)
        if (!req.session.user) res.render('pages/contact', { flash: "Votre mail a bien été envoyé !" })
        else if (req.session.user.is_admin === 1) res.render('pages/contact', { flash: "Votre mail a bien été envoyé !", layout: "layout_admin" })
        else res.render('pages/contact', { flash: "Votre mail a bien été envoyé !", layout: "layout_user" })
    })
}

exports.page404 = function (req, res) {
    if (!req.session.user) res.render('pages/404')
    else if (req.session.user.is_admin === 1) res.render("pages/404", { layout: "layout_admin" })
    else res.render('pages/404', { layout: 'layout_user' })
}