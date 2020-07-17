const routes = require('express').Router();
const Util = require('../../util/util');
const UserService = require('../../services/UserService');
const AdminNewsService = require('../../services/admin/dataService');
const RoutesURL = require('../../costants/constants');
const QAPService = require('../../services/user/qapService');
const Files = require('../../mongoose/Files');
const FileService = require('../../services/admin/fileService');
const URLs = RoutesURL.RoutesURL;

routes.post(URLs.approveAndPostNews, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    let requestObj = req.body;
    requestObj.newsInfo.English['ReviewerId'] = loginUser.user._id;
    AdminNewsService.ApproveAndPost(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updateMainNews, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.updateETNews(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.createMainNews, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    let requestObj = req.body;
    requestObj.Telugu['ReviewerId'] = loginUser.user._id;
    requestObj.English['ReviewerId'] = loginUser.user._id;
    AdminNewsService.createMainNews(requestObj, (message) => {
        res.json(message)
    });
});

routes.get(URLs.getLatestNewsSubmittedByUser, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getLatestNewsSubmittedByUser({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getTNewsByERefId, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getNewsByRef(req.body, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getAllNewsPostedByUser, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getAllNewsSubmittedByUser({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getNewsCountByStatus, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getNewsCountByStatus({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllNewsByUserId, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getAllNewsByUserId(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllUserPostedNewsByFilter, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getAllUserPostedNewsByFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllUsersBySearch, Util.verifyTokenForAdmin, function (req, res) {
    let requestObj = req.body;
    console.log(requestObj);
    let fi = { "$regex": `/shashidhar$/`, "$options": "i" };
    let fi2 = new RegExp('.*' + requestObj['search'] + '.*', "i");
    UserService.getAllUsersNamesByQuery({ 'firstName': fi2, accountStatus: { $in: [2, 3, 4] } }, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getAllSelfAdminRequests, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getAllSelfAdminRequests({ isReviewed: false }, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getRejectedNews, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getRejectedNews({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getMainNewsByFilter, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getUserSubmittedNewsByStatus(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getMainNewsByFilter2, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getallNewsForAdmin(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getMainNewsByFilter3, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getallNewsForAdminFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getNewsByFilterAll, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getNewsByFilterAll(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getUserDetailsById, Util.verifyTokenForAdmin, function (req, res) {
    UserService.getUserDetailsbyID(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getUserDetailsByIdAndNewsCount, Util.verifyTokenForAdmin, function (req, res) {
    UserService.getUserInfoAndNewsCountOfUserNews(req.body, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getRejectedUsers, Util.verifyTokenForSuperAdmin, function (req, res) {
    UserService.getRejectedUsers({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getNewsCountByCategory, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getNewsCountByCategory({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getUsersCountByAccountStatus, Util.verifyTokenForSuperAdmin, function (req, res) {
    UserService.getUsersCountByAccountStatus({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllUsersByFilter, Util.verifyTokenForSuperAdmin, function (req, res) {
    UserService.getAllUsersByFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updateProfile, Util.verifyTokenForSuperAdmin, function (req, res) {
    const loginUser = req.authData;
    let requestObj = req.body;
    requestObj['reviewerId'] = loginUser.user._id;
    UserService.updateUserProfile(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updateProfileForSelfAdmin, Util.verifyTokenForSuperAdmin, function (req, res) {
    const loginUser = req.authData;
    let requestObj = req.body;
    requestObj['reviewerId'] = loginUser.user._id;
    UserService.updateProfileForSelfAdmin(requestObj, (message) => {
        res.json(message);
    });
});

///////////////////////HelpSetion//////////////////
routes.get(URLs.getAllHelpRequest, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getAllHelpRequests({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getHelpRequestsCountByStatus, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getHelpRequestsCountByStatus({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getPostsCountByStatus, Util.verifyTokenForAdmin, function (req, res) {
    QAPService.getPostsCountByStatus({}, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getHelpRequestsCountByCategory, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getHelpRequestsCountByCategory({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.acceptHelpRequestAndCreate, Util.verifyTokenForSuperAdmin, function (req, res) {
    const loginUser = req.authData;
    let requestObj = req.body;
    requestObj.newsInfo.English['ReviewerId'] = loginUser.user._id;
    AdminNewsService.acceptHelpRequestAndCreate(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllHelpReqestsForAdmin, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getAllHelpReqestsForAdmin(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllUserNewsForAdmin, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.getAllUserNewsForAdmin(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllPostsForAdmin, Util.verifyTokenForAdmin, function (req, res) {
    QAPService.getAllPostsForAdmin(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllEnHelpReqestsForAdmin, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getAllEnHelpReqestsForAdmin(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getHelpRequestInTeByERefId, Util.verifyTokenForSuperAdmin, function (req, res) {
    AdminNewsService.getHelpRequestInTeByERefId(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updateHelpRequestInET, Util.verifyTokenForAdmin, function (req, res) {
    AdminNewsService.updateHelpRequestInET(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.SavePersonInfo, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    var requestObj = req.body;
    requestObj.CreatedBy = Util.getUserBasicInfo(loginUser.user);
    QAPService.SavePost(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.updatePost, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    var requestObj = req.body;
    requestObj.CreatedBy = Util.getUserBasicInfo(loginUser.user);
    QAPService.updatePost(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllUsersByFilter3, Util.verifyTokenForSuperAdmin, function (req, res) {
    UserService.getAllUsersByFilter3(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.deleteUploadedFile, Util.verifyTokenForAdmin, (req, res) => {
    var file = req.body;
    Util.deleteFile(file, (message) => {
        res.json(message);
    })
});

routes.post(URLs.getAllFiles, Util.verifyTokenForAdmin, function (req, res) {
    FileService.getAllFiles(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getFilesByFilterAll, Util.verifyTokenForAdmin, function (req, res) {
    FileService.getFilesByFilterAll(req.body, (message) => {
        res.json(message);
    });
});


routes.post(URLs.addImages, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    FileService.addImages({ files: req.body, user: Util.getUserBasicInfo(loginUser.user) }, (message) => {
        res.json(message);
    });
});


routes.post(URLs.getImages, Util.verifyTokenForAdmin, function (req, res) {
    FileService.getAllImagesForAdmin(req.body, (message) => {
        res.json(message);
    });
});
routes.post(URLs.updateImage, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    var requestObj = req.body;
    FileService.updateImage({ _id: requestObj._id, updateObj: { show: requestObj.show } }, (message) => {
        res.json(message);
    });
});




routes.post(URLs.addImagesM, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    var requestObj = req.body;
    requestObj.user = Util.getUserBasicInfo(loginUser.user);
    FileService.addImagesM(requestObj, (message) => {
        res.json(message);
    });
});


routes.post(URLs.getImagesM, Util.verifyTokenForAdmin, function (req, res) {
    FileService.getAllImagesForAdminM(req.body, (message) => {
        res.json(message);
    });
});
routes.post(URLs.updateImageM, Util.verifyTokenForAdmin, function (req, res) {
    const loginUser = req.authData;
    var requestObj = req.body;
    FileService.updateImageM({ _id: requestObj._id, updateObj: { show: requestObj.show } }, (message) => {
        res.json(message);
    });
});

routes.post(URLs.deleteFile, Util.verifyTokenForAdmin, (req, res) => {
    Util.deleteFile(req.body, (message) => {
        res.json(message);
    });
});



routes.get('/api/test', function (req, res) {
    Files.getAllFiles1({}, (err, data) => {
        if (err) {
            res.json(err);

        } else if (data) {
            res.json(data);
        }
    });
});

routes.get('/api/test2', function (req, res) {
    AdminNewsService.getAllSelfAdminRequests({}, (message) => {
        res.json(message);
    });
});

routes.get('/test34', (req, res) => {
    AdminNewsService.test34({}, (message) => {
        res.json(message);
    });
});

module.exports = routes;