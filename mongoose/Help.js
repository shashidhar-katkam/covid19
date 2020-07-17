const HelpDesk = require('./schema/help');

module.exports = {
    raiseHelpRequest: function (helpInfo, callback) {
        try {
            HelpDesk.create(helpInfo, callback);
        } catch (e) {
            callback(e, null);
        }
    },
    getAllHelpRequests: function (query, callback) {
        let skipno = 0;
        try {
            HelpDesk.find({}, callback).skip(skipno).limit(1000);
        } catch (e) {
            callback(e, null);
        }
    },
    getHelpRequestsCountByStatus: function (query, callback) {
        try {
            HelpDesk.aggregate([
                {
                    "$group": {
                        "_id": "$Status",
                        "count": { $sum: 1 }
                    }
                },
            ], callback)
        } catch (e) {
            callback(e, null);
        }
    },
    acceptHelpRequest: function (helpInfo, callback) {
        try {
            HelpDesk.updateOne({
                _id: helpInfo.newsInfo.English._id
            }, {
                $set: {
                    Status: helpInfo.status.status,
                    StatusMessage: helpInfo.status.statusMessage,
                    ReviewerId: helpInfo.newsInfo.English.ReviewerId
                }
            }, callback);
        } catch (e) {
            callback(e, null);
        }
    },
    getAllHelpReqestsForAdmin: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        try {
            HelpDesk.find(query.filter, callback)
                .sort({ DateTime: -1 }).skip(skipno).limit(500);
        } catch (e) {
            callback(e, null);
        }
    },
    getMyHelpRequests: function (query, callback) {
        let skipno = 0;
        try {
            HelpDesk.find(query,
                {
                    User: 0,
                    ReviewerId: 0,
                }, callback).skip(skipno).limit(1000);
        } catch (e) {
            callback(e, null);
        }
    }
}
