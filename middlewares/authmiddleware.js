const jwt = require('jsonwebtoken');
const User = require('../models/usermodels'); // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
    // Get token from headers
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded token's id
        const user = await User.findById(decoded.id);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token, authorization denied' });
        }

        // Attach user object to request
        req.user = user;
        next(); // Proceed to next middleware
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid token, authorization denied' });
    }
};

module.exports = authMiddleware;
