var express = require('express');
const socketIo = require("socket.io");
var app = express();
//const https = require('https');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require("path");
const routes = require('./routes/routes');
const fs = require('fs');
var port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

//  >>>> mongoose connection string
var mlab = 'mongodb://marriage:marriage123@ds139896.mlab.com:39896/marriage';
 mongoose.connect(mlab);

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
