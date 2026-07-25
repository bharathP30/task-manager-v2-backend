import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    
    taskContent: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },

    category: {
        type: String,
        default: "others",
        enum: ["work", "school", "personal", "shopping", "others"],
    },

    priority: {
        type: String,
        default: "low",
        enum: ["high", "medium", "low"],
    },

    dueDate: {
        type: Date,
        default: null,
        validate: {
            validator: function(value) {
                return !value || value >= new Date();
            },
            message: "Due date cannot be in the past"
        }
    },

    completed: {
        type: Boolean,
        default: false,
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