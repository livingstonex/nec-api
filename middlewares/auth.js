const jwt = require('jsonwebtoken');
const { Administrator, Plan, Privilege, Subscription, User } = require('../models/sql').models;

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
        decoded.role ? req.user = await Administrator.findByPk(decoded.id) : req.user = JSON.parse(JSON.stringify(await User.findOne({
            where: { id: decoded.id },
            // raw: true,
            // nest: true,
            include: [
              {
                model: Subscription,
                as: 'subscription',
                include: [
                  {
                    model: Plan,
                    as: 'plan',
                    include: [
                      {
                        model: Privilege,
                        as: 'privileges',
                        attributes: {
                          exclude: ['created_at', 'updated_at', 'plan_id'],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          })));
          req.user.password = undefined;
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
        if (!req.user.subscription) {
            return res.paymentRequired({ message: 'No active subscription for user' });
        }
        
        const user_privileges = req.user.subscription.plan.privileges.map(privilege => privilege.id).join().replaceAll(',', '');
        privileges = privileges.join().replaceAll(',', '');

        if (!privileges.includes(user_privileges)) {
            return res.paymentRequired({ message: 'No active subscription for user' });
        }
        next();
    };
};