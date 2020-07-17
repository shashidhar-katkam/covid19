const mongoose = require('mongoose');

const mainCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titleTe: {
        type: String,
        required: true
    },
    files: {
        type: [{
            fileNewName: String,
            mimeType: String,
            originalName: String,
            filePath: String,
            fileType: Number
        }]
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
    },
    show: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('mainCard15', mainCardSchema);