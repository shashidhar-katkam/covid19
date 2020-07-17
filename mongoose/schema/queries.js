const mongoose = require('mongoose');
const OrdersSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    anyRef: {
        type: {
            refType: String,
            refId: String
        }
    }
});

module.exports = mongoose.model('queries ', OrdersSchema);