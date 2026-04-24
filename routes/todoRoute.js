import Todo from "../models/todos.js";
import express from "express";

const router = express.Router();

router.get("/filter", async (req, res) => {
    const { category, priority, completed, search } = req.query;
    const filter = { userId: req.userId };

    if (category) filter.category = category;
    if (priority) filter.priority= priority;
    if (completed) filter.completed = completed === "true"; // convert string to boolean
    if (search) filter.taskContent = { $regex: search, $options: "i" }; // case-insensitive search

    try {
        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        console.log("todos received is, ", todos);

        // if (!todos || todos.length === 0) {
        //     return res.status(404).json({ error: "No todos found" });
        // }
        // INFO: I am not treating empty results as an error because it's a valid case when no todos match the filter criteria.
        // INFO: the UI will simply show "no results"

        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ error: "failed to fetch todos" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ userId: req.userId, _id: req.params.id });

        if (!todo) {
            return res.status(404).json({ error: "No todo found" });
        }

        // send the found todo back to the client
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json({ error: "failed to fetch todo" });
    }
});

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });


        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ error: "failed to fetch todos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newTodo = await Todo.create({
            ...req.body,
            userId: req.userId,
        });

        if (!newTodo) {
            return res.status(400).json({ error: "error creating a todo" });
        }

        return res.status(201).json(newTodo);
    } catch (error) {
        return res.status(500).json({ error: "failed to create todo" });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const updated = await Todo.findOneAndUpdate(
            { userId: req.userId, _id: req.params.id },
            { $set: req.body },
            { returnDocument: 'after' }
        );

        if (!updated) {
            return res.status(404).json({ error: "No todo found" });
        }

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ error: "failed to update todo" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        console.log(req.userId, req.params.id)
        const deleted = await Todo.findOneAndDelete({ userId: req.userId, _id: req.params.id });
         console.log("selected to delete is,", deleted);

        if (!deleted) {
            return res.status(404).json({ error: "No todo found" });
        }

        return res.status(200).json({ message: "Todo deleted" });
    } catch (error) {
        return res.status(500).json({ error: "failed to delete todo" });
    }
});

export default router;