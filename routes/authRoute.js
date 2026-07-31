import User from "../models/user.js";
import express from "express";

import { generateToken } from "../middleware/auth.js";
import { getErrorResponse } from "../utils/errorResponse.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, rememberMe } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedName = String(name).trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ error: "user already exists, login instead" });
        }

        const newUser = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: password
        })
        console.log("user created");


        if (newUser) {
            const payLoad = { userId: newUser._id, email: newUser.email };
            const token = generateToken( payLoad, rememberMe );
            
            return res.json({   message: "User created successfully", 
                                user: { _id: newUser._id, name: newUser.name, email: newUser.email }, 
                                token });
        }

    } catch (error) {
        const { status, message } = getErrorResponse(error, "failed to signup");
        return res.status(status).json({ error: message });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!existingUser) return res.status(401).json({ error: "Invalid email or password" });

        const isPassTrue = await existingUser.comparePass(password);

        if (!isPassTrue) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const payLoad = { userId: existingUser._id, email: existingUser.email };
        const token = generateToken( payLoad, rememberMe );

        return res.json({   message: "Login successful", 
                            user: { _id: existingUser._id, name: existingUser.name, email: existingUser.email },
                            token  });

    } catch (error) { 
        const { status, message } = getErrorResponse(error, "failed to login");
        return res.status(status).json({ error: message });
    }
});

export default router;