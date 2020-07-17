var mongoose = require('mongoose');

var UserLoginSchema = new mongoose.Schema({

    PhoneNo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    MBID: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 4
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    }
});


var UserDetailsSchema = new mongoose.Schema({

    MBID: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 4
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },

    filepaths: {
        type: [{
            fileNewName: String,
            mimeType: String,
            originalName: String
        }]
    },

});


var UserLogin = module.exports = mongoose.model('UserLogin', UserLoginSchema);

//create the user >> returns created user.
module.exports.CreateUserLogin = function (objUser, callback) {

    try {
        UserLogin.create(objUser, callback);
    } catch (e) {
        console.log(e);
    }
}

module.exports.getLoginDetailsbyUserName = function (query, callback) {

    try {
        UserLogin.find(query, {
            PhoneNo: 1,
            password: 1,
            MBID: 1,
            firstName: 1,
            lastName: 1,
            _id: 0,
        }, callback);
    } catch (e) {
        console.log(e);
    }
}

module.exports.getUserCount = function (callback) {

    try {
        UserLogin.find({}).countDocuments(callback);
    } catch (e) {
        console.log(e);
    }
}
module.exports.getUsersCount = function (callback) {

    try {
        UserLogin.find({}).countDocuments(callback);
    } catch (e) {
        console.log(e);
    }
}