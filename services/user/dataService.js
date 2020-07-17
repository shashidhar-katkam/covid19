const News = require('../../mongoose/News');
const EngishNews = require('../../mongoose/NewsEn');
const Comments = require('../../mongoose/Comments');
const HelpRequests = require('../../mongoose/Help');
const SelfAdminRequests = require('../../mongoose/SelfAdminRequests');
const Persons = require('../../mongoose/Persons');
const Files = require('../../mongoose/Files');
const App = require('../../app');
const dateTime = require('date-time');
const Queries = require('../../mongoose/Queries');
const Razorpay = require('razorpay');
const Donations = require('../../mongoose/Donations');
module.exports = {
    getNewsForUserHomePage: function (requestObj, callback) {
        let filter = { skip: requestObj.skip }
        EngishNews.getNewsForUserHomePage(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getLatestNews: function (requestObj, callback) {

        EngishNews.getLatestNews(requestObj, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                if (data.length >= 10) {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: data
                    });
                } else {
                    let filter = { skip: requestObj.skip + data.length, limit: 10 - data.length }
                    EngishNews.getNewsForUserHomePage(filter, (err1, data1) => {
                        if (err1) {
                            callback({
                                status: false,
                                message: `Error occured.`,
                                statuscode: 0
                            });
                        } else if (data1) {
                            if (data1 && data1.length > 0) {
                                for (var i = 0; i < data1.length; i++) {
                                    data.push(data1[i]);
                                }
                            }
                            callback({
                                status: true,
                                message: `User Details saved Successfully.`,
                                statuscode: 1,
                                data: data
                            });
                        }
                    });
                }
            }
        });
    },
    getNewsByFilter: function (requestObj, callback) {
        var filter = {};
        if (requestObj && requestObj.skip) {
            filter.skip = requestObj.skip;
        }
        if (requestObj && requestObj.category) {
            filter.Category = requestObj.category;
        }
        if (requestObj && requestObj.skipNewsId) {
            filter.skipNewsId = requestObj.skipNewsId;
        }
        EngishNews.getNewsByFilter(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getNewsById: function (requestObj, callback) {
        let filter = {};
        if (requestObj && requestObj.id) {
            filter._id = requestObj.id;
        }
        EngishNews.getNewsById(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getHeadlines: function (filterQuery, callback) {

        EngishNews.getHeadlines({ IsHeadlines: true, Show: true }, (err, newsCreated) => {
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
    createNews: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        //  newsInfo['StatusMessage'] = '';
        News.CreateNews(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                // if (requestObj.Files) {
                //     if (requestObj.Files.length > 0) {
                //         for (var i = 0; i < requestObj.Files.length; i++) {
                //             this.addFile(requestObj.Files[i], (fi) => {
                //             });
                //         }
                //     }
                // }
                callback({
                    status: true,
                    message: `News Posted.`,
                    statuscode: 1
                });
            }
        });
    },
    raiseHelpRequest: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        newsInfo['Status'] = "Submitted";
        newsInfo['StatusMessage'] = '';
        HelpRequests.raiseHelpRequest(newsInfo, (err, objCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (objCreated) {
                callback({
                    status: true,
                    message: `Yours help request submitted successfully . We will contact you shortly.`,
                    statuscode: 1
                });
            }
        });
    },
    getTopNews: function (requestObj, callback) {
        let filterQuery = { filter: { IsTopTen: true, Show: true } };
        if (requestObj && requestObj.skip) {
            filterQuery.skip = requestObj.skip;
        }
        EngishNews.getTopNews(filterQuery, (err, newsCreated) => {
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
    getAllNewsByUserId: function (requestObj, callback) {
        let query = {};
        if (requestObj && requestObj.id) {
            query.filter = { 'User._id': requestObj.id, Show: true };
        }
        if (requestObj && requestObj.skip) {
            query.skip = requestObj.skip;
            query.filter = { Show: true };
        }
        EngishNews.getAllNewsByUserId(query, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else if (data) {
                callback({
                    status: true,
                    message: `User Details saved Successfully.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getTotalCountNewsPostedByUser: function (filter, callback) {
        EngishNews.getTotalCountNewsPostedByUser(filter, (err, data) => {
            if (err) {
                callback(err, null);
            } else if (data) {
                console.log(data);
                callback(null, data);
            }
        });
    },
    getTotalNewsCountOfUser: function (filter, callback) {
        console.log(filter);
        News.getUserSubmittedNewsByFilter(filter, (err, data) => {
            if (err) {
                callback(err, null);
            } else if (data) {
                console.log(data);
                callback(null, data);
            }
        });
    },
    getAllNewsPostedByMe: function (filter, callback) {
        News.getUserSubmittedNewsByFilterForUser(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    getMyHelpRequests: function (filter, callback) {
        HelpRequests.getMyHelpRequests(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    sendSelfAdminRequest: function (requestInfo, callback) {
        SelfAdminRequests.sendSelfAdminRequest(requestInfo, (err, data) => {
            if (err) {
                var msg = err.message;
                console.log(err);
                if (msg.includes('duplicate key error')) {
                    callback({
                        status: false,
                        message: `Already Request sent.`,
                        statuscode: 0
                    });
                } else {
                    callback({
                        status: false,
                        message: `${err.message}`,
                        statuscode: 0
                    });
                }
            } else if (data) {
                console.log(data);
                callback({
                    status: true,
                    message: `Request sent succussfully.`,
                    statuscode: 1,
                });
            }
        });
    },
    getAllInfoForMyDashboard: function (requestObj, callback) {
        let filter = { "User._id": requestObj.UserId, Status: { $in: ["Submitted", "Process"] } };
        let responseData = {};
        console.log(filter);
        News.getNewsCountByFilter(filter, (err, data1) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else if (data1) {
                responseData.Submitted = data1.length;
                let filter1 = { "User._id": requestObj.UserId, Status: "Approved" };
                News.getNewsCountByFilter(filter1, (err, data2) => {
                    if (err) {
                        callback({
                            status: false,
                            message: `Error occured..`,
                            statuscode: 0
                        });
                    } else if (data2) {
                        responseData.Approved = data2.length;
                        let filter2 = { "User._id": requestObj.UserId, Status: "Rejected" };
                        News.getNewsCountByFilter(filter2, (err, data3) => {
                            if (err) {
                                callback({
                                    status: false,
                                    message: `Error occured..`,
                                    statuscode: 0
                                });
                            } else if (data3) {
                                responseData.Rejected = data3.length;
                                callback({
                                    status: true,
                                    message: `Error occured..`,
                                    statuscode: 1,
                                    data: responseData
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    getAllNewsPostedByMeAndFilter: function (requestObj, callback) {
        let filter;
        if (requestObj.value === "Approved") {
            filter = { "User._id": requestObj.UserId, Status: "Approved" };
        } else if (requestObj.value === "Rejected") {
            filter = { "User._id": requestObj.UserId, Status: "Rejected" };
        } else if (requestObj.value === "Submitted") {
            filter = { "User._id": requestObj.UserId, Status: { $in: ["Submitted", "Process"] } };
        } else {
            callback({
                status: false,
                message: `Error occured..`,
                statuscode: 0
            });
        }
        News.getUserSubmittedNewsByFilterForUser(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured.`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    addFile: function (fileInfo, callback) {
        fileInfo['DateTime'] = dateTime();
        fileInfo['User'] = "Unknown";
        Files.addFile(fileInfo, (err, newsCreated) => {
            if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
                });
            } else if (newsCreated) {
                callback({
                    status: true,
                    message: `file added.`,
                    statuscode: 1
                });
            }
        });
    },
    getAllFiles: function (fileInfo, callback) {
        News.getAllFiles({}, (err, newsCreated) => {
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
                //  console.log(newsCreated);
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
    SaveInfo: function (newsInfo, callback) {
        newsInfo['DateTime'] = dateTime();
        Persons.SaveInfo(newsInfo, (err, objCreated) => {
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
            }
        });
    },
    checkIsRequestSubmitted: function (requestObj, callback) {
        SelfAdminRequests.checkIsRequestSubmitted(requestObj, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Data fetched Successfully.`,
                    statuscode: 0
                });
            } else if (data) {
                if (data.length > 0) {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: { submitted: true, data: data[0] }
                    });
                } else {
                    callback({
                        status: true,
                        message: `User Details saved Successfully.`,
                        statuscode: 1,
                        data: { submitted: false }
                    });
                }

            }
        });
    },
    getNewsCountByStatus: function (filter, callback) {
        News.getNewsCountByStatus(filter, (err, data) => {
            if (err) {
                callback({
                    status: false,
                    message: `Error occured..`,
                    statuscode: 0
                });
            } else {
                callback({
                    status: true,
                    message: `news for approve.`,
                    statuscode: 1,
                    data: data
                });
            }
        });
    },
    saveQuery: function (data, callback) {
        data['dateTime'] = dateTime();
        Queries.saveQuery(data, (err, newsCreateda) => {
            if (newsCreateda) {
                callback({
                    status: true,
                    message: 'Query submited. Will will get back to you.  \n thank you',
                    statuscode: 1
                });
            }
            else if (err) {
                callback({
                    status: false,
                    message: `${err.message}`,
                    statuscode: 0
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
    },

}
