const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require("express");
const app=express();

app.use(cookieParser());

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Missing token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
    }
};

module.exports = authenticateUser;
