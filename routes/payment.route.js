import { Router } from 'express';
import { getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments } from '../controller/payment.controller.js';
import { isLoggedIn, authorizedRoles } from '../middleware/auth.middleware.js';

const router = Router();

router
.route('/razorpayApiKey')
.get(
    isLoggedIn,
    getRazorpayApiKey
);

router
.route('/subscribe')
.post(
    isLoggedIn,
    buySubscription
);

router
.route('/verify')
.post(
    isLoggedIn,
    verifySubscription
);

router
.route('/unsubscribe')
.post(
    isLoggedIn,
    cancelSubscription
);

router
.route('/')
.get(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    allPayments
);

export default router;