const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('COVID_otp1', OTPSchema);