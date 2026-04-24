import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const Authenticate = async (req, res, next) => {
    try {
        const authHeaderToken = req.headers.authorization;

        if (!authHeaderToken) {
            console.log("Auth middleware: No authorization header provided");
            return res.status(404).json({ error: "Token not provided" });
        }

        const token = authHeaderToken.split(" ")[1];

        if (!token) {
            console.log("Auth middleware: Token split failed - no token after 'Bearer' in header");
            return res.status(401).json({ error: "There is no token in the header. Invalid Token" });
        }

        const decodedData = jwt.verify(token, JWT_SECRET_KEY);

        req.userId = decodedData.userId;
        req.email = decodedData.email;
        next();
        
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log("Auth middleware: Token has expired");
            return res.status(401).json({ error: "Error: Expired Token" });
        }
        console.log("Auth middleware: Other JWT verification error -", error.message);
        return res.status(500).json({ message: "Invalid Token" });
    }
}

export const generateToken = (userId, email, rememberMe) => {
    console.log("running generatedToken");

    const payload = {
        userId, email
    };

    const date = rememberMe? "30d" : "7d";
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: date });
    return token;
}