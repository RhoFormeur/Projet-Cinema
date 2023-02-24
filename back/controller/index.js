const { pageAdmin, createArticle, updateArticle, deleteArticle, releaseComment } = require("./adminController");
const { pageFilms, pageSeries, pageAnimes, pageArticle } = require('./articleController');
const { register, login, recover,logout,pageRecover,passRecover,verify,pageVerify } = require('./authController');
const { createComment, updateComment, reportComment, deleteComment } = require('./commentController');
const { pageHome, pageContact, mailContact,page404 } = require('./homeController');
const { pageProfil, editProfil, deleteProfil, postLike, updateLike} = require('./userController');

module.exports = {
    // Admin
    pageAdmin, createArticle, updateArticle, deleteArticle, releaseComment,
    // Article
    pageFilms, pageSeries, pageAnimes, pageArticle,
    // Auth
    register, login, recover,logout,pageRecover,passRecover,verify,pageVerify,
    // Comment
    createComment, updateComment, reportComment, deleteComment,
    // Home
    pageHome, pageContact, mailContact,page404,
    // CRUD Article
    pageProfil, editProfil, deleteProfil, postLike, updateLike
}