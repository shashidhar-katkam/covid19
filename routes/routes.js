const Util = require('../util/util');
const routes = require('express').Router();
const UserService = require('../services/UserService');
const UserNewsService = require('../services/user/dataService');
const AuthService = require('../services/user/auth/index');
const RoutesURL = require('../costants/constants');
const nodemailer = require('nodemailer');
const URLs = RoutesURL.RoutesURL;

routes.post(URLs.createStory, Util.verifytoken, function (req, res) {
    UserNewsService.createStory(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getStories, Util.verifytoken, function (req, res) {
    UserNewsService.getStories(req.body, (message) => {
        res.json(message);
    });
});



routes.post(URLs.raiseHelpRequest1, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    var requestObj = req.body;
    requestObj.user = Util.getUserBasicInfo(loginUser.user);
    UserNewsService.raiseHelpRequest1(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getHelpRequests1, Util.verifytoken, function (req, res) {
    UserNewsService.getHelpRequests1(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.registerUser, function (req, res) {
    AuthService.RegisterUser(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.login, function (req, res) {
    AuthService.Login(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getMyProfileInfo, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserService.getUserDetailsbyID({ id: loginUser.user._id }, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updateMyProfile, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    if (loginUser.user._id === req.body.data.id) {
        UserService.updateProfile(req.body, (message) => {
            res.json(message);
        });
    } else {
        res.sendStatus(403);
    }
});

routes.post(URLs.checkIsUserAvailable, function (req, res) {
    UserService.checkIsUserAvailableByFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.changePassword, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    if (loginUser.user._id === req.body.id) {
        UserService.changePassword(req.body, (message) => {
            res.json(message);
        });
    } else {
        res.sendStatus(403);
    }
});

routes.post(URLs.postComment, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    var requestObj = req.body;
    var le = {
        RefId: requestObj.RefId,
        CommetPoster: Util.getUserBasicInfo(loginUser.user),
        Comment: requestObj.comment
    };
    UserNewsService.PostComment(le, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getCommentsByRef, function (req, res) {
    UserNewsService.getCommentsByRefId(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.verifyEmail, function (req, res) {
    AuthService.VerifyEmail(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.verifyOTP, function (req, res) {
    AuthService.VerifyOTP(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.verifyUserForgetPassword, function (req, res) {
    AuthService.VerifyUser(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.forgetPassword, function (req, res) {
    AuthService.forgetPassword(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.uploadProfilePic, Util.upload.single('file'), function (req, res) {
    Util.CompressImages(req, (message) => {
        res.json(message);
    });
});

routes.post('/api/uploadfiles', Util.uploadfile.single('file'), function (req, res) {
    res.json({
        'success': true,
        'fileNewName': req.file.filename,
        'filePath': '/uploads/files/' + req.file.filename,
        'originalName': req.file.originalname,
        'mimeType': req.file.mimetype
    });
});


let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    //secure: true,
    auth: {
        user: 'shashi2puppy@gmail.com',
        pass: 'yspnotbtjadkesif'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = routes;