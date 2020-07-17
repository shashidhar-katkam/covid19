const Comments = require('./schema/comments');

module.exports = {
    PostComment: function (commentInfo, callback) {
        try {
            Comments.create(commentInfo, callback);
        } catch (err) {
            callback(err, null);
        }
    },
    getCommentsByRefId: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        try {
            Comments.find(query.filter, {
                CommetPoster: 1,
                Comment: 1,
                DateTime: 1,
            }, callback).sort({ DateTime: -1 }).skip(skip).limit(10);
        } catch (err) {
            console.log(err);
            callback(err, null);
        }
    }
}