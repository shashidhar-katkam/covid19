const jwt = require('jsonwebtoken');
var User = require('../mongoose/User');
//var Util = require('./util');
var path = require("path");
const routes = require('express').Router();
const dateTime = require('date-time');
const multer = require('multer');
const fs = require('fs');
var compress_images = require('compress-images');
var INPUT_path_to_your_images, OUTPUT_path;

const UserType = {
  Normal: 1,
  SelfAdmin: 2,
  Admin: 3,
  SuperAdmin: 4
}


module.exports.getUserBasicInfo = function (user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    imagePath: user.imagePath
  }
}

module.exports.GenerateUserId = function (callback) {
  User.getUsersCount((err, count) => {
    if (err) {
      console.log(err);
    }
    if (count == 0) {
      return callback(null, 'Q-213131');
    } else if (count > 0) {
      var uid = 213131;
      uid += count;
      var cId = "Q-" + uid.toString();
      return callback(null, cId.toString());
    }
  })
}

module.exports.verifytoken = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const tokenString = authHeader.split(' ');
    const authToken = tokenString[1];
    jwt.verify(authToken, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else if (authData) {
        req.authData = authData
        next();
      }
    })
  } else {
    res.sendStatus(401);
  }
}

module.exports.verifyTokenFormSelfAdmin = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const tokenString = authHeader.split(' ');
    const authToken = tokenString[1];
    jwt.verify(authToken, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else if (authData) {
        req.authData = authData;
        console.log(authData.user.userType);
        if (authData && authData.user && authData.user.userType === UserType.SelfAdmin) {
          req.authData = authData
          next();
        } else {
          res.sendStatus(403);
        }
      }
    })
  } else {
    res.sendStatus(401);
  }
}




module.exports.verifyTokenForAdmin = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const tokenString = authHeader.split(' ');
    const authToken = tokenString[1];
    jwt.verify(authToken, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else if (authData) {
        req.authData = authData
        if (authData && authData.user && authData.user.userType === UserType.Admin || authData.user.userType === UserType.SuperAdmin) {
          req.authData = authData
          next();
        } else {
          res.sendStatus(403);
        }
      }
    })
  } else {
    res.sendStatus(401);
  }
}

module.exports.verifyTokenForSuperAdmin = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const tokenString = authHeader.split(' ');
    const authToken = tokenString[1];
    jwt.verify(authToken, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else if (authData) {
        if (authData && authData.user && (authData.user.userType === UserType.SuperAdmin)) {
          req.authData = authData
          next();
        } else {
          res.sendStatus(403);
        }
      }
    })
  } else {
    res.sendStatus(401);
  }
}

const DIR = './public/uploads/uncompress/profiles/';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '' + path.extname(file.originalname));
  }
});

module.exports.upload = multer({ storage: storage });

const DIRRECTORY = './public/uploads/uncompress/files/';
const UserFolder = './public/uploads/files/';

let storageForFiles = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, UserFolder);
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.substr(0, 5) + path.extname(file.originalname));
  }
});

var storageForFiless = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storage);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.substr(0, 5) + path.extname(file.originalname));
  }
});

module.exports.uploadfile = multer({ storage: storageForFiles });
module.exports.uploadp = multer({ storage: storageForFiless });

function CompressImage(path, callback) {
  console.log(path);
  // compress_images(`public/uploads/uncompress/**/${path}`, 'public/uploads/images/', {compress_force: false, statistic: true, autoupdate: true}, false,
  compress_images(`public/uploads/uncompress/profiles/**/${path}`, 'public/uploads/profiles/', { compress_force: false, statistic: false, autoupdate: true }, false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '40'] } },
    { png: { engine: 'pngquant', command: ['--quality=10-30'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, function (err, completed) {
      if (completed === true) {
        // Doing something.
        callback(null, true);
      }
    });

  // callback(null, true);
}

function CompressImageFiles(path, callback) {
  console.log(path);
  // compress_images(`public/uploads/uncompress/**/${path}`, 'public/uploads/images/', {compress_force: false, statistic: true, autoupdate: true}, false,
  compress_images(`public/uploads/uncompress/files/**/${path}`, 'public/uploads/files/', { compress_force: false, statistic: false, autoupdate: true }, false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '20'] } },
    { png: { engine: 'pngquant', command: ['--quality=20-50'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, function (err, completed) {
      if (completed === true) {
        // Doing something.
        callback(null, true);
      }
    });
  //  callback(null, true);
}

module.exports.CompressImages = function (req, callback) {
  if (!req.file) {
    console.log("No file received");
    callback({
      success: false
    });

  } else {
    // console.log(req.body);
    //   console.log(req.file.path);
    //   console.log(req.file.fileNewName);
    CompressImage(req.file.filename, (err, fie) => {
      if (fie) {
        var filenewname = req.file.path;
        //var n = filenewname.indexOf("images");
        var filen = filenewname.substring(22);
        var d = req.file.path.substring(7);
        var d1 = `${req.file.filename}`;
        return callback({
          //   'success': true, 'fileNewName': req.file.filename, 'originalName':req.file.originalname, 'mimeType': req.file.mimetype
          //'success': true, 'fileNewName': req.file.path.substring(6), 'originalName':req.file.originalname, 'mimeType': req.file.mimetype
          'success': true,
          'fileNewName': d1,
          'originalName': req.file.originalname,
          'mimeType': req.file.mimetype,
          'filePath': '/uploads/profiles/' + req.file.filename,
        })
      }
    });
    //  console.log('file received');

  }
}

module.exports.CompressImageFiless = function (req, callback) {
  if (!req.file) {
    console.log("No file received");
    callback({
      success: false
    });

  } else {
    CompressImageFiles(req.file.filename, (err, fie) => {
      if (fie) {
        var filenewname = req.file.path;
        //var n = filenewname.indexOf("images");
        //     var filen = filenewname.substring(22);
        //   var d =req.file.path.substring(7);
        // console.log(req.body);
        //   console.log(req.file.path);
        //   console.log(req.file);
        //  console.log('file received');
        //var filenewname =req.file.path;
        //var n = filenewname.indexOf("images");
        //var filen = filenewname.substring(22);
        //var d =req.file.path.substring(6);
        // var d1 = `\\uploads\\files\\${req.file.filename}`;
        callback({
          'success': true, 'fileNewName': req.file.filename, 'originalName': req.file.originalname, 'mimeType': req.file.mimetype
        });
      }
    });
  }
}

module.exports.deleteFile = function (file, callback) {
  fs.unlink(`public\\${file['filePath']}`, (err) => {
    if (err) {
      callback({ status: 'unsuccess', statuscode: 0, statusmsg: err });
    } else {
      callback({ status: 'success', statuscode: 1, statusmsg: `deleted file ${file['fileNewName']}` });
    }
  });
}

module.exports.getAllFiles = function (d, callback) {

  const directoryPath = path.join(__dirname, 'public\\uploads\\files');
  //passsing directoryPath and callback function
  fs.readdir('public\\uploads\\files', function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file);
    });
  });
}


module.exports.getFileInfo = function (fileInfo, user) {
  return {
    fileNewName: fileInfo.fileNewName,
    mimeType: fileInfo.mimeType,
    originalName: fileInfo.originalName,
    filePath: fileInfo.filePath,
    fileType: fileInfo.fileType,
    user: user,
    dateTime: dateTime()
  }
}

module.exports.generateSixDigitOtp = function () {
  return Math.floor(100000 + Math.random() * 900000);
}