const mongoose = require('mongoose');

const FilesSchema = new mongoose.Schema({
    fileNewName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: Number,
        required: true
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
        },
        required: true
    }
});

module.exports = mongoose.model('lFwildydsee', FilesSchema);