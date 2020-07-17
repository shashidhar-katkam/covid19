const PollsResults = require('../../mongoose/PollResults');
const Polls = require('../../mongoose/Polls');
const App = require('../../app');
const dateTime = require('date-time');


module.exports = {
    CreatePoll: function (newsInfo, callback) {
        Polls.CreatePoll(newsInfo, (err, objCreated) => {
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
            }
        });
    },
    checkIsUserIsPolled: function (requestObj, callback) {
        PollsResults.checkIsUserIsPolled(requestObj, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error Occured.`,
                    statuscode: 0
                });
            } else if (data) {
                if (data.length > 0) {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: { answeredPoll: true, Poll: data[0].Poll }
                    });
                } else {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: { answeredPoll: false }
                    });
                }
            }
        });
    },
    getPollOptionsByRefId: function (requestObj, callback) {
        let filter = { RefId: requestObj.id }
        Polls.getPollOptionsByRefId(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error Occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    SavePollResults: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        var pollObj = { RefId: newsInfo['RefId'] };
        var field = '';
        if (newsInfo['Poll'] === 1) {
            pollObj.updateObj = { Option1Poll: 1 };
            field = 'Option1Poll';
        } else if (newsInfo['Poll'] === 2) {
            pollObj.updateObj = { Option2Poll: 1 };
            field = 'Option2Poll';
        } else if (newsInfo['Poll'] === 3) {
            pollObj.updateObj = { Option3Poll: 1 };
            field = 'Option3Poll';
        } else if (newsInfo['Poll'] === 4) {
            pollObj.updateObj = { Option4Poll: 1 };
            field = 'Option4Poll';
        }
        Polls.answerPoll(pollObj, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                App.getSocket().emit(`Polls_${newsInfo['RefId']}`, { RefId: newsInfo['RefId'], option: field });
                PollsResults.SavePollResults(newsInfo, (err, pobjCreated) => {
                    if (err) {
                        callback({
                            status: false,
                            message: `${err.message}`,
                            statuscode: 0
                        });
                    } else if (pobjCreated) {
                        callback({
                            status: true,
                            message: `Comment Posted.`,
                            statuscode: 1
                        });
                    }
                });
            }
        });
    },
    getPollResultsByRefId: function (requestObj, callback) {
        let filter = { RefId: requestObj.id }
        PollsResults.getPollResultsByRefId(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error Occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    SaveQuestion: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        QA.SaveQuestion(newsInfo, (err, objCreated) => {
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
            }
        });
    },
    getPosts: function (requestObj, callback) {
        let filter = { skip: requestObj.skip, filter: {} }
        Persons.getPosts(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error Occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    }
}