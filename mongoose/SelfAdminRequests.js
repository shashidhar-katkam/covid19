const SelfAdminRequests = require('./schema/selfAdminRequests');

//creates the user >> returns created user.
module.exports = {
    sendSelfAdminRequest: function (requestInfo, callback) {

        try {
            SelfAdminRequests.create(requestInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getAllSelfAdminRequests: function (query, callback) {
        let skipno = 0;
        try {
            SelfAdminRequests.find(query, callback).skip(skipno).limit(1000);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    checkIsRequestSubmitted: function (query, callback) {
        try {
            SelfAdminRequests.find(query, { accountStatusMsg: 1, isReviewed: 1 }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    changeStatus: function (requestInfo, callback) {
        try {
            SelfAdminRequests.updateOne({
                userId: requestInfo.id
            }, {
                $set: {
                    isReviewed: true,
                    accountStatusMsg: requestInfo.updateObj.accountStatusMsg,
                    reviewerId: requestInfo.updateObj.reviewerId
                }
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}