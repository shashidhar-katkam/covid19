const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    UId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        //required: true,
    },
    gender: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
    },
    userType: {
        type: Number,
        require: true
    },
    accountStatus: {
        type: Number,
        required: true
    },
    accountStatusMsg: {
        type: String
    },
    reviewerId: {
        type: String
    }
});

module.exports = mongoose.model('COVID_user', UserSchema);