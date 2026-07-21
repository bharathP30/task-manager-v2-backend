import dotenv from 'dotenv'
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import { Authenticate } from "./middleware/auth.js";
import authRoute from "./routes/authRoute.js";
import todoRoute from "./routes/todoRoute.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://task-manager-v2-frontend-seven.vercel.app"],
})); // make sure the origin matches the frontend URL of both local offline and online deployed production versions
app.use(express.json());

// hardcoded DB URL as before
//const DB_URL = "mongodb://localhost:27017/todos";   

app.use("/api/auth", authRoute);
app.use("/api/todos", Authenticate, todoRoute);


app.get("/", (req, res) => {
    res.json({
        message: "CONNECTED",
    })
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

const main = async function () {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/task_Manager");
        console.log("database name is", mongoose.connection.name);
        console.log("database host is", mongoose.connection.host);
        console.log("database port is", mongoose.connection.port);
        console.log("database state is", mongoose.connection.readyState);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log("EXPRESS SERVER RUNNING AT", PORT);
        })

    } catch (error) {
        console.error(error)
    }
}
main();