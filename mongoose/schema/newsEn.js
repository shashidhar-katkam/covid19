const mongoose = require('mongoose');

const MainNewsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String
    },
    DateTime: {
        type: Date,
        required: true
    },
    User: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    ReviewerId: {
        type: String,
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
    IsTopTen: {
        type: Boolean,
        required: true,
        default: false
    },
    IsHeadlines: {
        type: Boolean,
        required: true,
        default: false
    },
    Category: {
        type: Array,
        required: true
    },
    Show: {
        type: Boolean,
        required: true,
        default: true
    },
    IsFromHelpDesk: {
        type: Boolean,
        required: true
    },
    Type: {  // allowcomments or allow questions or allow polls....
        type: Number,
        required: true,
        default: 4
    },
    Source: { // link of news copied site.
        type: String
    },
    Analysis1: { 
        type: String
    },
    Analysis2: { 
        type: String
    },
    Analysis3: { 
        type: String
    }

});

module.exports = mongoose.model('lMraifnNspewssraaEnglish1', MainNewsSchema);