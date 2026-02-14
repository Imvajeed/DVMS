import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 5
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false // IMPORTANT: never return password by default
        },

        role: {
            type: String,
            enum: ["user", "editor", "admin"],
            default: "user"
        },

        permissions: {
            type: [String],
            default: []
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastLoginAt: {
            type: Date
        },
        refreshToken: {
            type: String,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpires: {
            type: Date
        }


    },
    {
        timestamps: true
    }
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
}


const User = mongoose.model("User", userSchema);
export default User;


