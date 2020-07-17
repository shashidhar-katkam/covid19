const mongoose = require('mongoose');

const SelfAdminRequestsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    reviewerId: {
        type: String
    },
    accountStatusMsg: {
        type: String
    },
    isReviewed: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('lSelfAdminReqfuestss', SelfAdminRequestsSchema);