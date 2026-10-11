const jwt =  require('jsonwebtoken');
const userModel = require('../models/user.model');

const authHandler = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access denied, no token" });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // now every route knows who is logged in
        next();

    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });

    }
};

const requireOwnership = (model) => async (req, res, next) => {
    const resource = await model.findById(req.params.id);
    if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
    }
    if (resource.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    req.item = resource;
    next();
};

module.exports = { authHandler, requireOwnership };
