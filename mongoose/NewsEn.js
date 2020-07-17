const MainNews = require('./schema/newsEn');

module.exports = {
    getNewsForUserHomePage: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        let limit = (query && query.limit ? query.limit : 10);
        console.log(query.filter);
        try {
            MainNews.find({ Show: true }, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Type: 1,
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
            MainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Type: 1,
                Source: 1,
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
            MainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Source: 1,
                Type: 1,
                Category: 1,
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
            MainNews.find(query, callback).limit(1);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getHeadlines: function (query, callback) {
        try {
            MainNews.find(query, {
                Title: 1,
                // Description: 1
            }, callback).sort({ DateTime: -1 }).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateNews: function (newsInfo, callback) {
        console.log('-----');
        console.log(newsInfo);
        try {
            MainNews.updateOne({
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
    getTotalCountNewsPostedByUser: function (query, callback) {

        try {
            MainNews.find(query).countDocuments(callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getTopNews: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        var filter = query.filter;
        filter.Show = true;
        console.log(skipno);
        try {
            MainNews.find(filter, {
                Title: 1,
                Description: 1,
                Files: 1,
                User: 1,
                DateTime: 1,
                Type: 1,
                Source: 1
            }, callback).sort({ DateTime: -1 }).skip(skipno).limit(20);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getallNewsForAdmin: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        console.log(skipno);


        try {
            MainNews.find(query.filter, callback).sort({ DateTime: -1 }).skip(skipno).limit(500);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    CreateMainNews: function (newsInfo, callback) {
        try {
            MainNews.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllNewsByUserId: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        console.log(query);
        try {
            MainNews.find(query.filter, {
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
    },
    getAllEnglishNews: function (query, callback) {
        try {
            MainNews.find({}, callback).sort({ DateTime: -1 }).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getNewsCountByCategory: function (query, callback) {
        try {
            MainNews.aggregate([
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
    getNewsByFilterAll: function (query, callback) {
        try {
            MainNews.find({
                $or: [{ Title: new RegExp('.*' + query.filter + '.*', "i") },
                { Description: new RegExp('.*' + query.filter + '.*', "i") },
                { "User.firstName": new RegExp('.*' + query.filter + '.*', "i") },
                { "User.lastName": new RegExp('.*' + query.filter + '.*', "i") },
                { Category: new RegExp('.*' + query.filter + '.*', "i") }
                ]
            }, callback).limit(500);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}

// module.exports.test : function (query, callback) {
//     console.log('1234567');
//     try {
//         MainNews.aggregate([
//             //  { "$sort": { "DateTime": 1 } },
//             {
//                 "$group": {
//                     "_id": "$Category",
//                     //        "Title": { "$first": "$Title" }   ,
//                     //      "Description": { "$first": "$Description" },
//                     "count": { $sum: 1 }
//                 }
//             },
//             //   { "$unwind": { "path" : "$Title" } },
//         ], callback);




//         //.find({}, callback).sort({ DateTime: -1 }).group('Category').limit(100);
//     } catch (e) {
//         console.log(e);
//     }
// }

