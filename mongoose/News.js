var News = require('./schema/news');

module.exports = {
    CreateNews: function (newsInfo, callback) {
        try {
            News.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getUserSubmittedNewsByFilter: function (query, callback) {
        let skipno = 0;
        try {
            News.find(query, callback).sort({ DateTime: -1 }).skip(skipno).limit(10000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getUserSubmittedNewsByFilterForUser: function (query, callback) {
        let skipno = 0;
        try {
            News.find(query,
                {
                    User: 0,
                    ReviewerId: 0,
                }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsCountByFilter: function (query, callback) {
        try {
            News.find(query,
                {
                    User: 0,
                    ReviewerId: 0,
                }, callback); //.countDocuments(callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    ApproveNews: function (newsInfo, callback) {
        try {
            News.updateOne({
                _id: newsInfo.newsInfo.English._id
            }, {
                $set: {
                    Status: newsInfo.status.status,
                    StatusMessage: newsInfo.status.statusMessage,
                    ReviewerId: newsInfo.newsInfo.English.ReviewerId
                }
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
                        "_id": "$Status",
                        "count": { $sum: 1 }
                    }
                },
            ], callback)
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllUserNewsForAdmin: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        try {
            News.find(query.filter, callback).sort({ DateTime: -1 }).skip(skipno).limit(500);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}

// module.exports.getNewsForUserHomePage = function (query, callback) {
//     let skipno = (query ? query.skip : 0);
//     console.log(query.filter);
//     try {
//         MainNews.find({ Show: true }, {
//             Title: 1,
//             Description: 1,
//             Files: 1,
//             User: 1,
//             DateTime: 1,
//             // IsTopTen: 1,
//             // IsHeadlines: 1

//         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.getNewsByFilter = function (query, callback) {
//     let skipno = (query ? query.skip : 0);
//     var filter = {};
//     if (query && query.Category) {
//         filter.Category = query.Category;
//     }
//     if (query && query.skipNewsId) {
//         filter._id = { $ne: query.skipNewsId }
//     }
//     try {
//         MainNews.find(filter, {
//             Title: 1,
//             Description: 1,
//             Files: 1,
//             User: 1,
//             DateTime: 1,
//         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(20);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.getNewsById = function (query, callback) {
//     try {
//         MainNews.find(query, callback).limit(1);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.getHeadlines = function (query, callback) {
//     try {
//         MainNews.find(query, {
//             Title: 1,
//             // Description: 1
//         }, callback).sort({ DateTime: -1 }).limit(20);
//     } catch (e) {
//         console.log(e);
//     }
// }





// module.exports.raiseHelpRequest = function (newsInfo, callback) {

//     try {
//         HelpDesk.create(newsInfo, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }



// module.exports.getAllHelpRequests = function (query, callback) {
//     let skipno = 0;
//     try {
//         HelpDesk.find({}, callback).skip(skipno).limit(1000);
//     } catch (e) {
//         console.log(e);
//     }
// }




// module.exports.updateNews = function (newsInfo, callback) {
//     console.log('-----');
//     console.log(newsInfo);
//     try {
//         MainNews.updateOne({
//             _id: newsInfo._id
//         }, {
//             $set: {
//                 Title: newsInfo.Title,
//                 Description: newsInfo.Description,
//                 Files: newsInfo.Files,
//                 DateTime: newsInfo.DateTime,
//                 IsTopTen: newsInfo.IsTopTen,
//                 IsHeadlines: newsInfo.IsHeadlines,
//                 Category: newsInfo.Category,
//                 Show: newsInfo.Show
//                 //ReviewerId: newsInfo.ReviewerId
//             }
//         }, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }


// module.exports.getTotalCountNewsPostedByUser = function (query, callback) {

//     try {
//         MainNews.find(query).countDocuments(callback);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.addFile = function (file, callback) {

//     try {
//         Files.create(file, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.getAllFiles = function (query, callback) {
//     let skipno = 0;
//     try {
//         Files.find({}, callback).skip(skipno).limit(1000);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.getFilesByQuery = function (query, callback) {
//     let skipno = 0;
//     try {
//         Files.find(query, callback).skip(skipno).limit(1000);
//     } catch (e) {
//         console.log(e);
//     }
// }




// ///admin 


// module.exports.TgetAllNewsForUser = function (query, callback) {
//     let skipno = (query ? query.skip : 0);
//     console.log(query.filter);
//     try {
//         TeluguMainNews.find(query.filter, {
//             Title: 1,
//             Description: 1,
//             Files: 1,
//             User: 1,
//             DateTime: 1,
//             IsTopTen: 1,
//             IsHeadlines: 1

//         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
//     } catch (e) {
//         console.log(e);
//     }
// }




// module.exports.getTopNews = function (query, callback) {
//     let skipno = (query && query.skip ? query.skip : 0);
//     console.log(skipno);
//     try {
//         MainNews.find(query.filter, {
//             Title: 1,
//             Description: 1,
//             Files: 1,
//             User: 1,
//             DateTime: 1,
//         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
//     } catch (e) {
//         console.log(e);
//     }
// }


// module.exports.getallNewsForAdmin = function (query, callback) {
//     // let skipno = (query ? query.skip : 0);
//     //let skipno =0;
//     //   console.log(skipno);
//     try {
//         MainNews.find(query, callback).sort({ DateTime: -1 }).limit(10000);
//     } catch (e) {
//         console.log(e);
//     }
// }



// module.exports.CreateMainNews = function (newsInfo, callback) {

//     try {
//         MainNews.create(newsInfo, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }

// module.exports.TeluguPostNews = function (newsInfo, callback) {

//     try {
//         TeluguMainNews.create(newsInfo, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }




// module.exports.getAllNewsByUserId = function (query, callback) {
//     let skip = query.skip ? query.skip : 0;
//     console.log(query);
//     try {
//         MainNews.find(query.filter, {
//             Title: 1,
//             Description: 1,
//             DateTime: 1,
//             Files: 1,
//             Category: 1
//         }, callback).sort({ DateTime: -1 }).skip(skip).limit(20);
//     } catch (e) {
//         console.log(e);
//     }
// }




// ////Videos 

// module.exports.addVideo = function (videoInfo, callback) {

//     try {
//         Videos.create(videoInfo, callback);
//     } catch (e) {
//         console.log(e);
//     }
// }


// module.exports.getAllVideos = function (query, callback) {
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
//     }
// }