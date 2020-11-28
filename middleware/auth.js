const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: "You are not authorized!" });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        // console.log(decoded);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Not authorized!" });
    }
};
