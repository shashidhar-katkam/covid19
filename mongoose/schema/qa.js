const mongoose = require('mongoose');

const QASchema = new mongoose.Schema({
    RefId: {
        type: String,
        required: true
    },
    QAskedBy: {
        type: {
            _id: String,
            firstName: String,
            lastName: String,
            imagePath: String
        }
    },
    Question: {
        type: String,
        required: true
    },
    Answers: {
        type: [
            {
                Answer: String,
                AnsweredBy: {
                    type: {
                        _id: String,
                        firstName: String,
                        lastName: String,
                        imagePath: String
                    }
                }
            }]
    },
    DateTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('lQASchema ', QASchema);