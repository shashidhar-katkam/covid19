const OTP1 = require('./schema/otp1');

module.exports = {
    saveOTPDetails : function (otpInfo, callback) {
        try {
            OTP1.create(otpInfo, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getOTPUser : function (query, callback) {
        try {
            OTP1.find(query, callback).sort({ dateTime: -1 }).limit(1);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    }
}