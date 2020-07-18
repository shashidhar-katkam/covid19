const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: String,
        required: true
    },
    Diceases: {
        type: Object,
        required: true
    },
    Symptoms: {
        type: String,
        required: true
    },
    Treatment: {
        type: String,
        required: true
    },
    MoreToSay: {
        type: String,
        //  required: true
    },
    Status: {
        type: Number,
        required: true,
        default: 1
    },
    ReviewerId: {
        type: String
    },
    DateTime: {
        type: Date,
        required: true
    },
    Show: {
        type: Boolean,
        required: true,
        default: true
    },
    User: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    Files: {
        type: [{
            fileNewName: String,
            mimeType: String,
            originalName: String,
            filePath: String,
            fileType: Number
        }]
    }
});

module.exports = mongoose.model('COVID_stories', StorySchema);
