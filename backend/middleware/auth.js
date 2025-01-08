const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1];
                
                if (!process.env.JWT_SECRET) {
                    throw new Error('JWT_SECRET is not defined in environment variables');
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                
                if (!req.user) {
                    throw new Error('User not found');
                }

                next();
            } catch (error) {
                console.error('Token verification error:', error);
                res.status(401).json({ 
                    message: 'Not authorized, token failed',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        } else {
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            message: 'Authorization failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

const pantry = (req, res, next) => {
    if (req.user && (req.user.role === 'pantry' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as pantry staff' });
    }
};

module.exports = { protect, admin, pantry }; 