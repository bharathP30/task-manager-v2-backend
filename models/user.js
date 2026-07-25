import mongoose from "mongoose";
import bcrypt from "bcrypt";  // ✅ Correct: "bcrypt"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: "Name can only contain letters and spaces"
        }
    },

    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },

    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false, // Exclude password from query results by default
    },

    refreshToken: {
        type: [String],
        select: false, // Exclude refreshToken from query results by default
    }

}, {
    timestamps: true
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePass = async function (candidatePass) {
    return await bcrypt.compare(candidatePass, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;