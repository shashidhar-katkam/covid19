const Files = require('./schema/mainCard');

module.exports = {
    addFile: function (file, callback) {
        try {
            Files.create(file, callback);
        } catch (e) {
            callback(e, null);
        }
    },
    getAllFiles: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        console.log(skipno);
        try {
            Files.find({ show: true }, { title: 1, files: 1, titleTe: 1 }, callback).sort({ dateTime: -1 }).skip(skipno).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllFilesForAdmin: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        console.log(skipno);
        try {
            Files.find({}, { title: 1, files: 1, show: 1 }, callback).sort({ dateTime: -1 }).skip(skipno).limit(40);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateImage: function (newsInfo, callback) {
        try {
            Files.updateOne({
                _id: newsInfo._id
            }, {
                $set: newsInfo.updateObj
            }, callback);
        } catch (e) {
            callback(e, null);
        }
    },






    getFilesByQuery: function (query, callback) {
        let skipno = 0;
        try {
            Files.find(query, callback).skip(skipno).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getFilesByFilterAll: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        try {
            Files.find({
                $or: [{ fileNewName: new RegExp('.*' + query.filter + '.*', "i") },
                { originalName: new RegExp('.*' + query.filter + '.*', "i") },
                { "user.firstName": new RegExp('.*' + query.filter + '.*', "i") },
                { "user.lastName": new RegExp('.*' + query.filter + '.*', "i") },
                    //  { Category: new RegExp('.*' + query.filter + '.*', "i") }
                ]
            }, callback).skip(skipno).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}