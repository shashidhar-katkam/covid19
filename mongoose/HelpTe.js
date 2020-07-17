const HelpDeskTe = require('./schema/helpTe');

module.exports = {
    createHelpRequest: function (helpInfo, callback) {
        try {
            HelpDeskTe.create(helpInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getHelpRequestInTeByERefId: function (query, callback) {
        try {
            HelpDeskTe.find(query, callback).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateNews: function (helpInfo, callback) {
        try {
            HelpDeskTe.updateOne({
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