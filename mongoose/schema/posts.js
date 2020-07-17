const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    SubTitle: {
        type: String
    },
    AdditionalInfo1: {
        type: String
    },
    AdditionalInfo2: {
        type: String
    },
    Comment: {
        type: String
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
    DateTime: {
        type: Date,
        required: true
    },
    Show: {
        type: Boolean,
        required: true
    },
    Type: {  // allowcomments or allow questions or allow polls....
        type: Number,
        required: true
    },
    PostType: { // postcard or maintype 
        type: Number,
        required: true
    },
    CreatedBy: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        },
        required: true
    },
    ModifiedBy: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    ModifiedOn: {
        type: String
        //  required: true
    }
});

module.exports = mongoose.model('lUseldewssweswertyPersons ', postsSchema);
