const User = require('./schema/user');
module.exports = {
    getUserDetailsbyID: function (query, callback) {
        try {
            User.find(query, {
                phoneNumber: 1,
                firstName: 1,
                lastName: 1,
                imagePath: 1,
                city: 1,
                state: 1,
                email: 1,
                gender: 1,
                userType: 1,
                UId: 1
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateProfile: function (userInfo, callback) {
        console.log(userInfo);
        try {
            User.updateOne({
                _id: userInfo.id
            }, {
                $set: userInfo.updateObj
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    checkIsUserAvailableByFilter: function (query, callback) {

        try {
            User.find(query, callback);//.countDocuments(callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getUserbyUserName: function (query, callback) {
        try {
            User.find(query, {
                phoneNumber: 1,
                password: 1,
                firstName: 1,
                lastName: 1,
                _id: 1,
                imagePath: 1,
                userType: 1,
                accountStatus: 1,
                email: 1
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    RegisterUser: function (objUser, callback) {
        try {
            User.create(objUser, callback);
        } catch (e) {
            console.log(e);
        }
    },
    getUserByPhoneNumber: function (query, callback) {
        try {
            User.find(query, {
                phoneNumber: 1,
                firstName: 1,
                lastName: 1,
                _id: 1,
                accountStatus: 1,
                email: 1
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    updateProfileByPhoneNumber: function (userInfo, callback) {
        console.log(userInfo);
        try {
            User.updateOne({
                phoneNumber: userInfo.phoneNumber
            }, {
                $set: userInfo.updateObj
            }, callback);
        } catch (e) {
            console.log(e);
            callback(e, null);
        }
    },
    getUsersCount: function (callback) {
        try {
            User.find({}).countDocuments(callback);
        }
        catch (e) {
            callback(e, null);
            console.log(e);
        }
    },
}