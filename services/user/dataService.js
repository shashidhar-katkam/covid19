const Stories = require('../../mongoose/Stories');
const HelpCovid = require('../../mongoose/HelpCovid');
const Comments = require('../../mongoose/Comments');
const App = require('../../app');
const dateTime = require('date-time');
module.exports = {
    createStory: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        newsInfo['ReviewerId'] = '';
        Stories.createStory(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Story created.`,
                    statuscode: 1
                });
            }
        });
    },
    getStories: function (requestObj, callback) {
        let filter = { skip: requestObj.skip }
        Stories.getStories(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `stories fetched.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    raiseHelpRequest1: function (newsInfo, callback) {
        newsInfo['dateTime'] = dateTime();
        newsInfo['reviewerId'] = '';
        HelpCovid.raiseHelpRequest1(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `request sumbitted..`,
                    statuscode: 1
                });
            }
        });
    },
    getHelpRequests1: function (requestObj, callback) {
        let filter = { skip: requestObj.skip }
        HelpCovid.getHelpRequests1(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `help request fetched.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    PostComment: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        Comments.PostComment(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Comment Posted.`,
                    statuscode: 1
                });
                App.getSocket().emit(`Comments_${newsInfo.RefId}`, newsInfo);
            }

        });
    },
    getCommentsByRefId: function (filter, callback) {
        Comments.getCommentsByRefId(filter, (err, newsCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (newsCreated) {
                callback({
                    status: true,
                    message: `Records fetched successfully`,
                    statuscode: 1,
                    data: newsCreated
                });
            }
        });

    }
}
