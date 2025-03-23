const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response.utils');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json(errorResponse('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Invalid or expired token'));
    }
};

const adminRequired = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json(errorResponse('Admin access required'));
    }
    next();
};

module.exports = { authMiddleware, adminRequired };
