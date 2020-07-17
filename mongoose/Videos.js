var Videos = require('./schema/videos');

module.exports = {
    addVideo: function (videoInfo, callback) {
        try {
            Videos.create(videoInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllVideos: function (query, callback) {
        let skipno = 0;
        try {
            Videos.find(query, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllVideosForUser: function (query, callback) {
        let skipno = 0;
        try {
            Videos.find(query,
                {
                    User: 0,
                }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
        } catch (e) {
            callback(e, null);
        }
    },

    updateVideo: function (videoInfo, callback) {
        try {
            Videos.updateOne({
                _id: videoInfo._id
            }, {
                $set: videoInfo.updateObj
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsCountByStatus: function (query, callback) {
        try {
            News.aggregate([
                {
                    "$group": {
                        "_id": "$Category",
                        "count": { $sum: 1 }
                    }
                },
            ], callback)
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}
