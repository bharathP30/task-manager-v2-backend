import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    // oId is a temporary client-side ID used for optimistic UI updates; it is not stored in the database
    taskContent: {
        type: String,
        required: true
    },

    category: String,
    priority: String,
    dueDate: Date,
    completed: Boolean,

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;