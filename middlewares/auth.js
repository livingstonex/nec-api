const jwt = require('jsonwebtoken');
const { User } = require('../models/sql').models;

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
        req.user = await User.findByPk(decoded.id);
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

// exports.authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 success: false,
//                 errors: {
//                     msg: 'User not authorized to access resource'
//                 }
//             });
//         }
//         next();
//     };
// };