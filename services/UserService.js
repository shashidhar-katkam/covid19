const User = require('../mongoose/User');

const AccountStatus = {
    Registered: 1,
    Approved: 2,
    Blocked: 3,
    Rejected: 4
}

module.exports = {
    getUserDetailsbyID: function (requestObj, callback) {
        var filter = {};
        if (requestObj && requestObj.id) {
            filter._id = requestObj.id;
        }
        User.getUserDetailsbyID(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error Occured.`,
                    statuscode: 0
                });
            }
            else if (data && data.length != 0) {
                callback({
                    status: true,
                    message: `User Details fetched successfully.`,
                    statuscode: 1,
                    data: data
                });
            } else {
                callback({
                    status: false,
                    message: `No data found.`,
                    statuscode: 2
                });
            }
        });
    },
    updateProfile: function (profileInfo, callback) {
        profileInfo['reviewerId'] = 'shashidhar';
        let data;
        if (profileInfo.field === 'imagePath') {
            data = { id: profileInfo.data.id, updateObj: { imagePath: profileInfo.data.imagePath } }
        } else if (profileInfo.field === 'gender') {
            data = { id: profileInfo.data.id, updateObj: { gender: profileInfo.data.gender } }
        } else if (profileInfo.field === 'email') {
            data = { id: profileInfo.data.id, updateObj: { email: profileInfo.data.email } }
        } else if (profileInfo.field === 'name') {
            data = { id: profileInfo.data.id, updateObj: { firstName: profileInfo.data.firstName, lastName: profileInfo.data.lastName } }
        } else if (profileInfo.field === 'address') {
            data = { id: profileInfo.data.id, updateObj: { state: profileInfo.data.state, city: profileInfo.data.city } }
        } else if (profileInfo.field === 'accountStatus') {
            data = { id: profileInfo.data.id, updateObj: { accountStatus: profileInfo.data.status, accountStatusMsg: profileInfo.data.statusMsg, reviewerId: profileInfo.reviewerId } }
        } else if (profileInfo.field === 'userType') {
            data = { id: profileInfo.data.id, updateObj: { userType: profileInfo.data.status, accountStatusMsg: profileInfo.data.statusMsg, reviewerId: profileInfo.reviewerId } }
        }
        else {
            data = {};
        }
        User.updateProfile(data, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: 'Error occured.',
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Profile Updated`,
                    statuscode: 1
                });
            }
        });
    },
    checkIsUserAvailableByFilter: function (filterObj, callback) {
        var queryFilter;
        if (filterObj.field === 'firstName') {
            queryFilter = { _id: { $ne: filterObj.id }, $or: [{ firstName: filterObj.text }, { lastName: filterObj.text }] };
        } else if (filterObj.field === 'email') {
            queryFilter = { _id: { $ne: filterObj.id }, email: filterObj.text };
        } else if (filterObj.field === 'username') {
            queryFilter = { _id: { $ne: filterObj.id }, phoneNumber: filterObj.text };
        } else {
            queryFilter = {};
        }

        User.checkIsUserAvailableByFilter(queryFilter, (err, objCreated) => {
            if (err) {
                console.log(err);
                callback({
                    status: false,
                    message: 'Error occured.',
                    statuscode: 0
                });
            }
            else if (objCreated) {
                console.log(objCreated);
                callback({
                    status: true,
                    message: `Marked as Important.`,
                    statuscode: 1,
                    data: objCreated.length
                });
            }
        });
    },
    changePassword: function (obj, callback) {
        User.getUserbyUserName({
            phoneNumber: obj['phoneNumber']
        }, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: 'Error occured.',
                    statuscode: 0
                });
            } else if (data && data.length == 1) {
                console.log(data[0]);
                if (obj['oldPassword'] === data[0]['password']) {
                    var updateInfo = { id: obj['id'], updateObj: { password: obj['newPassword'] } };
                    console.log('updateInfo');
                    User.updateProfile(updateInfo, (err, objCreated) => {
                        if (err) {
                            callback({
                                status: false,
                                message: `${err.message}`,
                                statuscode: 0
                            });
                        } else if (objCreated) {
                            callback({
                                status: true,
                                message: `Password changed successfully.`,
                                statuscode: 1
                            });
                        }
                    });
                } else {
                    callback({
                        status: false,
                        statuscode: 3,
                        message: 'Incorrect Old password.'
                    })
                }
            } else {
                callback({
                    status: false,
                    statuscode: 2,
                    message: 'Couldn\'t find you Account'
                });
            }
        });
    },
   
}