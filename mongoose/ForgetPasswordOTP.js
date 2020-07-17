const OTP = require('./schema/otp');

module.exports = {
    saveOTPDetails: function (otpInfo, callback) {
        try {
            OTP.create(otpInfo, callback);
        } catch (e) {
            callback(e, null);
        }
    },
    getOTPUser: function (query, callback) {
        try {
            OTP.find(query, callback).sort({ dateTime: -1 }).limit(1);
        } catch (e) {
            callback(e, null);
        }
    }
}