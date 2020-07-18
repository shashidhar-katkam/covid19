const jwt = require('jsonwebtoken');
var User = require('../mongoose/User');
var path = require("path");
const multer = require('multer');
var compress_images = require('compress-images');

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
      return callback(null, 'A213131');
    } else if (count > 0) {
      var uid = 213131;
      uid += count;
      var cId = "A" + uid.toString();
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
  compress_images(`public/uploads/uncompress/profiles/**/${path}`, 'public/uploads/profiles/', { compress_force: false, statistic: false, autoupdate: true }, false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '40'] } },
    { png: { engine: 'pngquant', command: ['--quality=10-30'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, function (err, completed) {
      if (completed === true) {
        callback(null, true);
      }
    });
}

module.exports.CompressImages = function (req, callback) {
  if (!req.file) {
    console.log("No file received");
    callback({
      success: false
    });
  } else {
    CompressImage(req.file.filename, (err, fie) => {
      if (fie) {
        return callback({
          'success': true,
          'fileNewName': req.file.filename,
          'originalName': req.file.originalname,
          'mimeType': req.file.mimetype,
          'filePath': '/uploads/profiles/' + req.file.filename,
        })
      }
    });
  }
}

module.exports.generateSixDigitOtp = function () {
  return Math.floor(100000 + Math.random() * 900000);
}