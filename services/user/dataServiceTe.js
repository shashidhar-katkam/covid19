const dateTime = require('date-time');
var TeluguNews = require('../../mongoose/NewsTe');

module.exports = {
    getNewsForUserHomePage: function (requestObj, callback) {
        TeluguNews.getNewsForUserHomePage(requestObj, (err, data) => {
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
    getLatestNews: function (requestObj, callback) {

        TeluguNews.getLatestNews(requestObj, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                if (data.length >= 10) {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: data
                    });
                } else {
                    let filter = { skip: requestObj.skip + data.length, limit: 10 - data.length }
                    TeluguNews.getNewsForUserHomePage(filter, (err1, data1) => {
                        if (err1) {
                            callback({
                                status: false,
                                message: `Error occured.`,
                                statuscode: 0
                            });
                        } else if (data1) {
                            if (data1 && data1.length > 0) {
                                for (var i = 0; i < data1.length; i++) {
                                    data.push(data1[i]);
                                }
                            }
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
        });
    },
    getNewsByFilter: function (requestObj, callback) {

        var filter = {};
        if (requestObj && requestObj.skip) {
            filter.skip = requestObj.skip;
        }
        if (requestObj && requestObj.category) {
            filter.Category = requestObj.category;
        }
        if (requestObj && requestObj.skipNewsId) {
            filter.skipNewsId = requestObj.skipNewsId;
        }
        TeluguNews.getNewsByFilter(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Data fetched Successfully.`,
                    statuscode: 0
                });
            } else if (data) {
                // console.log(data);
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getNewsById: function (requestObj, callback) {
        let filter = {};
        if (requestObj && requestObj.id) {
            filter._id = requestObj.id;
        }
        TeluguNews.getNewsById(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Data fetched Successfully.`,
                    statuscode: 0
                });
            } else if (data) {
                //  console.log(data);
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getHeadlines: function (requestObj, callback) {

        TeluguNews.getHeadlines({ Show: true, IsHeadlines: true }, (err, newsCreated) => {
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
    },
    createNews: function (newsInfo, callback) {

        newsInfo['DateTime'] = dateTime();
        newsInfo['Status'] = "Submitted";
        newsInfo['StatusMessage'] = '';

        TeluguNews.CreateNews(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `News Posted.`,
                    statuscode: 1
                });
            }
        });
    },
    raiseHelpRequest: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        newsInfo['Status'] = "Submitted";
        newsInfo['StatusMessage'] = '';
        TeluguNews.raiseHelpRequest(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                console.log(objCreated);
                callback({
                    status: true,
                    message: `help request raised successfully.`,
                    statuscode: 1
                });
            }
        });
    },
    getTopNews: function (requestObj, callback) {
        let filterQuery = { filter: { IsTopTen: true } };
        if (requestObj && requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }
        TeluguNews.getTopNews(filterQuery, (err, newsCreated) => {
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
    },
    getAllVideos: function (fileInfo, callback) {
        TeluguNews.getAllVideos({}, (err, newsCreated) => {
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
    },
    getAllNewsByUserId: function (requestObj, callback) {
        let query = {};
        if (requestObj && requestObj.id) {
            query.filter = { 'User._id': requestObj.id, Show: true };
        }
        if (requestObj && requestObj.skip) {
            query.skip = requestObj.skip;
            query.filter = { Show: true };
        }
        TeluguNews.getAllNewsByUserId(query, (err, data) => {
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

