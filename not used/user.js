var mongoose = require('mongoose');



var UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    SFIID: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 9
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
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
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    mandal: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    houseNo: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    lstate: {
        type: String,
        required: true
    },
    ldistrict: {
        type: String,
        required: true
    },
    lmandal: {
        type: String,
        required: true
    },
    lvillage: {
        type: String,
        required: true
    },
    lhouseNo: {
        type: String,
        required: true
    },
    lpincode: {
        type: String,
        required: true
    },
    edit: {
        type: Boolean,
        required: true
    },
    verify: {
        type: Number,
        required: true
    },
    imagepath: {
        type: String,

    },
    Ucode: {
        type: Number,
        required: true
    },
});





var User = module.exports = mongoose.model('UsersModel', UserSchema);

//create the user >> returns created user.
module.exports.CreateUser = function (objuser, callback) {

    try {
        User.create(objuser, callback);
    } catch (e) {
        console.log(e);
    }
}


//check user with username >> returns count
module.exports.checkUser = function (query, callback) {
    console.log(query);
    User.find(query).count(callback);

}
module.exports.getUsersCount = function (callback) {

    try {
        User.find({}).countDocuments(callback);
    } catch (e) {
        console.log(e);
    }
}


//getuser for update the user
module.exports.getUser = function (query, callback) {
    User.find(query, {
        username: 1,
        firstname: 1,
        _id: 1
    }, callback).limit(1);

}
//get user 
module.exports.getsingleUser = function (query, callback) {
    User.find(query, callback).limit(1);

}
//update user   
module.exports.updateUser = function (query, callback) {
    User.updateOne({
        "_id": "5c98a213a4cc421cc03c3778"
    }, query, callback);

}



module.exports.changepasswordget = function (query, callback) {
    User.find({
        $and: [{
            _id: `${query._id}`
        }, {
            password: `${query.oldpassword}`
        }]
    }, callback);
}
module.exports.changepasswordupdate = function (query, callback) {
    User.updateOne({
        _id: `${query._id}`
    }, {
        password: `${query.newpassword}`
    }, callback);

}
module.exports.forgetpasswordget = function (query, callback) {
    User.find({
        $and: [{
            username: `${query.username}`
        }, {
            phonenumber: `${query.phonenumber}`
        }, {
            pincode: `${query.pincode}`
        }]
    }, {
        username: 1,
        firstname: 1,
        _id: 1
    }, callback);
}
module.exports.forgetpasswordupdate = function (query, callback) {
    User.updateOne({
        _id: `${query._id}`
    }, {
        password: `${query.newpassword}`
    }, callback);
}

//getallusers for grid
module.exports.getallusers = function (query, callback) {
    //User.find({},{ username: 1, firstname: 1, _id: 1, },callback);
    // User.find({verify:0},callback);
    User.find({}, callback);
}

module.exports.approveuser = function (query, callback) {
    //User.find({},{ username: 1, firstname: 1, _id: 1, },callback);
    //User.find({},callback);
    User.updateOne({
        _id: `${query._id}`
    }, {
        verify: `${query.verify}`
    }, callback);
}

module.exports.deleteAllUsers = function (employee, callback) {

    User.remove({}, callback);
}

//getuserdetailswithSFIID 
module.exports.getUserDetailsBySFIID = function (query, callback) {

    User.find({
        SFIID: query.SFIID
    }, {
        firstName: 1,
        lastName: 1,
        phoneNo: 1,
        profession: 1,
        gender: 1,
        state: 1,
        district: 1,
        mandal: 1,
        village: 1,
        houseNo: 1,
        pincode: 1,
        lstate: 1,
        ldistrict: 1,
        lmandal: 1,
        lvillage: 1,
        lhouseNo: 1,
        lpincode: 1,
        imagepath: 1,
        _id: 0,
    }, callback).limit(1);

}

//for login check
module.exports.getLoginDetailsbyUserName = function (query, callback) {

    User.find(query, {
        username: 1,
        password: 1,
        SFIID: 1,
        firstName: 1,
        lastName: 1,
        verify: 1,
        imagepath: 1,
        _id: 0,
    }, callback);

}






































































































// module.exports.deleteEmployee = function (id, employee, callback) {
//     var query = { _id: id };
//     Employee.remove(query, callback);
// }
// module.exports.deleteAllEmployees = function (employee, callback) {

//     Employee.remove({}, callback);
// }





//db.employees.find( {Firstname :'firstname0'}).pretty()
//db.employees.find({ Firstname: { $regex: /2$/ } }).pretty()



// var empSchema = new mongoose.Schema({


//     Firstname: {
//         type: String,
//         required: true
//     },
//     Lastname: {
//         type: String,
//         required: true
//     },
//     Middlename: {
//         type: String,
//         required: true
//     },
//     Fathername: {
//         type: String,
//         required: true
//     },
//     Mothername: {
//         type: String,
//         required: true
//     },
//     StreetNo: {
//         type: String,
//         required: true
//     },
//     State: {
//         type: String,
//         required: true
//     },
//     District: {
//         type: String,
//         required: true
//     },
//     Phone: {
//         type: String,
//         required: true
//     },
//     Married: {
//         type: String,
//         required: true
//     },
//     Education: {
//         type: String,
//         required: true
//     },
//     Occupation: {
//         type: String,
//         required: true
//     }

// });

// var Employee = module.exports = mongoose.model('Employee', empSchema);

// module.exports.addEmployee = function (employee, callback) {

//     try {
//         Employee.create(employee, callback);
//     } 
//     catch(e){
//         console.log(e);
//     }
// }

// module.exports.getEmployees = function (callback, limit) {
//     Employee.find(callback).limit();
// }

// module.exports.getEmployeeByFirstName = function (query, callback) {
//     //Employee.find(query, callback);
//     var d = query;

//     var pattern = '/' + 2 + '$/'
//     var d5 = '{$regex:' + pattern + '}';
//     var fname = 'name998';
//    // Employee.find({ Firstname: d5 }, callback);
//     Employee.find({ Firstname: new RegExp('.*' + query + '.*', "i") }, callback).limit();
//     //Employee.find({ Firstname: { $regex: pattern } }, callback);
//   // Employee.find({ Firstname: new RegExp('^' + 2 + '$/') }, callback);
//     //console.log(pattern);
//     //console.log('');

// }

// module.exports.getEmployeeByLastname = function (query, callback) {

//     Employee.find({ Lastname: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }

// module.exports.getEmployeeByMiddlename = function (query, callback) {

//     Employee.find({ Middlename: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByFathername = function (query, callback) {

//     Employee.find({ Fathername: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByMothername = function (query, callback) {

//     Employee.find({ Mothername: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByStreetNo = function (query, callback) {

//     Employee.find({ StreetNo: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByState = function (query, callback) {

//     Employee.find({ State: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByDistrict = function (query, callback) {

//     Employee.find({ District: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByPhone = function (query, callback) {

//     Employee.find({ Phone: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByMarried = function (query, callback) {

//     Employee.find({ Married: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByEducation = function (query, callback) {

//     Employee.find({ Education: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }
// module.exports.getEmployeeByOccupation = function (query, callback) {

//     Employee.find({ Occupation: new RegExp('.*' + query + '.*', "i") }, callback).limit();

// }

// module.exports.getEmployeeBykeys = function (query, callback) {

//   //  Employee.find({ Occupation: new RegExp('.*' + query + '.*', "i") }, callback);
//     Employee.find({
//         $or: [{ Firstname: new RegExp('.*' + query + '.*', "i") },
//             { Lastname: new RegExp('.*' + query + '.*', "i") },
//             { Middlename: new RegExp('.*' + query + '.*', "i") },
//             { Fathername: new RegExp('.*' + query + '.*', "i") },
//             { Mothername: new RegExp('.*' + query + '.*', "i") },
//             { StreetNo: new RegExp('.*' + query + '.*', "i") },
//             { State: new RegExp('.*' + query + '.*', "i") },
//             { District: new RegExp('.*' + query + '.*', "i") },
//             { Phone: new RegExp('.*' + query + '.*', "i") },
//             { Married: new RegExp('.*' + query + '.*', "i") },
//             { Education: new RegExp('.*' + query + '.*', "i") },
//             { Occupation: new RegExp('.*' + query + '.*', "i") }
//         ]
//     }, callback).limit();
// }

// User.find( { $and: [ { username:`${query.username}` }, { password: `${query.oldpassword}`}] }, function(data, err ){
//     //    User.find({"username":`${query.username}`, "password":`${query.oldpassword}`}, function(data, err ){
//         if(err){
//         console.log(err);
//     }

//     }).exec(function(err, users) {
//         if (err) throw err;

//         // show the admins in the past month
//         console.log('------------');
//         console.log(users);
//       });

//    User.updateOne({"_id":"5c98a213a4cc421cc03c3778"}, query, callback);




// User.find( { $and: [ { username:  'SHASHI2CHITTI'  }, { password: 'PASSWORD123.' }  ] }, function(data, err ){
// //    User.find({"username":`${query.username}`, "password":`${query.oldpassword}`}, function(data, err ){
//     if(err){
//     console.log(err);
// }

// }).exec(function(err, users) {
//     if (err) throw err;

//     // show the admins in the past month
//     console.log('------------');
//     console.log(users);
//   });

// //    User.updateOne({"_id":"5c98a213a4cc421cc03c3778"}, query, callback);