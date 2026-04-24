import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Authenticate } from "./middleware/auth.js";
// hardcoded configuration; not using dotenv
// import dotenv from "dotenv";

// dotenv.config();

import authRoute from "./routes/authRoute.js";
import todoRoute from "./routes/todoRoute.js";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json());

// hardcoded DB URL as before
const DB_URL = "mongodb://localhost:27017/todos";   

async function main() {

    try {
        await mongoose.connect(DB_URL);
        console.log("database name is", mongoose.connection.name);
        console.log("database host is", mongoose.connection.host);
        console.log("database port is", mongoose.connection.port);
        console.log("database state is", mongoose.connection.readyState);

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log("EXPRESS SERVER RUNNING AT", PORT);
        })

    } catch (error) {
        console.error(error)
    }

}
main();

app.get("/", (req, res) => {
    res.json({
        message: "CONNECTED",
    })
})

app.use("/api/auth", authRoute);
app.use("/api/todos", Authenticate, todoRoute);

