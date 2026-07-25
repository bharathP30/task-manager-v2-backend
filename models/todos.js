import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    // oId is a temporary client-side ID used for optimistic UI updates; it is not stored in the database
    taskContent: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: "others",
    },

    priority: {
        type: String,
        default: "low",
    },

    dueDate: Date,

    completed: {
        type: Boolean,
        deafault: false,
    },

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