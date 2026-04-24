import mongoose from "mongoose";
import bcrypt from "bcrypt";  // ✅ Correct: "bcrypt"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePass = async function (candidatePass) {
    return await bcrypt.compare(candidatePass, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;