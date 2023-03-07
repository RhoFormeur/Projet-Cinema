const express = require('express'),
    router = express.Router()
const upload = require('../config/other/multer')

// Import des controllers
const { page404, pageAdmin, createArticle, updateArticle, deleteArticle, releaseComment, banUser, pageFilms, pageSeries, pageAnimes, pageArticle, register, login, recover, logout, pageRecover, passRecover, verify,pageVerify, createComment, updateComment, reportComment, deleteComment, pageHome, pageContact, mailContact, pageProfil, editProfil, deleteProfil, postLike, updateLike } = require("../controller")
// Import Middleware
const { isAdmin,isVerified, checkLayout } = require('../middleware')

// Visiteur
router.use(checkLayout)
router.route('/').get(pageHome)
router.route('/contact')
    .get(pageContact)
    .post(mailContact)
router.route('/films').get(pageFilms)
router.route('/series').get(pageSeries)
router.route('/animes').get(pageAnimes)
router.route('/article/:id').get(pageArticle)

// Auth
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/verify').get(pageVerify)
router.route('/verify/:id').put(verify)
router.route('/recover').post(recover)
router.route('/recovery/:id')
    .get(pageRecover)
    .put(passRecover)
router.route('/logout').post(logout)

router.use(isVerified)
// User
router.route('/profil')
    .get(pageProfil)
router.route('/profil/:id')
    .put(upload.single('image_user'), editProfil)
    .delete(deleteProfil)

router.route('/article/:id')
    .post(postLike)
    .put(updateLike)

router.route('/comment/:id')
    .post(createComment)
    .put(updateComment)
    .delete(deleteComment)
router.route('/report/:id')
    .put(reportComment)

router.use(isAdmin)
// Admin
router.route('/admin')
    .get(pageAdmin)
    .post(createArticle)
    .put(updateArticle)
router.route('/admin/:id')
    .put(releaseComment)
    .delete(deleteArticle)
router.route('/ban/:id')
    .put(banUser)

// 404
router.route('*')
    .get(page404)
// Exports de notre router
module.exports = router