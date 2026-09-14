import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @USER_STATS_RECORD
 * @ROUTE @GET {{URL}}/api/v1/admin/stats/users
 * @ACCESS Private (Admin Only)
 */
export const userStats = async (req, res, next) => {
    try {
        // Total registered users
        const allUsersCount = await User.countDocuments();

        // Total subscribed/active users
        const subscribedCount = await User.countDocuments({
            'subscription.status': 'active'
        });

        res.status(200).json({
            success: true,
            message: 'All user count details retrieved successfully',
            allUsersCount,
            subscribedCount
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

/**
 * @CONTACT_US
 * @ROUTE @POST {{URL}}/api/v1/contact
 * @ACCESS Public
 */
export const contactUs = async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError('All fields are required', 400));
    }

    try {
        const subject = 'Contact Us Form Query';
        const textMessage = `${name} - ${email} <br /> ${message}`;

        await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);

        res.status(200).json({
            success: true,
            message: 'Your query has been submitted successfully'
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
