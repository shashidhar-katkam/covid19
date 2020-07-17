const Donations = require('./schema/donations');

module.exports = {
    raiseDonationRequest: function (requestInfo, callback) {
        try {
            Donations.create(requestInfo, callback);
        } catch (e) {
            callback(e, null);
        }
    },

    updateDonationRequest: function (requestObj, callback) {
        try {
            Donations.updateOne({
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

}
