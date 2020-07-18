const Stories = require('../../mongoose/Stories');
const HelpCovid = require('../../mongoose/HelpCovid');
const Comments = require('../../mongoose/Comments');
const App = require('../../app');
const dateTime = require('date-time');
const Razorpay = require('razorpay');
const Donations = require('../../mongoose/Donations');
module.exports = {
    createStory: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        newsInfo['ReviewerId'] = '';
        Stories.createStory(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Story created.`,
                    statuscode: 1
                });
            }
        });
    },
    getStories: function (requestObj, callback) {
        let filter = { skip: requestObj.skip }
        Stories.getStories(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `stories fetched.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    raiseHelpRequest1: function (newsInfo, callback) {
        newsInfo['dateTime'] = dateTime();
        newsInfo['reviewerId'] = '';
        HelpCovid.raiseHelpRequest1(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `request sumbitted..`,
                    statuscode: 1
                });
            }
        });
    },
    getHelpRequests1: function (requestObj, callback) {
        let filter = { skip: requestObj.skip }
        HelpCovid.getHelpRequests1(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `help request fetched.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    PostComment: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        Comments.PostComment(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Comment Posted.`,
                    statuscode: 1
                });
                App.getSocket().emit(`Comments_${newsInfo.RefId}`, newsInfo);
            }

        });
    },
    getCommentsByRefId: function (filter, callback) {
        Comments.getCommentsByRefId(filter, (err, newsCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (newsCreated) {
                callback({
                    status: true,
                    message: `Records fetched successfully`,
                    statuscode: 1,
                    data: newsCreated
                });
            }
        });

    },
    raiseDonationRequest: function (requestObj, callback) {
        var user = {
            _id: requestObj['_id'],
            firstName: requestObj['firstName'],
            phoneNumber: requestObj['phoneNumber'],
            email: requestObj['email']
        }
        var requestInfo = {};
        requestInfo['DonatedBy'] = user;
        requestInfo['DateTime'] = dateTime();

        var paidTAmount = Number(requestObj['amount']).toFixed(2).toString().replace(".", "");
        var instance = new Razorpay(
            {
                key_id: 'rzp_live_e8OzQWD8TE3s46',
                key_secret: '2pixfGReB2qdhtZKn3uFWurE'
            });

        instance.orders.create(
            {
                amount: paidTAmount,
                currency: 'INR',
                receipt: 'sptest2',
                payment_capture: 1

            }).then((response) => {
                console.log(response);
                requestInfo["Amount"] = paidTAmount;
                requestInfo["PaymentInit"] = response;

                Donations.raiseDonationRequest(requestInfo, (err, orderPlaced) => {
                    if (err) {
                        callback({
                            status: false,
                            message: `${err.message}`,
                            statuscode: 0
                        });
                    } else if (orderPlaced) {
                        callback({
                            status: true,
                            message: `Order Initiated, please complete the payment.`,
                            statuscode: 23,
                            data: { paymentInit: response, orderId: orderPlaced['_id'], key: "rzp_live_e8OzQWD8TE3s46" }
                        });
                    }
                });
            });
    },
    checkIsAmountPaidOrNot: function (id, callback) {
        var instance = new Razorpay(
            {
                key_id: 'rzp_live_e8OzQWD8TE3s46',
                key_secret: '2pixfGReB2qdhtZKn3uFWurE'
            });
        console.log(id);
        instance.orders.fetch(id).then((response) => {
            console.log(response);
            callback(null, response);
        }).catch((error) => {
            console.log(error);
            callback(error, null);
        });
    },
    updateDonationRequest: function (requestObj, callback) {
        console.log('shashidhar');
        console.log(requestObj);
        if (requestObj && requestObj.paymentInit && requestObj.paymentInit.id) {
            this.checkIsAmountPaidOrNot(requestObj.paymentInit.id, (err1, data) => {
                if (err1) {
                    callback({
                        status: false,
                        message: err1.message,
                        statuscode: 298,
                        //  data: cartItems
                    });
                } else if (data) {
                    if (data.amount_paid !== 0) {
                        let updateObj = { _id: requestObj.orderId, updateObj: { PaymentSuccess: requestObj.PaymentSuccess, PaymentStatus: true } }
                        Donations.updateDonationRequest(updateObj, (err, cartItems) => {
                            if (err) {
                                callback({
                                    status: false,
                                    message: `${err.message}`,
                                    statuscode: 04
                                });
                            } else if (cartItems) {
                                callback({
                                    status: true,
                                    message: `Order placed successfully.`,
                                    statuscode: 247,
                                    //  data: cartItems
                                });
                            }
                        });
                    } else {
                        callback({
                            status: false,
                            message: `Payment not successfully completed.`,
                            statuscode: 742,
                            //  data: cartItems
                        });
                    }
                }
            })
        }
    }
}
