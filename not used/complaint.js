var mongoose = require('mongoose');


var RUserSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    whathappened: {
        type: String,
        required: true
    },
    howtoresolve: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: false
    },
    longtitude: {
        type: String,
        required: true
    },
    accuracy: {
        type: String,
        required: true
    },
    ipaddress: {
        type: String,
        required: true
    },
    type: {    // personal, public , social 
        type: String,
        required: true
    },
    level: {  //urgent, //immediate 
        type: String,
        required: true
    },
    read: {     //read for check complaint
        type: Boolean,
        // default: true,
        required: true
    },
    readcount: {  //readcount of
        type: Number,
        required: true
    },
    status: {
        type: String,     //opened //closed// not opened// rejected
        required: true
    },
    code: {    //for who can see means public district wise. 
        type: Number,
        required: true
    },
    accept: { //accept or reject
        type: Boolean,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    filepaths: {
        type: [{ fileNewName: String, mimeType: String, originalName: String }]
    },
    viewersIDs: {
        type: [String],
        required: true
    }
});

var CommentSchema = new mongoose.Schema({

    ComplaintId: {
        type: String,
        required: true
    },
    commentPosterId: {
        type: String,
        required: true
    },
    commentPosterName: {
        type: String,
        required: true
    },
    Comment: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: false
    },
    dateTime: {
        type: String,
        required: true
    }
});
var PracticeSchema = new mongoose.Schema({

    body: String,
    comments: {
        type: [String],
    }
});

var Complaint = module.exports = mongoose.model('Complaint', ComplaintSchema);
var Comment = module.exports = mongoose.model('Comment', CommentSchema);
var Practice = module.exports = mongoose.model('Practice', PracticeSchema);
//Register Complaint >> returns registered complaint.
module.exports.RegisterComplaint = function (complaint, callback) {

    try {
        Complaint.create(complaint, callback);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.getComplaintbyId = function (id, callback) {

    try {
        Complaint.find({ _id: id }, { ComplaintID: 1, type: 1, role: 1, userID: 1, subject: 1, whathappened: 1, howtoresolve: 1, dateTime: 1, status: 1, level: 1, type: 1, _id: 1, filepaths: 1 }, callback);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.getComplaintsCount = function (callback) {

    try {
        Complaint.find({}).countDocuments(callback);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.GetComplaints = function (id, callback) {

    try {
        Complaint.find({}, { subject: 1, dateTime: 1, type: 1, _id: 1 }, callback);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.GetComplaintss = function (skipno, callback) {
    try {
        console.log(skipno);
        Complaint.find({ read: true, accept: true }, { ComplaintID: 1, subject: 1, dateTime: 1, userID: 1, _id: 1 }, callback).skip(skipno).limit(20);
    }
    catch (e) {
        console.log(e);
    }

}
//accept or reject
module.exports.approveComplaint = function (query, callback) {
    //User.find({},{ username: 1, firstname: 1, _id: 1, },callback);
    //User.find({},callback);
    Complaint.updateOne({ _id: `${query._id}` }, { code: `${query.code}`, accept: `${query.accept}`, read: true }, callback);
}

//
module.exports.trackComplaint = function (query, callback) {
    //User.find({},{ username: 1, firstname: 1, _id: 1, },callback);
    //User.find({},callback);   
    Complaint.updateOne({ _id: `${query.id}` }, { role: `${query.role}`, status: `${query.status}` }, callback);
}



module.exports.Totalcomplaintscount = function (callback) {
    try {
        Complaint.find({}).countDocuments(callback);
    }
    catch (e) {
        console.log(e);
    }

}





//getcomplaintsfor approve  >> grid >> admin 
module.exports.GetComplaintsforapprove = function (id, callback) {
    try {
        Complaint.find({ read: false }, { subject: 1, whathappened: 1, type: 1, level: 1 }, callback);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.GetComplaintsfortrack = function (id, callback) {
    try {
        Complaint.find({ read: true, accept: true }, { subject: 1, whathappened: 1, type: 1, level: 1 }, callback);
    }
    catch (e) {
        console.log(e);
    }
}
//getcomplaintsfor approve  >> grid >> admin 
module.exports.GetCompleteComplaintdetailsbyId = function (id, callback) {
    try {
        Complaint.find({ _id: id }, callback);
    }
    catch (e) {
        console.log(e);
    }
}


module.exports.GetAllComplaints = function (callback) {

    try {
        Complaint.find({}, { _id: 1, userID: 1 }, callback);
    }
    catch (e) {
        console.log(e);
    }
}


module.exports.postComment = function (comment, callback) {

    try {
        Comment.create(comment, callback);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.getCommentsByComplaintId = function (id, callback) {

    try {
        Comment.find({ ComplaintId: id }, callback);
    }
    catch (e) {
        console.log(e);
    }
}




module.exports.insertPractise = function (comment, callback) {

    try {
        Practice.create({ body: 'sghash', comments: ['22', 'dfdf', 'dfdfdf'] }, callback);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.getall = function (comment, callback) {

    try {
        Practice.find({}, callback);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.deleteAllComplaints = function (comment, callback) {

    try {
        Complaint.remove({}, callback);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports.deleteAllComments = function (comment, callback) {

    try {
        Comment.remove({}, callback);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.attachFileToComplaint = function (comment, callback) {
    let type = [{ fileNewName: String, mimeType: String, originalName: String }]
    try {
        // Complaint.add({}, callback);
        Complaint.update(
            { _id: "5cac67e162c74314c8d05410" },
            { $push: { filepaths: { fileNewName: 'String', mimeType: 'String', originalName: 'String' } } }, callback
        )
    }
    catch (e) {
        console.log(e);
    }
}