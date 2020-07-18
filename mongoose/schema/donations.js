const mongoose = require('mongoose');
const DonationSchema = new mongoose.Schema({
    DonatedBy: {
        type: {
            _id: String,
            firstName: String,
            phoneNumber: String,
            email: String
        },
        required: true
    },
    DateTime: {
        type: Date,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    PaymentStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    PaymentInit: {
        type: {
            id: String,
            entity: String,
            amount: Number,
            amount_paid: Number,
            amount_due: Number,
            currency: String,
            receipt: String,
            offer_id: String,
            status: String,
            attempts: Number,
            notes: Array,
            created_at: Number
        }
    },
    PaymentSuccess: {
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String
    },
});

module.exports = mongoose.model('COVID_donations', DonationSchema);