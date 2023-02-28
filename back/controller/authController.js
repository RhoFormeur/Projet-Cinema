const bcrypt = require('bcrypt')
const { mailSend } = require("../config/other/nodeMailer")

exports.register = async function (req, res) {
    const { username, password, email, confirm } = req.body
    if (password == confirm) {
        const salt = 10
        bcrypt.hash(password, salt, async function (err, hash) {
            // Store hash in your password DB.
            await db.query(`INSERT INTO users (username,password,email) VALUES ('${username}','${hash}',"${email}");`);
            req.session.user = {
                email: email,
                username: username
            }
            mailSend(`ScreenMaze <${process.env.MAIL_USER}>`, `'${username}' <${email}>`, `Confirmer votre email`, `Cliquez sur le lien ci-dessous pour confirmer votre email<BR>http://localhost:3000/verify`, async function (err, info) {
                if (err) throw err
                console.log(info);
                res.render('pages/home', { flash: "Vous aller recevoir un mail pour confirmer votre inscription !" })
            })
        })
    } else res.render('pages/home', { flash: "Les deux mots de passe ne correspondent pas !" })


}

exports.login = async function (req, res) {
    const { username, password } = req.body
    const [data] = await db.query(`SELECT * FROM users WHERE username='${username}';`);
    if (!data) res.render('pages/home', { flash: "Ce compte n'éxiste pas !" })
    else {
        bcrypt.compare(password, data.password, async function (err, result) {
            if (result == true) {
                // Assignation des data user dans la session
                req.session.user = {
                    id: data.id_user,
                    email: data.email,
                    username: data.username,
                    is_verified: data.is_verified,
                    is_admin: data.is_admin
                }
                res.redirect('back')
            } else if (result == false) res.render('pages/home', { flash: "Ce n'est pas le bon mot de passe !" })
        })
    }
}

exports.recover = async function (req, res) {
    const { email } = req.body
    const [data] = await db.query(`SELECT * FROM users WHERE email="${email}";`);
    if (!data) res.render('pages/home', { flash: "Il n'y a pas de compte associé à cette adresse mail !" })
    else {
        const random = Math.floor(Math.random() * 1000000) + 1
        await db.query(`UPDATE users SET recovery=${random} WHERE email="${email}"`)
        // Assignation des data user dans la session
        req.session.user = {
            recovery: random
        }
        mailSend(`ScreenMaze <${process.env.MAIL_USER}>`, `'${data.username}' <${email}>`, `Modifier votre mot de passe`, `Cliquez sur le lien ci-dessous pour modifier votre mot de passe<BR>http://localhost:3000/recovery/${random}`, async function (err, info) {
            if (err) throw err
            else res.render('pages/home', { flash: "Vous allez bientot recevoir un mail pour modifier votre mot de passe !" })
        })
    }
}

exports.logout = function (req, res) {
    console.log("Clear Cookie session :", req.session.user.id)
    req.session.destroy(() => {
        res.clearCookie('screenmaze-cookie')
        res.redirect('/')
    })
}

exports.pageRecover = async function (req, res) {
    const { id } = req.params
    const [data] = await db.query(`SELECT * FROM users WHERE recovery=${id}`);
    if (!data) res.render('pages/home', { flash: "Il n'y a pas de compte associé à cette session pour modifier le mot de passe !" })
    else res.render('pages/recovery', { data })
}

exports.passRecover = async function (req, res) {
    const { id } = req.params
    const { password, confirm } = req.body
    if (password && confirm && password === confirm) {
        const salt = 10
        bcrypt.hash(password, salt, async function (err, hash) {
            await db.query(`UPDATE users SET password='${hash}',recovery=0 WHERE id_user=${id}`);
            res.render('pages/home', { flash: "Votre mot de passe a bien été modifié !" })
        })
    } else if (password !== confirm) res.redirect('back')
}

exports.pageVerify = async function (req, res) {
    const [data] = await db.query(`SELECT * FROM users WHERE username='${req.session.user.username}'AND email='${req.session.user.email}'`);
    if (!data) res.render('pages/home', { flash: "Il n'y pas de compte associé à votre session !" })
    else res.render('pages/verify', { data })
}

exports.verify = async function (req, res) {
    const { id } = req.params
    await db.query(`UPDATE users SET is_verified=1 WHERE id_user='${id}'`);
    res.render('pages/home', { flash: "Votre compte a bien été vérifié !" })
}