const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
       // required: true
    },
    Status: { //approved or rejected or viewed, processing.....
        type: String,
        required: true,
        default: 'Submitted'
    },
    StatusMessage: {   // comment...
        type: String,
        require: true,
        default: ''
    },
    ReviewerId: {
        type: String
    },
    DateTime: {
        type: Date,
        required: true
    },
    Category: {
        type: String,
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
    },
    SelfAdminPosted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('lNewSWeswwfwwsyfdwNewa', NewsSchema);
