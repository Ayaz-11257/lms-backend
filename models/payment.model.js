import { model, Schema } from 'mongoose';

const paymentSchema = new Schema({
    razorpay_payment_id: { //baar baar razorpay mat likhna kyuki abhi humlog sirf razorpay use kar rahe hai isliye likha hai 
        type: String,
        required: true
    },
    razorpay_subscription_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
}, {
    timestamp: true
});

const Payment = model('Payment', paymentSchema);

export default Payment;