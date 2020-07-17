const Posts = require('./schema/posts');

module.exports = {
    SaveInfo: function (postInfo, callback) {
        try {
            Posts.create(postInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getPosts: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        try {
            Posts.find(query.filter, {
                Title: 1,
                SubTitle: 1,
                AdditionalInfo1: 1,
                AdditionalInfo2: 1,
                Comment: 1,
                Files: 1,
                DateTime: 1,
                Type: 1,
                PostType: 1,
                CreatedBy: 1
            }, callback).sort({ DateTime: -1 }).skip(skip).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getPosts: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        try {
            Posts.find(query.filter, {
                Title: 1,
                SubTitle: 1,
                AdditionalInfo1: 1,
                AdditionalInfo2: 1,
                Comment: 1,
                Files: 1,
                DateTime: 1,
                Type: 1,
                PostType: 1,
                CreatedBy: 1
            }, callback).sort({ DateTime: -1 }).skip(skip).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getPostsCountByStatus: function (query, callback) {
        console.log('0000000000000');
        try {
            Posts.aggregate([
                {
                    "$group": {
                        "_id": "$Type",
                        "count": { $sum: 1 }
                    }
                },
            ], callback)
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllPostsForAdmin: function (query, callback) {
        let skipno = (query && query.skip ? query.skip : 0);
        try {
            Posts.find(query.filter, callback).sort({ DateTime: -1 }).skip(skipno).limit(500);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updatePost: function (postInfo, callback) {
        try {
            Posts.updateOne({
                _id: postInfo._id
            }, {
                $set: {
                    Title: postInfo.Title,
                    SubTitle: postInfo.SubTitle,
                    AdditionalInfo1: postInfo.AdditionalInfo1,
                    AdditionalInfo2: postInfo.AdditionalInfo2,
                    Comment: postInfo.Comment,
                    Files: postInfo.Files,
                    PostType: postInfo.PostType,
                    ModifiedBy: postInfo.ModifiedBy,
                    ModifiedOn: postInfo.ModifiedOn,
                    Show: postInfo.Show
                }
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}