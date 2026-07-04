import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if(!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token, authorization denied" });
    }
}

export default verifyToken;
