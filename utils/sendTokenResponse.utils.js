const jwt = require('jsonwebtoken');

/**
 * @desc  Generate a JWT token using the user object and responds to the client
 * @param {object} data - User object
 * @param {object} res - Response object
 * @param {number} statusCode - HTTP Status code
 * @param {string} msg - Message to be sent
 */
const sendTokenResponse = (user, res, statusCode, msg = null) => {
    const payload = user.dataValues ? user.dataValues : user;
    // Create token
    const token = jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    // const options = {
    //     expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    //     httpOnly: true
    // };

    // if (process.env.NODE_ENV === 'production') {
    //     options.secure = true
    // }

    res.status(statusCode).cookie('nec-cookie', token).json({
        success: true,
        data: { 
            token, 
            user,
            msg
        }
    });
};

module.exports = sendTokenResponse;