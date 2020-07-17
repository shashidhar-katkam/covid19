const QA = require('./schema/qa');

module.exports = {
    SaveQuestion: function (questionInfo, callback) {
        try {
            QA.create(questionInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getQAsByRefId: function (query, callback) {
        let skip = query.skip ? query.skip : 0;
        console.log(query);
        try {
            QA.find(query.filter, {
                QAskedBy: 1,
                Question: 1,
                Answers: 1,
                DateTime: 1,
            }, callback).sort({ DateTime: -1 }).skip(skip).limit(10);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}