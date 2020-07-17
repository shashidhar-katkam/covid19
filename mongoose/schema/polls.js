const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    RefId: {
        type: String,
        required: true
    },
    Option1: {
        type: String,
        required: true
    },
    Option2: {
        type: String,
        required: true
    },
    Option3: {
        type: String
    },
    Option4: {
        type: String
    },
    Option1T: {
        type: String,
        required: true
    },
    Option2T: {
        type: String,
        required: true
    },
    Option3T: {
        type: String
    },
    Option4T: {
        type: String
    },
    Option1Poll: {
        type: Number,
        default: 0
    },
    Option2Poll: {
        type: Number,
        default: 0
    },
    Option3Poll: {
        type: Number,
        default: 0
    },
    Option4Poll: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('lPolldSdsdwchema ', PollSchema);