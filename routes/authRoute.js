import User from "../models/user.js";
import express from "express";

import { generateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, rememberMe } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json({ error: "user already exists, login instead" });
        }

        const newUser = await User.create({
            name: name,
            email: email,
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
        res.status(500).json({ error: "failed to signup" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const existingUser = await User.findOne({ email: email });

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
        res.status(500).json({ error: "failed to login" });
    }
});

export default router;