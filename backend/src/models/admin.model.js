import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Pre-save hook to hash password before saving
adminSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        console.log("Hashing password:", this.password); // Debug: Log password before hashing
        this.password = await bcrypt.hash(this.password, 10);
        console.log("Hashed password:", this.password); // Debug: Log password after hashing

        next();
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

// Method to compare hashed password
adminSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error("Password comparison failed");
    }
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// custom method creation
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Admin = mongoose.model("Admin", adminSchema);
