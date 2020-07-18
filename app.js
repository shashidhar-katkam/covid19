var express = require('express');
const socketIo = require("socket.io");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require("path");
const routes = require('./routes/routes');
const fs = require('fs');
var port = process.env.PORT || 7777;
mongoose.Promise = global.Promise;
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

//  >>>> mongoose connection string
var dda = 'mongodb://localhost:27017/journalism';
var mlab = 'mongodb://marriage:marriage123@ds139896.mlab.com:39896/Covid19';
 mongoose.connect(dda);

//  >>>> on connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose database connected..');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('error');
    console.log(err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// mongoose.connect("mongodb://mongodbtes.mongo.cosmos.azure.com:10255/testdb?ssl=true&replicaSet=globaldb", {
//     auth: {
//         user: 'mongodbtes',
//         password: 'D1bTuGOKN1OPirD3s5t7HRTpfaFTTyNTJkl7DVdsqghqGKFcm1hLPRivJy5yJCBXyMtlya0JZwN6ZCwTazMJKQ=='
//     }
// })
//     .then(() => console.log('Connection to CosmosDB successful'))
//     .catch((err) => console.error(err));

app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/use', routes);

app.get('/', (req, res) => {
    console.log(req);
    res.send("dfgfd World");

    res.sendFile(path.join(__dirname + './index.html'));
});

app.get('/api/downloadfile', function (req, res) {
    const file = `${__dirname}/uploads/files/file-1594915137780file-.jpg`;
    res.download(file); 
});
// app.get('*', function (req, res) {
//     res.redirect('/login');
// });
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

var server = app.listen(port, function () {
    console.log("server started at  " + port);
    console.log("Please Navigate to http://localhost:" + port.toString());
});

var io = socketIo(server);
module.exports.getSocket = () => {
    return io.on("connection", (socket) => {
        return socket;
    });
}
// var socketE = module.exports.socketE;
// const getApiAndEmit = socket => {

//     const response = new Date();
//     // Emitting a new message. Will be consumed by the client
//     socket.emit("FromAPI", response);

// };


// io.on("connection", (socket) => {
//     //socketE = socket;
//     /// console.log("New client connected");
//     // if (interval) {
//     //  //   clearInterval(interval);
//     // }
//     //  var interval = setInterval(() => getApiAndEmit(socket), 1000);
//     //socket.on("disconnect", () => {
//     //     console.log("Client disconnected t");
//     //    clearInterval(interval);
//     //});
// });
//console.log('df');
//console.log(socketE);


// https.createServer({
//     // key: fs.readFileSync('./key.pem'),
//     // cert: fs.readFileSync('./cert.pem'),
//     // passphrase: 'shashi2puppy'
// }, app).listen(7777, () => {
//     console.log("server started at  " + port);
//     console.log("Please Navigate to http://localhost:" + port.toString());
// });