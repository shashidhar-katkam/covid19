var News = require('../../mongoose/News');
var TeluguNews = require('../../mongoose/NewsTe');
var EnglishNews = require('../../mongoose/NewsEn');
var HelpDesk = require('../../mongoose/Help');
var HelpDeskEn = require('../../mongoose/HelpEn');
var HelpDeskTe = require('../../mongoose/HelpTe');
var SelfAdminRequests = require('../../mongoose/SelfAdminRequests');
var Files = require('../../mongoose/Files');
const Polls = require('../../mongoose/Polls');
const Util = require('../../util/util');
const dateTime = require('date-time');
const App = require('../../app');
class NewsInfo {
    constructor(data) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.ReviewerId = data.ReviewerId;
        this.IsHeadlines = data.IsHeadlines;
        this.Category = data.Category;
        this.IsTopTen = data.IsTopTen;
        this.Show = data.Show;
    }
}
module.exports = {
    createMainNews: function (newsInfo, callback) {
        newsInfo.Telugu['DateTime'] = dateTime();
        newsInfo.Telugu['Show'] = true;
        newsInfo.English['DateTime'] = dateTime();
        newsInfo.English['Show'] = true;
        newsInfo.English['IsFromHelpDesk'] = false
        newsInfo.Telugu['IsFromHelpDesk'] = false;
        EnglishNews.CreateMainNews(newsInfo.English, (err, newsCreated) => {
            if (newsCreated) {
                newsInfo.Telugu['ENRefId'] = newsCreated._id;
                TeluguNews.TeluguPostNews(newsInfo.Telugu, (err2, newsCreated2) => {
                    if (newsCreated2) {
                        callback({
                            status: true,
                            message: `News Posted.`,
                            statuscode: 1
                        });

                        var files = newsInfo.English.Files;
                        if (files && files.length > 0) {
                            for (var i = 0; i < files.length; i++) {
                                Files.addFile(Util.getFileInfo(files[i], newsInfo.English.User), (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else if (data) {
                                        console.log(data);
                                    }
                                });
                            }
                        }
                    }
                    else if (err2) {
                        callback({
                            status: false,
                            message: `${err2.message}`,
                            statuscode: 0
                        });
                    }
                });

                if (newsInfo.isPoll && newsInfo.pollOptions) {
                    var pollsInfo = newsInfo.pollOptions;
                    pollsInfo['RefId'] = newsCreated._id;

                    Polls.CreatePoll(pollsInfo, (err, pollCreated) => {
                        if (err) {
                            console.log(err);
                        } else if (pollCreated) {
                            console.log(pollCreated);
                        }
                    });
                }

            } else if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
        }
        );
    },
    getLatestNewsSubmittedByUser: function (filter, callback) {
        News.getUserSubmittedNewsByFilter({ Status: 'Submitted' }, (err, data) => {
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
    getAllNewsSubmittedByUser: function (filter, callback) {
        News.getUserSubmittedNewsByFilter({}, (err, data) => {
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
    getAllNewsByUserId: function (requestObj, callback) {
        News.getUserSubmittedNewsByFilter({ "User._id": requestObj.id }, (err, data) => {
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
    getAllUserPostedNewsByFilter: function (requestObj, callback) {
        let filter = {};
        if (requestObj.UserId !== "") {
            filter["User._id"] = requestObj.UserId;
        }
        filter["SelfAdminPosted"] = requestObj.SelfAdminPosted;
        News.getUserSubmittedNewsByFilter(filter, (err, data) => {
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
    getUserSubmittedNewsByFilter: function (filter, callback) {
        News.getUserSubmittedNewsByFilter(filter, (err, data) => {
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
    getUserSubmittedNewsByStatus: function (requestObj, callback) {
        let filter = { [requestObj.field]: requestObj.value };
        News.getUserSubmittedNewsByFilter(filter, (err, data) => {
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
    getRejectedNews: function (filter, callback) {
        News.getUserSubmittedNewsByFilter({ Status: 'Rejected' }, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                //  console.log(data);
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getNewsByRef: function (requestObj, callback) {
        let filter = {};
        if (requestObj && requestObj.id) {
            filter.ENRefId = requestObj.id;
        }
        TeluguNews.getNewsByRef(filter, (err, data) => {
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
    getAllSelfAdminRequests: function (filter, callback) {
        SelfAdminRequests.getAllSelfAdminRequests(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `all help requestws.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    ApproveAndPost: function (data, callback) {
        News.ApproveNews(data, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
            if (objCreated) {
                if (data.status.status === "Approved") {
                    data.newsInfo.English['DateTime'] = dateTime();
                    data.newsInfo.English['Show'] = true;
                    data.newsInfo.Telugu['ReviewerId'] = data.newsInfo.English['ReviewerId'];
                    data.newsInfo.Telugu['DateTime'] = dateTime();
                    data.newsInfo.Telugu['Show'] = true;
                    data.newsInfo.Telugu['IsFromHelpDesk'] = false;
                    data.newsInfo.English['IsFromHelpDesk'] = false;
                    EnglishNews.CreateMainNews(data.newsInfo.English, (err, newsCreateda) => {
                        if (newsCreateda) {
                            data.newsInfo.Telugu['ENRefId'] = newsCreateda._id
                            TeluguNews.TeluguPostNews(data.newsInfo.Telugu, (err, newsCreatedb) => {
                                if (newsCreatedb) {
                                    callback({
                                        status: true,
                                        message: `News posted in both languages.`,
                                        statuscode: 1
                                    });

                                    var files = data.newsInfo.English.Files;
                                    if (files && files.length > 0) {
                                        for (var i = 0; i < files.length; i++) {
                                            Files.addFile(Util.getFileInfo(files[i], data.newsInfo.English.User), (err, data) => {
                                                if (err) {
                                                    console.log(err);
                                                } else if (data) {
                                                    console.log(data);
                                                }
                                            });
                                        }
                                    }
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
                        if (err) {
                            callback({
                                status: false,
                                message: `${err.message}`,
                                statuscode: 0
                            });
                        }
                    });
                }
                else {
                    callback({
                        status: true,
                        message: `News Rejected.`,
                        statuscode: 1
                    });
                }
            }
        });
    },
    updateETNews: function (data, callback) {
        EnglishNews.updateNews(data.newsInfo.English, (err, newsCreateda) => {
            if (newsCreateda) {
                TeluguNews.updateNews(data.newsInfo.Telugu, (err, newsCreatedb) => {
                    if (newsCreatedb) {
                        callback({
                            status: true,
                            message: 'News Updated.',
                            statuscode: 1
                        });
                        App.getSocket().emit("NewsUpdated", data.newsInfo);
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
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
        });
    },
    getFilesByQuery: function (filter, callback) {
        Files.getFilesByQuery(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Data fetched Successfully.`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getallNewsForAdmin: function (requestObj, callback) {
        let filterQuery = {};
        if (requestObj.field) {
            filterQuery.filter = { [requestObj.field]: requestObj.value };
        } else {
            filterQuery.filter = {};
        }
        if (requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }
        EnglishNews.getallNewsForAdmin(filterQuery, (err, newsCreated) => {
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
    },
    getallNewsForAdminFilter: function (requestObj, callback) {
        let filterQuery = {};
        filterQuery.filter = requestObj;

        EnglishNews.getallNewsForAdmin(filterQuery, (err, newsCreated) => {
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

    },
    getAllEnglishNews: function (requestObj, callback) {
        EnglishNews.getAllEnglishNews({}, (err, newsCreated) => {
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

    },
    getNewsByFilterAll: function (requestObj, callback) {
        EnglishNews.getNewsByFilterAll({ filter: requestObj.filter }, (err, newsCreated) => {
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

    },
    getNewsCountByCategory: function (requestObj, callback) {
        EnglishNews.getNewsCountByCategory({}, (err, newsCreated) => {
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
    },
    getHelpRequestsCountByStatus: function (requestObj, callback) {
        HelpDesk.getHelpRequestsCountByStatus({}, (err, newsCreated) => {
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

    },
    getAllHelpReqestsForAdmin: function (requestObj, callback) {
        let filterQuery = {};
        if (requestObj.field) {
            filterQuery.filter = { [requestObj.field]: requestObj.value };
        } else {
            filterQuery.filter = {};
        }
        if (requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }

        HelpDesk.getAllHelpReqestsForAdmin(filterQuery, (err, newsCreated) => {
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

    },
    getAllUserNewsForAdmin: function (requestObj, callback) {
        let filterQuery = {};
        if (requestObj.field) {
            filterQuery.filter = { [requestObj.field]: requestObj.value };
        } else {
            filterQuery.filter = {};
        }
        if (requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }

        News.getAllUserNewsForAdmin(filterQuery, (err, newsCreated) => {
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

    },
    acceptHelpRequestAndCreate: function (data, callback) {
        console.log(data);
        HelpDesk.acceptHelpRequest(data, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            }
            else if (objCreated) {
                if (data.status.status === "Approved") {
                    data.newsInfo.English['DateTime'] = dateTime();
                    data.newsInfo.English['Show'] = true;
                    data.newsInfo.Telugu['ReviewerId'] = data.newsInfo.English['ReviewerId'];
                    data.newsInfo.Telugu['DateTime'] = dateTime();
                    data.newsInfo.Telugu['Show'] = true;
                    HelpDeskEn.createHelpRequest(data.newsInfo.English, (err, newsCreateda) => {
                        if (newsCreateda) {
                            data.newsInfo.Telugu['ENRefId'] = newsCreateda._id
                            HelpDeskTe.createHelpRequest(data.newsInfo.Telugu, (err, newsCreatedb) => {
                                if (newsCreatedb) {
                                    callback({
                                        status: true,
                                        message: `News posted in both languages.`,
                                        statuscode: 1
                                    });

                                    var files = data.newsInfo.English.Files;
                                    if (files && files.length > 0) {
                                        for (var i = 0; i < files.length; i++) {
                                            Files.addFile(Util.getFileInfo(files[i], data.newsInfo.English.User), (err, data) => {
                                                if (err) {
                                                    console.log(err);
                                                } else if (data) {
                                                    console.log(data);
                                                }
                                            });
                                        }
                                    }


                                }
                                else if (err) {
                                    callback({
                                        status: false,
                                        message: `${err.message}`,
                                        statuscode: 0
                                    });
                                }
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
                }
                else {
                    callback({
                        status: true,
                        message: `News Rejected.`,
                        statuscode: 1
                    });
                }

            }
        });
    },
    getHelpRequestsCountByCategory: function (requestObj, callback) {
        HelpDeskEn.getHelpRequestsCountByCategory({}, (err, newsCreated) => {
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
    getAllEnHelpReqestsForAdmin: function (requestObj, callback) {
        let filterQuery = {};
        if (requestObj.field) {
            filterQuery.filter = { [requestObj.field]: requestObj.value };
        } else {
            filterQuery.filter = {};
        }
        if (requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }
        HelpDeskEn.getAllEnHelpReqestsForAdmin(filterQuery, (err, newsCreated) => {
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
    getHelpRequestInTeByERefId: function (requestObj, callback) {
        let filter = {};
        if (requestObj && requestObj.id) {
            filter.ENRefId = requestObj.id;
        }
        HelpDeskTe.getHelpRequestInTeByERefId(filter, (err, data) => {
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
    updateHelpRequestInET: function (data, callback) {
        HelpDeskEn.updateNews(data.newsInfo.English, (err, newsCreateda) => {
            if (newsCreateda) {
                HelpDeskTe.updateNews(data.newsInfo.Telugu, (err, newsCreatedb) => {
                    if (newsCreatedb) {
                        callback({
                            status: true,
                            message: `News posted in both languages.`,
                            statuscode: 1
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
    getNewsCountByStatus: function (filter, callback) {
        News.getNewsCountByStatus(filter, (err, data) => {
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

}