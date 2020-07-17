const PollResults = require('./schema/pollResults');

module.exports = {
    SavePollResults: function (pollInfo, callback) {
        try {
            PollResults.create(pollInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    checkIsUserIsPolled: function (query, callback) {
        try {
            PollResults.find({ RefId: query.RefId, 'PolledBy._id': query._id }, {
                Poll: 1,
                DateTime: 1
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}