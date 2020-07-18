const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    RefId: {
        type: String,
        required: true
    },
    CommetPoster: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    Comment: {
        type: String,
        required: true
    },
    DateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('CommentsMain ', CommentSchema);
