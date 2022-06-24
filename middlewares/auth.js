const jwt = require('jsonwebtoken');
const { Administrator, Privileges, User } = require('../models/sql').models;

/**
 * @desc  Middleware to protect routes
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {next} statusCode - Next middleware function
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Set token from cookie
    // else if (req.cookies.apCookie) {
    //     token = req.cookies.apCookie;
    // }

    if (!token) {
        return res.status(401).json({
            success: false,
            errors: {
                msg: 'Not authorized to access this resource'
            }
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        decoded.role ? req.user = await Administrator.findByPk(decoded.id) : req.user = await User.findByPk(decoded.id);
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            errors: {
                msg: 'Not authorized to access this resource'
            }
        });
    }
};

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({
                success: false,
                errors: {
                    msg: 'User not authorized to access resource'
                }
            });
        }
        next();
    };
};

exports.authorizePrivilege = (privileges) => {
    return async (req, res, next) => {
        if (!req.user.subscription || !req.user.subscription.active) {
            return res.paymentRequired({ message: 'No active subscription for user' });
        }

        for (let privilege in privileges) {
            let isPrivileged = false;
            for  (let user_privilege in req.user.subscription.privileges) {
                if (privilege === user_privilege.id) {
                    isPrivileged = true;
                    break;
                }
            }
            if (!isPrivileged) {
                return res.paymentRequired({ message: 'No active subscription for user' });
            }
        }
        next();
    };
};