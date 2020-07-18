const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    expect: {
        type: String,
        require: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    user: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    show: {
        type: Boolean,
        required: true,
        default: true
    },
    reviewerId: {
        type: String
    },
});

module.exports = mongoose.model('COVID_help', HelpSchema);