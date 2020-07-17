const mongoose = require('mongoose');

const MainNewsSchema = new mongoose.Schema({
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
        required: true
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
    Category: {
        type: String,
        required: true
    },
    Show: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('lHelpEnglish', MainNewsSchema);
