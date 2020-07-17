const Queries = require('./schema/queries');

module.exports = {
    saveQuery: function (orderInfo, callback) {
        try {
            Queries.create(orderInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },

    updateOrder: function (requestObj, callback) {
        try {
            Queries.updateOne({
                _id: requestObj._id
            }, {
                $set:
                    requestObj.updateObj

            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getTotalProductsCount: function (callback) {
        try {
            Queries.find({}).countDocuments(callback);
        }
        catch (e) {
            callback(e, null);
            console.log(e);
        }
    },
    getAllOrders: function (filter, callback) {
        try {
            Queries.find(filter, callback);
        }
        catch (e) {
            console.log(e);
        }
    },
    getOrderById: function (filter, callback) {
        let query = { _id: filter._id };

        try {
            Queries.find(query, {
                AddedBy: 0,
                Show: 0,
            }, callback);
        }
        catch (e) {
            console.log(e);
        }
    },
    getOrderByOrderId: function (filter, callback) {
        let query = { _id: filter._id };

        try {
            Queries.find(query, {
                OrderedBy: 0,
                PaymentStatus:0,
                PaymentInit:0,
                PaymentSuccess:0,
                Show: 0,
            }, callback);
        }
        catch (e) {
            console.log(e);
        }
    },
    getMyOrders: function (filter, callback) {
        let query = { 'OrderedBy._id': filter._id };
        console.log(query);
        try {
            Queries.find(query, {
                OrderedBy: 0,
            }, callback).sort({ DateTime: -1 });
        }
        catch (e) {
            console.log(e);
        }
    },
    cancelOrder: function (requestObj, callback) {
        try {
            Queries.updateOne({
                _id: requestObj._id
            }, {
                $set:
                    requestObj.updateObj

            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },

    // getNewsForUserHomePage: function (query, callback) {
    //     let skipno = (query ? query.skip : 0);
    //     let limit = (query && query.limit ? query.limit : 10);
    //     console.log(query.filter);
    //     try {
    //         Products.find({ Show: true }, {
    //             Title: 1,
    //             Description: 1,
    //             Files: 1,
    //             User: 1,
    //             DateTime: 1,
    //             IsCommentsOn: 1
    //         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(limit);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getLatestNews: function (query, callback) {
    //     //  let skipno = (query ? query.skip : 0);
    //     console.log(query.filter);
    //     var filter = { Show: true };
    //     if (query.filter && query.filter.DateTime) {
    //         filter.DateTime = { $gt: query.filter.DateTime };
    //     }
    //     try {
    //         Products.find(filter, {
    //             Title: 1,
    //             Description: 1,
    //             Files: 1,
    //             User: 1,
    //             DateTime: 1,
    //             IsCommentsOn: 1
    //         }, callback).sort({ DateTime: -1 }).skip(0).limit(10);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getNewsByFilter: function (query, callback) {
    //     let skipno = (query ? query.skip : 0);
    //     var filter = { Show: true };
    //     if (query && query.Category) {
    //         filter.Category = query.Category;
    //     }
    //     if (query && query.skipNewsId) {
    //         filter._id = { $ne: query.skipNewsId }
    //     }
    //     try {
    //         Products.find(filter, {
    //             Title: 1,
    //             Description: 1,
    //             Files: 1,
    //             User: 1,
    //             DateTime: 1,
    //         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(20);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getNewsById: function (query, callback) {
    //     try {
    //         Products.find(query, callback).limit(1);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getHeadlines: function (query, callback) {
    //     try {
    //         Products.find(query, {
    //             Title: 1,
    //             // Description: 1
    //         }, callback).sort({ DateTime: -1 }).limit(20);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // updateNews: function (newsInfo, callback) {
    //     console.log('-----');
    //     console.log(newsInfo);
    //     try {
    //         Products.updateOne({
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
    //                 Show: newsInfo.Show,
    //                 IsCommentsOn: newsInfo.IsCommentsOn
    //             }
    //         }, callback);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getTotalCountNewsPostedByUser: function (query, callback) {

    //     try {
    //         Products.find(query).countDocuments(callback);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getTopNews: function (query, callback) {
    //     let skipno = (query && query.skip ? query.skip : 0);
    //     var filter = query.filter;
    //     filter.Show = true;
    //     console.log(skipno);
    //     try {
    //         Products.find(filter, {
    //             Title: 1,
    //             Description: 1,
    //             Files: 1,
    //             User: 1,
    //             DateTime: 1,
    //         }, callback).sort({ DateTime: -1 }).skip(skipno).limit(10);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getallNewsForAdmin: function (query, callback) {
    //     let skipno = (query && query.skip ? query.skip : 0);
    //     console.log(skipno);


    //     try {
    //         Products.find(query.filter, callback).sort({ DateTime: -1 }).skip(skipno).limit(500);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getAllNewsByUserId: function (query, callback) {
    //     let skip = query.skip ? query.skip : 0;
    //     console.log(query);
    //     try {
    //         Products.find(query.filter, {
    //             Title: 1,
    //             Description: 1,
    //             DateTime: 1,
    //             Files: 1,
    //             Category: 1,
    //             IsCommentsOn: 1
    //         }, callback).sort({ DateTime: -1 }).skip(skip).limit(20);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getAllEnglishNews: function (query, callback) {
    //     try {
    //         Products.find({}, callback).sort({ DateTime: -1 }).limit(1000);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getNewsCountByCategory: function (query, callback) {
    //     try {
    //         Products.aggregate([
    //             {
    //                 "$group": {
    //                     "_id": "$Category",
    //                     "count": { $sum: 1 }
    //                 }
    //             },
    //         ], callback)
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // },
    // getNewsByFilterAll: function (query, callback) {
    //     try {
    //         Products.find({
    //             $or: [{ Title: new RegExp('.*' + query.filter + '.*', "i") },
    //             { Description: new RegExp('.*' + query.filter + '.*', "i") },
    //             { "User.firstName": new RegExp('.*' + query.filter + '.*', "i") },
    //             { "User.lastName": new RegExp('.*' + query.filter + '.*', "i") },
    //             { Category: new RegExp('.*' + query.filter + '.*', "i") }
    //             ]
    //         }, callback).limit(500);
    //     } catch (e) {
    //         console.log(e);
    //         callback(e, null);
    //     }
    // }
}

// module.exports.test : function (query, callback) {
//     console.log('1234567');
//     try {
//         Products.aggregate([
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

