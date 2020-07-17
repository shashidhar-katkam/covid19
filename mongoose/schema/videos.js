const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    DateTime: {
        type: Date,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    User: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        },
        required: true
    },
    Files: {
        type: [{
            fileNewName: String,
            mimeType: String,
            originalName: String,
            filePath: String,
            fileType: Number
        }]
    },
    Show: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('lvideos', NewsSchema);
