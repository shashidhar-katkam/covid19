const Polls = require('./schema/polls');

module.exports = {
    CreatePoll: function (pollInfo, callback) {
        try {
            Polls.create(pollInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getPollOptionsByRefId: function (query, callback) {
        try {
            Polls.find(query, {
                Option1: 1,
                Option2: 1,
                Option3: 1,
                Option4: 1,
                Option1T: 1,
                Option2T: 1,
                Option3T: 1,
                Option4T: 1,
                Option1Poll: 1,
                Option2Poll: 1,
                Option3Poll: 1,
                Option4Poll: 1,
                _id: 0
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    answerPoll: function (pollInfo, callback) {
        try {
            Polls.updateOne({
                RefId: pollInfo.RefId
            },
                { $inc: pollInfo.updateObj }
                , callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}