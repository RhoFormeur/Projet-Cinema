exports.isAdmin = async (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        res.render('pages/home');
    } else {
        const [data] = await db.query(`SELECT is_admin FROM users WHERE email="${req.session.user.email}"`);
        (data.is_admin === req.session.user.is_admin && data.is_admin === 0) ? res.render('pages/home') : next()
    }
}

exports.isVerified = async (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        res.render('pages/home');
    } else {
        const [data] = await db.query(`SELECT is_verified FROM users WHERE email="${req.session.user.email}"`);
        (data.is_verified === req.session.user.is_verified && data.is_verified === 0) ? res.render('pages/home') : next()
    }
}

exports.checkLayout = async (req, res, next) => {
    if (!req.session.user || !req.session.user.id) next()
    else if (req.session.user.id) {
        const [data] = await db.query(`SELECT is_verified,is_admin FROM users WHERE email="${req.session.user.email}"`);
        (data.is_admin === req.session.user.is_admin && data.is_admin === 1) ? res.locals = { layout: "layout_admin" } : res.locals = { layout: "layout_user" }
        next()
    }
}