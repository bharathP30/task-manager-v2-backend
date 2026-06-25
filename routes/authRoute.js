import User from "../models/user.js";
import express from "express";

import { generateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        console.log("signup api is running")
        console.log(req.body);
        
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
            console.log("generated token received", token);
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
        console.log("login api is running")
        const { email, password, rememberMe } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (!existingUser) return res.status(404).json({ error: "user does not exist, signup instead" });

        console.log("entered pass is, ", password);

        const isPassTrue = await existingUser.comparePass(password);

        console.log(isPassTrue);

        if (!isPassTrue) {
            return res.status(401).json({ error: "password does not match" });
        }
        const payLoad = { userId: existingUser._id, email: existingUser.email };
        const token = generateToken(payLoad._id, existingUser.email, rememberMe);

        console.log("generated token received");

        return res.json({   message: "Login successful", 
                            user: { _id: existingUser._id, name: existingUser.name, email: existingUser.email },
                            token  });

    } catch (error) {
        console.error("LOGIN ERROR:", error); 
        res.status(500).json({ error: "failed to login" });
    }
});

export default router;