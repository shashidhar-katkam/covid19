const mongoose = require('mongoose');

const PollResultsSchema = new mongoose.Schema({
    RefId: {
        type: String,
        required: true
    },
    Poll: {
        type: Number,
        required: true
    },
    PolledBy: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    DateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('lPollResults ', PollResultsSchema);
