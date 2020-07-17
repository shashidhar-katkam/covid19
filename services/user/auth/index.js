const Util = require('../../../util/util');
const jwt = require('jsonwebtoken');
const dateTime = require('date-time');
const nodemailer = require('nodemailer');
const User = require('../../../mongoose/User');
const OTP = require('../../../mongoose/OTP');
const ForgetPasswordOTPs = require('../../../mongoose/ForgetPasswordOTP');
const moment = require('moment');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    //secure: true,
    auth: {
        user: 'shashi2puppy@gmail.com',
        pass: 'yspnotbtjadkesif'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});


const UserType = {
    Normal: 1,
    SelfAdmin: 2,
    Admin: 3,
    SuperAdmin: 4
}

const AccountStatus = {
    Registered: 1,
    Verified: 2,
    Blocked: 3,
    Rejected: 4
}

module.exports = {
    RegisterUser: function (objUser, callback) {

        Util.GenerateUserId((err, id) => {
            //     console.log(id);
            objUser['UId'] = id
            //     objUser['dateTime'] = dateTime();
            objUser['userType'] = UserType.Normal;
            objUser['accountStatus'] = AccountStatus.Registered;
            objUser['dateTime'] = dateTime();
            //     console.log(objUser);
            User.RegisterUser(objUser, (err, objCreated) => {
                if (err) {
                    var msg = err.message;
                    console.log(err);
                    if (msg.includes('duplicate key error')) {
                        callback({
                            status: false,
                            message: `Already Registered with this Phone Number/Email`,
                            statuscode: 2
                        });
                    } else {
                        callback({
                            status: false,
                            message: `${err.message}`,
                            statuscode: 10
                        });
                    }
                } else if (objCreated) {
                    console.log(objCreated);
                    callback({
                        status: true,
                        message: `Account Created with ${objCreated['phoneNumber']}`,
                        statuscode: 1,
                        username: objCreated['phoneNumber']
                    });
                }
            });
        });
    },
    InsertUserDetails: function (objUser, callback) {
        objUser['createdDate'] = dateTime();
        objUser['modifiedDate'] = dateTime();
        console.log(objUser);
        User.InsertUserDetails(objUser, (err, objCreated) => {
            if (err) {
                var msg = err.message;
                if (msg.includes('duplicate key error')) {

                    callback({
                        status: false,
                        message: `Already Registered with ${objUser['MBID']}`,
                        statuscode: 0
                    });
                } else {
                    callback({
                        status: false,
                        message: `${err.message}`,
                        statuscode: 0
                    });
                }
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1
                });
            }
        });
    },
    UpdateUserDetails: function (objUser, callback) {
        objUser['modifiedDate'] = dateTime();
        console.log(objUser);
        User.UpdateUserDetails(objUser, (err, objCreated) => {
            if (err) {
                var msg = err.message;
                if (msg.includes('duplicate key error')) {
                    callback({
                        status: false,
                        message: `Already Registered with ${objUser['MBID']}`,
                        statuscode: 0
                    });
                } else {
                    callback({
                        status: false,
                        message: `${err.message}`,
                        statuscode: 0
                    });
                }
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1
                });
            }
        });
    },
    Login: function (objUser, callback) {
        User.getUserbyUserName({
            phoneNumber: objUser['phoneNumber']
        }, (err, data) => {
            if (err) {
                callback({
                    statusmsg: {
                        status: false,
                        statuscode: 10,
                        message: 'Some error occured.'
                    }
                })
            } else if (data) {
                if (data.length == 1) {
                    console.log(data[0]);
                    if (objUser['password'] === data[0]['password']) {
                        const user = data[0];

                        if (data[0]['accountStatus'] === AccountStatus.Registered) {
                            callback({
                                statusmsg: {
                                    status: false,
                                    statuscode: 2,
                                    message: 'Your account is not verified. Please give us some time to Verified your account.'
                                }
                            })
                        } else if (data[0]['accountStatus'] === AccountStatus.Rejected) {
                            callback({
                                statusmsg: {
                                    status: false,
                                    statuscode: 3,
                                    message: 'your account is rejected due to wrong Information entered.'
                                }
                            })

                        } else if (data[0]['accountStatus'] === AccountStatus.Blocked) {
                            callback({
                                statusmsg: {
                                    status: false,
                                    statuscode: 4,
                                    message: 'Your account is Suspended.'
                                }
                            })
                        } else if (data[0]['accountStatus'] === AccountStatus.Verified) {
                            jwt.sign({
                                user: user
                            }, 'secretkey', {
                                expiresIn: 60000
                            }, (err, token) => {
                                callback({
                                    statusmsg: {
                                        status: true,
                                        statuscode: 1,
                                        message: 'Login Successfully'
                                    },
                                    User: {
                                        _id: data[0]['_id'],
                                        firstName: data[0]['firstName'],
                                        lastName: data[0]['lastName'],
                                        email: data[0]['email'],
                                        imagePath: data[0]['imagePath'],
                                        userType: data[0]['userType'],
                                        phoneNumber: data[0]['phoneNumber']
                                    },
                                    MBwebToken: token
                                })
                            });
                        } else {
                            callback({
                                statusmsg: {
                                    status: false,
                                    statuscode: 5,
                                    message: 'Something went wroLng.'
                                }
                            });
                        }
                    } else {
                        callback({
                            statusmsg: {
                                status: false,
                                statuscode: 6,
                                message: "Wrong password. Try again or click 'Forgot Password' to reset it."
                            }
                        });
                    }
                } else {
                    callback({
                        statusmsg: {
                            status: false,
                            statuscode: 7,
                            message: 'Couldn\'t find you Account'
                        }
                    });
                }
            }
        });
    },
    VerifyEmail: function (objUser, callback) {
        console.warn(objUser);
        User.getUserByPhoneNumber({
            phoneNumber: objUser['phoneNumber']
        }, (err, data) => {
            console.log(err);
            if (err) {
                callback({
                    status: false,
                    statuscode: -1,
                    message: 'Some error ee occured.'
                });
            } else if (data) {
                if (data.length == 1) {
                    console.log(data[0]);
                    if (objUser['email'] === data[0]['email']) {
                        var otpg = Util.generateSixDigitOtp();
                        OTP.saveOTPDetails(
                            {
                                phoneNumber: data[0]['phoneNumber'],
                                email: data[0]['email'],
                                otp: otpg,
                                dateTime: moment().add(5, 'minutes')
                            }, (err, data1) => {
                                if (err) {
                                    callback({
                                        status: true,
                                        statuscode: -1,
                                        message: err
                                    });
                                } else if (data1) {
                                    callback({
                                        status: true,
                                        statuscode: 1,
                                        message: otpg  //"Please enter otp sent to your email."
                                    });
                                    const message = {
                                        from: 'shashi2puppy@gmail.com', // Sender address
                                        to: data[0]['email'],         // List of recipients
                                        subject: 'OTP For Verification', // Subject line
                                        text: `Your verification code is: ${otpg}`  // Plain text body
                                    };
                                    transport.sendMail(message, function (err, info) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(info);
                                        }
                                    });
                                }
                            });
                    } else {
                        callback({
                            status: false,
                            statuscode: 6,
                            message: "The email Id is not associated with your account. Please enter correct email"
                        });
                    }
                } else {
                    callback({
                        status: false,
                        statuscode: 7,
                        message: 'Couldn\'t find you Account'
                    });
                }
            }
        });
    },
    VerifyOTP: function (OTPDetails, callback) {
        OTP.getOTPUser({
            phoneNumber: OTPDetails['phoneNumber']
        }, (err, data) => {
            if (err) {
                console.log(err);
                callback({
                    status: false,
                    statuscode: -1,
                    message: 'Some wer error occured.'
                })
            } else if (data) {
                if (data.length == 1) {
                    console.log(data);
                    if (OTPDetails['otp'] === data[0]['otp']) {
                        let obj = {
                            phoneNumber: data[0]['phoneNumber'],
                            updateObj: { accountStatus: AccountStatus.Verified }
                        };
                        User.updateProfileByPhoneNumber(obj, (err, data) => {
                            if (err) {
                                console.log(err);
                                callback({
                                    status: false,
                                    statuscode: -1,
                                    message: "some name error occured."
                                });
                            } else if (data) {
                                callback({
                                    status: true,
                                    statuscode: 1,
                                    message: "Your account is verified."
                                });
                            }
                        });
                    } else {
                        callback({
                            status: false,
                            statuscode: 2,
                            message: "Invalid OTP."
                        });
                    }
                } else {
                    callback({
                        status: false,
                        statuscode: 7,
                        message: 'Couldn\'t find you Account'
                    });
                }
            }
        });
    },
    VerifyUser: function (objUser, callback) {
        console.warn(objUser);
        User.getUserByPhoneNumber({
            phoneNumber: objUser['phoneNumber']
        }, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    statuscode: -1,
                    message: 'Some error occured.'
                });
            } else if (data) {
                if (data.length == 1) {
                    console.log(data[0]);
                    if (objUser['email'] === data[0]['email']) {
                        var otpg = Util.generateSixDigitOtp();
                        ForgetPasswordOTPs.saveOTPDetails(
                            {
                                phoneNumber: data[0]['phoneNumber'],
                                email: data[0]['email'],
                                otp: otpg,
                                dateTime: dateTime()
                            }, (err, data) => {
                                if (err) {
                                    callback({
                                        status: false,
                                        statuscode: -1,
                                        message: err
                                    });
                                } else if (data) {
                                    callback({
                                        status: true,
                                        statuscode: 1,
                                        //  message: otpg  //"Please enter otp sent to your email."
                                    });
                                }
                            });
                    } else {
                        callback({
                            status: false,
                            statuscode: 6,
                            message: "The email Id is not associated with your account. Please enter correct email"
                        });
                    }
                } else {
                    callback({
                        status: false,
                        statuscode: 7,
                        message: 'Couldn\'t find you Account'
                    });
                }
            }
        });
    },
    forgetPassword: function (OTPDetails, callback) {
        ForgetPasswordOTPs.getOTPUser({
            phoneNumber: OTPDetails['phoneNumber']
        }, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    statuscode: -1,
                    message: 'Some error occured.'
                });
            } else if (data) {
                if (data.length == 1) {
                    console.log(data);
                    if (OTPDetails['otp'] === data[0]['otp']) {
                        let obj = {
                            phoneNumber: data[0]['phoneNumber'],
                            updateObj: { password: OTPDetails['newPassword'] }
                        };
                        User.updateProfileByPhoneNumber(obj, (err, data) => {
                            if (err) {
                                callback({
                                    status: false,
                                    statuscode: -1,
                                    message: "Some error occured."
                                });
                            } else if (data) {
                                callback({
                                    status: true,
                                    statuscode: 1,
                                    message: "Password changed successfully."
                                });
                            }
                        });
                    } else {
                        callback({
                            status: false,
                            statuscode: 2,
                            message: "Invalid OTP."
                        });
                    }
                } else {
                    callback({
                        status: false,
                        statuscode: 7,
                        message: 'Couldn\'t find you Account'
                    });
                }
            }
        });
    }
}