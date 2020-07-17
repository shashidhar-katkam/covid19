const TeluguMainNews = require('./schema/newsTe');

module.exports = {
    getNewsForUserHomePage: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        let limit = (query && query.limit ? query.limit : 10);
        console.log(query.filter);
        try {
            TeluguMainNews.find({ Show: true }, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Type: 1,
                ENRefId: 1,
                Source: 1,
                Analysis1: 1,
                Analysis2: 1,
                Analysis3: 1
            }, callback).sort({ DateTime: -1 }).skip(skipno).limit(limit);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getLatestNews: function (query, callback) {
        //  let skipno = (query ? query.skip : 0);
        console.log(query.filter);
        var filter = { Show: true };
        if (query.filter && query.filter.DateTime) {
            filter.DateTime = { $gt: query.filter.DateTime };
        }
        try {
            TeluguMainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Type: 1,

            }, callback).sort({ DateTime: -1 }).skip(0).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsByFilter: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        var filter = { Show: true };
        if (query && query.Category) {
            filter.Category = query.Category;
        }
        if (query && query.skipNewsId) {
            filter._id = { $ne: query.skipNewsId }
        }
        try {
            TeluguMainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Category: 1,
                Source: 1,
                Type: 1,
                ENRefId: 1,
                Analysis1: 1,
                Analysis2: 1,
                Analysis3: 1
            }, callback).sort({ DateTime: -1 }).skip(skipno).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsById: function (query, callback) {
        try {
            TeluguMainNews.find(query, callback).limit(1);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getHeadlines: function (query, callback) {
        try {
            TeluguMainNews.find(query, {
                Title: 1,
                //  Description: 1
            }, callback).sort({ DateTime: -1 }).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    CreateNews: function (newsInfo, callback) {

        try {
            TeluguMainNews.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    raiseHelpRequest: function (newsInfo, callback) {

        try {
            HelpDesk.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsByRef: function (query, callback) {
        //    let skipno = 0;
        try {
            TeluguMainNews.find(query, callback).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsforApprove: function (query, callback) {
        let skipno = 0;
        try {
            TeluguMainNews.find(query, callback).skip(skipno).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllHelpRequests: function (query, callback) {
        let skipno = 0;
        try {
            HelpDesk.find({}, callback).skip(skipno).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getTotalCountNewsPostedByUser: function (query, callback) {

        try {
            TeluguMainNews.find(query).countDocuments(callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    addFile: function (file, callback) {

        try {
            Files.create(file, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllFiles: function (query, callback) {
        let skipno = 0;
        try {
            Files.find({}, callback).skip(skipno).limit(1000);
        } catch (e) {
            console.log(e);
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
    getTopNews: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        var filter = query.filter;
        filter.Show = true;
        try {
            TeluguMainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
            }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    PostNews: function (newsInfo, callback) {

        try {
            TeluguMainNews.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    TeluguPostNews: function (newsInfo, callback) {

        try {
            TeluguMainNews.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateNews: function (newsInfo, callback) {
        //  console.log(newsInfo);
        try {
            TeluguMainNews.updateOne({
                _id: newsInfo._id
            }, {
                $set: {
                    Title: newsInfo.Title,
                    Description: newsInfo.Description,
                    Files: newsInfo.Files,
                    DateTime: newsInfo.DateTime,
                    IsTopTen: newsInfo.IsTopTen,
                    IsHeadlines: newsInfo.IsHeadlines,
                    Category: newsInfo.Category,
                    Show: newsInfo.Show,
                    Type: newsInfo.Type,
                    Analysis1: newsInfo.Analysis1,
                    Analysis2: newsInfo.Analysis2,
                    Analysis3: newsInfo.Analysis3
                }
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    ApproveNews: function (newsInfo, callback) {
        console.log(newsInfo.newsInfo._id);
        try {
            TeluguMainNews.updateOne({
                _id: newsInfo.newsInfo._id
            }, {
                $set: {
                    Status: newsInfo.status.status,
                    StatusMessage: newsInfo.status.statusMessage,
                    ReviewerId: newsInfo.ReviewerId
                }
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllNewsByUserId: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        console.log(query);
        try {
            TeluguMainNews.find(query.filter, {
                Title: 1,
                Description: 1,
                DateTime: 1,
                Files: 1,
                Category: 1,
                Type: 1,
                Source: 1,
                Analysis1: 1,
                Analysis2: 1,
                Analysis3: 1
            }, callback).sort({ DateTime: -1 }).skip(skip).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}

////Videos 

// module.exports.addVideo : function (videoInfo, callback) {

//     try {
//         Videos.create(videoInfo, callback);
//     } catch (e) {
//         console.log(e);
        //    callback(e, null);
//     }
// }


// module.exports.getAllVideos : function (query, callback) {
//     let skipno = 0;
//     try {
//         Videos.find(query, {
//             Title: 1,
//             Description: 1,
//             File: 1,
//             User: 1,
//             DateTime: 1

//         }, callback).skip(skipno).limit(1000);
//     } catch (e) {
//         console.log(e);
          //  callback(e, null);
//     }
// }