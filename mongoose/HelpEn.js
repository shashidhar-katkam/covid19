const HelpDeskEn = require('./schema/helpEn');

module.exports = {
    createHelpRequest: function (helpInfo, callback) {
        try {
            HelpDeskEn.create(helpInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getHelpRequestsCountByCategory: function (query, callback) {
        try {
            HelpDeskEn.aggregate([
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
    },
    getAllEnHelpReqestsForAdmin: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        try {
            HelpDeskEn.find(query.filter, callback)
            .sort({ DateTime: -1 }).skip(skipno).limit(500);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateNews: function (helpInfo, callback) {
        try {
            HelpDeskEn.updateOne({
                _id: helpInfo._id
            }, {
                $set: {
                    Title: helpInfo.Title,
                    Description: helpInfo.Description,
                    WhatToDo: helpInfo.WhatToDo,
                    Files: helpInfo.Files,
                    DateTime: helpInfo.DateTime,
                    Category: helpInfo.Category,
                    Show: helpInfo.Show
                }
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}