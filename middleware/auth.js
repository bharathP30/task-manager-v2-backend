import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const Authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or invalid Authorization header" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "There is no token in the header. Invalid Token" });
        }

        const payload = jwt.verify(token, JWT_SECRET_KEY);

        req.userId = payload.userId;
        req.email = payload.email;
        next();
        
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log("Auth middleware: Token has expired");
            return res.status(401).json({ error: "Error: Expired Token" });
        }
        return res.status(401).json({ message: "Invalid Token" });
    }
}

export const generateToken = ( payLoad, rememberMe ) => {
    const payload = {
        sub: payLoad.userId,
        email: payLoad.email
    };

    const date = rememberMe? "30d" : "7d";
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: date });
    return token;
}