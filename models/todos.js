import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    
    taskContent: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
        validate: {
            validator: function(value) {
                if(value === null || value === undefined) return false;
                const trimmedValue = value.trim();
                if(trimmedValue.length < 3 || trimmedValue.length > 100) return false;
                return true;
            },
            message: "Task content cannot be empty"
        },
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
            if (!value) return true;
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            return value >= startOfToday;
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