import dotenv from 'dotenv'
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Authenticate } from "./middleware/auth.js";
// import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/authRoute.js";
import todoRoute from "./routes/todoRoute.js";

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://task-manager-v2-frontend-seven.vercel.app"],
})); // make sure the origin matches the frontend URL of both local offline and online deployed versions
app.use(express.json());

// hardcoded DB URL as before
//const DB_URL = "mongodb://localhost:27017/todos";   

async function main() {

    try {
        await mongoose.connect(process.env.MONGODB_URL);
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

app.get("/", (req, res) => {
    res.json({
        message: "CONNECTED",
    })
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

app.use("/api/auth", authRoute);
app.use("/api/todos", Authenticate, todoRoute);

