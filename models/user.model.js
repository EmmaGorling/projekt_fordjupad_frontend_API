"use strict"

const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema
const UserSchema = Mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    }
);

// Compare hashed passwords
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}

// Create module
const User = Mongoose.model("user", UserSchema);
// Export
module.exports = User;