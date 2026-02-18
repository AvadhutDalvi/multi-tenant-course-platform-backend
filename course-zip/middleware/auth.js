const jwt = require("jsonwebtoken");
const { user_jwt_pass } = require("../routes/user");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, user_jwt_pass);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

function roleMiddleware(requiredRole) {
    return function (req, res, next) {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
}

module.exports = {
    authMiddleware,
    roleMiddleware
};
