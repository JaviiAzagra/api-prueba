const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        username: { type: String, unique: true, trim: true, required: true },
        phone: { type: String, required: true },
        gender: {
            type: String,
            enum: ["male", "female", "non-binary", "other"],
            required: true
        },
        rol: {
            type: String,
            default: "users",
            enum: ["users", "admin"]
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
