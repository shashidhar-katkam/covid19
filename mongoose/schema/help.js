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
    WhatToDo: {
        type: String,
       // required: true
    },
    Status: { //approved or rejected or viewed, processing.....
        type: String,
        required: true
    },
    StatusMessage: {   // comment...
        type: String,
        require: true
    },
    ReviewerId: {
        type: String
    },
    DateTime: {
        type: Date,
        required: true
    },
    User: {
        //type: String
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
            filePath: String
        }]
    }
});

module.exports = mongoose.model('lhelfwspDesks', NewsSchema);