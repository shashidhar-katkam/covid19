const Util = require('../util/util');
const routes = require('express').Router();
const UserService = require('../services/UserService');
const UserNewsService = require('../services/user/dataService');
const QAPService = require('../services/user/qapService');
const AuthService = require('../services/user/auth/index');
const RoutesURL = require('../costants/constants');
const PollService = require('../services/user/pollService');
const nodemailer = require('nodemailer');
const FileService = require('../services/admin/fileService');
const URLs = RoutesURL.RoutesURL;
const dateTime = require('date-time');
const moment = require('moment');
var path = require("path");
//const transport = nodemailer.createTransport(options[defaults])
const multer = require('multer');



let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    //secure: true,
    auth: {
        user: 'shashi2puppy@gmail.com',
        pass: 'yspnotbtjadkesif'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

// const transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'shashi2puppy@gmail.com',
//         pass: 'yspnotbtjadkesif' // naturally, replace both with your real credentials or an application-specific password
//     },
//     tls: {
//         // do not fail on invalid certs
//         rejectUnauthorized: false
//     }
// });


// const message = {
//     from: 'shashi2puppy@gmail.com', // Sender address
//     to: 'shashidhar2katkam@gmail.com',         // List of recipients
//     subject: 'Testing', // Subject line
//     text: 'hello testing' // Plain text body
// };
// transport.sendMail(message, function (err, info) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(info);
//         res.json(info);
//     }
// });


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({
    storage: storage
}).single('file');

// routes.get('/', (req, res) => {
//     console.log(req);
//     res.send("Hello World");
// })


routes.post('/api/uploadfiles', Util.uploadfile.single('file'), function (req, res) {
    res.json({
        'success': true,
        'fileNewName': req.file.filename,
        'filePath': '/uploads/files/' + req.file.filename,
        'originalName': req.file.originalname,
        'mimeType': req.file.mimetype
    });

    // Util.CompressImageFiless(req,(message)=>{
    //     res.json(message);
    // });
});

routes.post('/api/addprofilepic', Util.uploadp.single('phot'), function (req, res) {
    res.json({
        'success': true,
        'fileNewName': req.file.filename,
        'filePath': '/uploads/files/' + req.file.filename,
        'originalName': req.file.originalname,
        'mimeType': req.file.mimetype
    });

    // Util.CompressImages(req,(message)=>{
    //     res.json(message);
    // });
});

routes.post(URLs.createNews, function (req, res) {
    UserNewsService.createNews(req.body, (message) => {
        res.json(message);
    });
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

routes.post(URLs.getPollOptionsByRefId, function (req, res) {
    PollService.getPollOptionsByRefId(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.checkIsUserIsPolled, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    PollService.checkIsUserIsPolled({ _id: loginUser.user._id, RefId: req.body.id }, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getPollResultsByRefId, function (req, res) {
    PollService.getPollResultsByRefId(req.body, (message) => {
        res.json(message);
    });
});
routes.post(URLs.SavePollResults, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    var requestObj = req.body;
    var le = {
        RefId: requestObj.RefId,
        PolledBy: Util.getUserBasicInfo(loginUser.user),
        Poll: requestObj.Poll
    };

    PollService.SavePollResults(le, (message) => {
        res.json(message);
    });
});

routes.post(URLs.saveQuestion, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    var requestObj = req.body;
    var le = { RefId: requestObj.RefId, QAskedBy: Util.getUserBasicInfo(loginUser.user), Question: requestObj.Question };

    QAPService.SaveQuestion(le, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getQAsByRefId, function (req, res) {
    QAPService.getQAsByRefId(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.createNewsBySelfAdmin, Util.verifyTokenFormSelfAdmin, function (req, res) {
    let requestObj = req.body;
    requestObj['SelfAdminPosted'] = true;
    UserNewsService.createNews(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.raiseHelpRequest, function (req, res) {
    UserNewsService.raiseHelpRequest(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.registerUser, function (req, res) {
    AuthService.RegisterUser(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getUserInfoAndNewsCount, function (req, res) {
    UserService.getUserInfoAndNewsCount(req.body, (message) => {
        res.json(message);
    });
});

routes.get(URLs.checkIsRequestSubmitted, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserNewsService.checkIsRequestSubmitted({ userId: loginUser.user._id }, (message) => {
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

routes.post(URLs.login, function (req, res) {
    AuthService.Login(req.body, (message) => {
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

routes.post('/api/posts', Util.verifytoken, function (req, res) {
    res.json({ message: 'post created', authData: req.authData });
});

routes.post(URLs.uploadProfilePic, Util.upload.single('file'), function (req, res) {
    Util.CompressImages(req, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getAllNewsPostedByMe, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserNewsService.getAllNewsPostedByMe({ "User._id": loginUser.user._id }, (message) => {
        res.json(message);
    });
});


routes.get(URLs.getMyHelpRequests, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserNewsService.getMyHelpRequests({ "User._id": loginUser.user._id }, (message) => {
        res.json(message);
    });
});

routes.get(URLs.sendSelfAdminRequest, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserNewsService.sendSelfAdminRequest({ userId: loginUser.user._id }, (message) => {
        res.json(message);
    });
});


routes.get(URLs.getAllInfoForMyDashboard, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    UserNewsService.getAllInfoForMyDashboard({ UserId: loginUser.user._id }, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getAllNewsPostedByMeAndFilter, Util.verifytoken, function (req, res) {
    var loginUser = req.authData;
    let requestObj = req.body;
    requestObj.UserId = loginUser.user._id;
    UserNewsService.getAllNewsPostedByMeAndFilter(requestObj, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getPosts, function (req, res) {
    QAPService.getPosts(req.body, (message) => {
        res.json(message);
    });
});


routes.post(URLs.saveQuery, function (req, res) {
    UserNewsService.saveQuery(req.body, (message) => {
        res.json(message)
    });
});

routes.post(URLs.getImages, function (req, res) {
    FileService.getImages(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getImagesM, function (req, res) {
    FileService.getImagesM(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.raiseDonationRequest, function (req, res) {
    UserNewsService.raiseDonationRequest(req.body, (message) => {
        res.json(message)
    });
});

routes.post(URLs.updateDonationRequest, function (req, res) {
    UserNewsService.updateDonationRequest(req.body, (message) => {
        res.json(message)
    });
});



// routes.get(URLs.downloadfile, function (req, res) {
//     const file = `${__dirname}/public/uploads/files/file-1594915137780file-.jpg`;
//     res.download(file); 
// });

routes.get('/api/mailtest', function (req, res) {
    const message = {
        from: 'shashi2puppy@gmail.com', // Sender address
        to: 'shashidhar2katkam@gmail.com',         // List of recipients
        subject: 'Testing', // Subject line
        text: 'hello testing' // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
            //     res.json(info);
        }
    });
    res.json('sss');

});

routes.get('/api/datetest', function (req, res) {
    //const dd = dateTime();

    const dd = moment().valueOf();
    const dd1 = moment().add(5, 'minutes').fromNow();
    const dd12 = moment().add(5, 'minutes').valueOf();
    const e = dd12 < dd;
    res.json({ 'd': dd, "d1": e });

});

//const d = '/api/getallnewsforuser';
// routes.post(URLs.getAllNewsForUser, function (req, res) {
//     var requestObj = req.body;
//    // console.log(requestObj);
//     UserNewsService.getAllNewsForUser(requestObj, (message) => {
//       //  console.log(message);
//         res.json(message);
//     });
// });

// routes.post('/api/savenews', function (req, res) {
//     UserNewsService.createNews(req.body, (message) => {
//         res.json(message);
//     });
// });


// routes.post('/api/getonlynews', function (req, res) {
//     var requestObj = req.body;
//     var filter = {};
//     if (requestObj.category) {
//         filter.Category = requestObj.category;
//     }
//     if (requestObj.skipNewsId) {
//         filter.skipNewsId = requestObj.skipNewsId;
//     }

//     //   console.log(requestObj);
//     UserNewsService.getOnlyNews({ skip: requestObj.skip, filter: filter }, (message) => {
//         //  console.log(message);
//         res.json(message);
//     });
// });


// routes.post('/api/getnews', function (req, res) {
//     var requestObj = req.body;
//     //console.log(requestObj);
//     UserNewsService.getNewsbyFilter(requestObj, (message) => {
//         console.log(message);
//         res.json(message);
//     });
// });

// routes.get('/api/getheadlines', function (req, res) {
//     UserNewsService.getHeadlines({ IsHeadlines: true }, (message) => {
//         res.json(message);
//     });
// });

// routes.get('/api/gettopnews', function (req, res) {
//     UserNewsService.getTopNews({ IsTopTen: true }, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/gettopnews', function (req, res) {
//     var requestObj = req.body;
//     console.log(requestObj.skip);
//     UserNewsService.getTopNews({ skip: requestObj.skip, filter: { IsTopTen: true } }, (message) => {
//         console.log(message);
//         res.json(message);
//     });
// });

// routes.get('/api/getallvideos', function (req, res) {
//     UserNewsService.getAllVideos({}, (message) => {
//         res.json(message);
//     });
// });


// routes.post('/api/getnewsbyid', function (req, res) {
//     var requestObj = req.body;
//     UserNewsService.getNewsById({ filter: { 'User._id': requestObj._id }, skip: requestObj.skip }, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/insertuser', function (req, res) {
//     AuthService.InsertUserDetails(req.body,(message)=>{
//         res.json(message);
//     }); 
// });

// routes.post('/api/updateuser', function (req, res) {
//     AuthService.UpdateUserDetails(req.body,(message)=>{
//         res.json(message);
//     }); 
// });

// routes.post('/api/getusersforgrid', function (req, res) {
//     UserService.getProfiles({},(message)=>{
//         res.json(message);
//     }); 
// });

// routes.post('/api/getuserdetailsbyid', function (req, res) {
//     UserService.getUserDetailsbyID(req.body,(message)=>{
//         res.json(message);
//     }); 
// });


// routes.post('/api/deluploadedfile', (req, res) => {
//     Util.deleteFile(req.body, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/addtohistory', function (req, res) {
//     UserService.addProfileToHistory(req.body, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/gethistoryprofiles', function (req, res) {
//     UserService.getHistoryProfiles({
//         MBID: req.body.Id
//     }, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/getimportantprofiles', function (req, res) {
//     UserService.getImportantProfiles({
//         MBID: req.body.Id
//     }, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/addprofileasimportant', function (req, res) {
//     console.log(12);
//     UserService.addProfileAsImportant(req.body, (message) => {

//         console.log(1);
//         res.json(message);
//     });
// });

// routes.get('/api/tester', function (req, res) {
//     // UserNewsService.getAllFiles({}, (message) => {
//     // console.log(req.connection);
//     res.json(req.connection.socket);
//     //});
// });

// routes.get('/api/test2', function (req, res) {
//     UserService.getAllUsers({}, (message) => {
//         res.json(message);
//     });
// });

// routes.get('/api/test3', function (req, res) {
//     UserNewsService.getNewsById({ 'User._id': '5e69038c73e7df4ec0c71a0f' }, (message) => {
//         res.json(message);
//     });
// });

// routes.post('/api/uploadtest', function (req, res) {

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json(err)
//         } else if (err) {
//             return res.status(500).json(err)
//         }
//         return res.status(200).send(req.file)

//     })

// });

module.exports = routes;