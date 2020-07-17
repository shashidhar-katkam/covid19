var Files = require('../../mongoose/Files');
var ImageCard = require('../../mongoose/ImageCard');
var MainCard = require('../../mongoose/MainCard');
const Util = require('../../util/util');
const dateTime = require('date-time');
const App = require('../../app');
module.exports = {
    getAllFiles: function (filter, callback) {
        Files.getAllFiles({}, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getFilesByFilterAll: function (filter, callback) {
        Files.getFilesByFilterAll(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },

    addImages: function (requestObj, callback) {
        let filesInfo = requestObj.files;
        if (filesInfo && filesInfo.length > 0) {
            for (var i = 0; i < filesInfo.length; i++) {
                let saveFileInfo = Util.getFileInfo(filesInfo[i], requestObj.user);
                ImageCard.addFile(saveFileInfo, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else if (data) {
                        console.log(data);
                    }
                });
            }
        }
        callback({
            status: true,
            message: `added`,
            statuscode: 1,
        });

    },
    getImages: function (filter, callback) {
        ImageCard.getAllFiles(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `ImagecardPics.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },

    getAllImagesForAdmin: function (filter, callback) {
        ImageCard.getAllFilesForAdmin(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `ImagecardPics.`,
                    statuscode: 1,
                    data: data
                });

            }
        });
    },
    updateImage: function (filter, callback) {
        ImageCard.updateImage(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `Updated.`,
                    statuscode: 1,
                });
            }
        });
        if (!filter.updateObj.show) {
            App.getSocket().emit("ImageCard", filter);
        }

    },



    addImagesM: function (requestObj, callback) {
        requestObj.dateTime = dateTime();
        console.log(requestObj);
        MainCard.addFile(requestObj, (err, data) => {
            if (err) {
                console.log(err);
                callback({
                    status: false,
                    message: `error`,
                    statuscode: 0,
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `added`,
                    statuscode: 1,
                });
                console.log(data);
            }
        });
    },
    getImagesM: function (filter, callback) {
        MainCard.getAllFiles(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `ImagecardPics.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },

    getAllImagesForAdminM: function (filter, callback) {
        MainCard.getAllFilesForAdmin(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `ImagecardPics.`,
                    statuscode: 1,
                    data: data
                });

            }
        });
    },
    updateImageM: function (filter, callback) {
        MainCard.updateImage(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `Updated.`,
                    statuscode: 1,
                });
                if (!filter.updateObj.show) {
                    App.getSocket().emit("MainCard", filter);
                }
            }
        });
    },
}