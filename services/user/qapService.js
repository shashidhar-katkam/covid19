const Persons = require('../../mongoose/Persons');
const QA = require('../../mongoose/QA');
const Polls = require('../../mongoose/Polls');
const App = require('../../app');
const dateTime = require('date-time');

module.exports = {
    SavePost: function (newsInfo, callback) {
        var postInfo = newsInfo.postInfo;
        postInfo['DateTime'] = dateTime();
        postInfo['Show'] = true;
        postInfo['CreatedBy'] = newsInfo.CreatedBy;
        Persons.SaveInfo(newsInfo.postInfo, (err, postCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (postCreated) {
                if (postInfo.Type === 2 && newsInfo.pollOptions) {
                    var pollsInfo = newsInfo.pollOptions;
                    pollsInfo['RefId'] = postCreated._id;

                    Polls.CreatePoll(pollsInfo, (err, objCreated) => {
                        if (err) {
                            callback({
                                status: false,
                                message: `${err.message}`,
                                statuscode: 0
                            });
                        } else if (objCreated) {
                            callback({
                                status: true,
                                message: `Post Polls created Successfully.`,
                                statuscode: 1
                            });
                        }
                    });
                } else {
                    callback({
                        status: true,
                        message: `Post created.`,
                        statuscode: 1
                    });
                }
            }
        });
    },
    updatePost: function (newsInfo, callback) {
        var postInfo = newsInfo.postInfo;
        postInfo['ModifiedOn'] = dateTime();
        postInfo['ModifiedBy'] = newsInfo.CreatedBy;
        Persons.updatePost(postInfo, (err, postCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (postCreated) {
                callback({
                    status: true,
                    message: `Post created.`,
                    statuscode: 1
                });
                App.getSocket().emit(`PostUpdated`, postInfo)

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
                    message: `Question Created.`,
                    statuscode: 1
                });
                App.getSocket().emit(`Questions_${newsInfo.RefId}`, newsInfo)
            }
        });
    },
    getQAsByRefId: function (filter, callback) {
        QA.getQAsByRefId(filter, (err, newsCreated) => {
            if (newsCreated) {
                callback({
                    status: true,
                    message: `Records fetched successfully`,
                    statuscode: 1,
                    data: newsCreated
                });
            }
            else if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
        });
    },
    getPosts: function (requestObj, callback) {
        let filter = { skip: requestObj.skip, filter: { Show: true } }
        Persons.getPosts(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Data fetched Successfully.`,
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
    getPostsCountByStatus: function (filter, callback) {
        console.log(filter);
        Persons.getPostsCountByStatus(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getAllPostsForAdmin: function (requestObj, callback) {
        let filterQuery = {};
        if (requestObj.field) {
            filterQuery.filter = { [requestObj.field]: requestObj.value };
        } else {
            filterQuery.filter = {};
        }
        if (requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }
        Persons.getAllPostsForAdmin(filterQuery, (err, newsCreated) => {
            if (newsCreated) {
                callback({
                    status: true,
                    message: `Records fetched successfully`,
                    statuscode: 1,
                    data: newsCreated
                });
            }
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
        });
    }
}
