var HelpCovid = require('./schema/helpcovid');

module.exports = {
    raiseHelpRequest1: function (requestObj, callback) {
        try {
            HelpCovid.create(requestObj, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getHelpRequests1: function (query, callback) {
        let skipno = (query ? query.skip : 0);
        let limit = (query && query.limit ? query.limit : 10);
        console.log(query.filter);
        try {
            HelpCovid.find({ show: true }, {
                name: 1,
                email:1,
                phoneNumber: 1,
                user: 1,
                problem:1,
                expect:1,
                dateTime:1,
            }, callback).sort({ dateTime: -1 }).skip(skipno).limit(limit);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }

}