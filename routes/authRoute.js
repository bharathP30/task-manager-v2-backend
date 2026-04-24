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
            return res.status(401).json({ error: "user already exists, login instead" });
        }

        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        })
        console.log("user created");


        if (newUser) {
            const token = generateToken(newUser._id, newUser.email, rememberMe);
            console.log("generated token received", token);
            return res.json({ message: "User created successfully", user: newUser, token: token });
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
            return res.status(404).json({ error: "password does not match" });
        }

        const token = generateToken(existingUser._id, existingUser.email, rememberMe);

        console.log("generated token received");

        return res.json({ message: "Login successfull", user: existingUser, token });

    } catch (error) {
        res.status(500).json({ error: "failed to signup" })
    }
});

export default router;