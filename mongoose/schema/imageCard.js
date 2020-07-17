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
    },
    show: {
        type: Boolean,
        required: true,
        default: true

    }
});

module.exports = mongoose.model('imageCard1', FilesSchema);