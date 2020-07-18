var Stories = require('./schema/stories');

module.exports = {
    createStory: function (newsInfo, callback) {
        try {
            Stories.create(newsInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getStories: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        let limit = (query && query.limit ? query.limit : 10);
        console.log(query.filter);
        try {
            Stories.find({ Show: true }, {
                Name: 1,
                Treatment:1,
                Files: 1,
                User: 1,
                Symptoms:1,
                Diceases:1,
                Age:1,
                MoreToSay:1,
                DateTime: 1,
            }, callback).sort({ DateTime: -1 }).skip(skipno).limit(limit);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}