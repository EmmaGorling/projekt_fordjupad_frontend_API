"use strict"

// Imports
const User = require("../models/user.model");
const Jwt = require("@hapi/jwt");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Get all users
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find({}).select("-password");
        return users;
    } catch (error) {
        return h.response({message: error.message }).code(500);
    }
}

// Get one user by id 
exports.getUser = async (request, h) => {
    try {
        const { id } = request.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ message: "Användaren hittades inte"}).code(400);
        }
        const result = await User.findOne({ _id: request.params.id}).select("-password");
        return result;
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Add User
exports.createUser = async (request, h) => {
    try {
        const { email, password, firstName, lastName } = request.payload;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email, 
            password: hashedPassword,
            firstName,
            lastName
        });


        const savedUser = await user.save();
        return h.response(savedUser).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Update user
exports.updateUser = async (request, h) => {
    try {
        // Get token from cookies
        const token = request.state.jwt;
        if(!token) {
            return h.response({ message: "No token aviable"}).code(401);
        }

        // Verify token
        const decoded = Jwt.token.decode(token);
        const loggedInUserId = decoded.decoded.payload.user._id;

        const userId = request.params.id;

        if (userId !== loggedInUserId) {
            return h.response({ message: "Not authorized" }).code(403);
        }

        // Skapa en kopia av payload
        let updateData = { ...request.payload };

        // Om lösenord ändras, kryptera det innan uppdatering
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate( request.params.id, updateData, {new: true});
        return h.response(updatedUser).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Delete user
exports.deleteUser = async (request, h) => {
    try {
        // Get token from cookies
        const token = request.state.jwt;
        if(!token) {
            return h.response({ message: "No token aviable"}).code(401);
        }

        // Verify token
        const decoded = Jwt.token.decode(token);
        const loggedInUserId = decoded.decoded.payload.user._id;

        const userId = request.params.id;

        if (userId !== loggedInUserId) {
            return h.response({ message: "Not authorized" }).code(403);
        }

        await User.findByIdAndDelete(request.params.id);
        return h.response().code(204);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Login
exports.loginUser = async (request, h) => {
    try {
        const { email, password } = request.payload;

        let user = await User.findOne({ email: email });

        // Check user
        if(!user) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // Check password
        const correctPassword = await bcrypt.compare( password, user.password );
        if(!correctPassword) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // Get user, no password
        user = await User.findOne({ email: email }, { password: 0 });

        // Generate token
        const token = generateToken(user);

        return h.response({ message: 'You are logged in'}).state('jwt', token);

    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Logout
exports.logout = async (request, h) => {
    try {
        // Destroy cookie
        h.unstate('jwt');
        
        return h.response().code(204);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Validate user
exports.validateToken = async (request, h) => {
    try {
        const token = request.state.jwt;
        console.log("Token från cookie:", token); // 🔹 Debug-logg

        if (!token) {
            return h.response({ message: "No token provided" }).code(401).takeover();
        }

        let decoded;
        try {
            decoded = Jwt.token.verify(token, process.env.JWT_KEY, { algorithms: ["HS256"] });
            console.log("Decoded token:", decoded); // 🔹 Debug-logg
        } catch (error) {
            console.error("Token verification error:", error); // 🔹 Debug-logg
            h.unstate("jwt");
            return h.response({ message: "Invalid or expired token" }).code(401).takeover();
        }

        return h.response({ message: "Token is valid", user: decoded.decoded.payload.user }).code(200);
    } catch (error) {
        console.error("Unexpected error:", error); // 🔹 Debug-logg
        return h.response({ message: "Invalid token" }).code(401).takeover();
    }
}

// Generate token
const generateToken = (user) => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_KEY, algorithm: 'HS256' },
        {ttlSec: 24 * 60 * 60}
    );

    return token;
}