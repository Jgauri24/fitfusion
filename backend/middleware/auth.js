const jwt = require('jsonwebtoken');

/**
 * Middleware to verify a JWT token and attach the decoded payload (user info) to the request object.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied: No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains payload like { id, role }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access Denied: Token expired.' });
        }
        return res.status(401).json({ message: 'Access Denied: Invalid token.' });
    }
};

/**
 * Middleware factory to enforce Role-Based Access Control (RBAC).
 * Requires verifyToken to be executed prior.
 * 
 * @param {string} role - The required role (e.g., 'ADMIN', 'STUDENT')
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({ message: 'Server Error: Role verification attempted before token verification.' });
        }

        // Role verification (Admin can often override, but strictly enforcing requested role here)
        if (req.user.role !== role && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: `Forbidden: Requires ${role} privileges.` });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};
