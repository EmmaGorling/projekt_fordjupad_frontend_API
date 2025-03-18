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
        return h.response({message: "Något gick fel, vänligen försök igen" }).code(500);
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
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return h.response({ message: "E-postadressen är redan registrerad" }).code(400);
        }


        const savedUser = await user.save();
        return h.response({ message: "Kontot har lagts till!", user: savedUser}).code(200);
    } catch (error) {
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
    }
}

// Update user
exports.updateUser = async (request, h) => {
    try {
        // Get token from cookies
        const token = request.state.jwt;
        if(!token) {
            return h.response({ message: "Ingen token tillgänglig"}).code(401);
        }

        // Verify token
        const decoded = Jwt.token.decode(token);
        const loggedInUserId = decoded.decoded.payload.user._id;

        const userId = request.params.id;

        if (userId !== loggedInUserId) {
            return h.response({ message: "Åtkomst nekad" }).code(403);
        }

        // Skapa en kopia av payload
        let updateData = { ...request.payload };

        // Om lösenord ändras, kryptera det innan uppdatering
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate( request.params.id, updateData, {new: true});
        return h.response({ message: "Användaren har uppdaterats!", user: updatedUser }).code(200);
    } catch (error) {
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
    }
}

// Delete user
exports.deleteUser = async (request, h) => {
    try {
        // Get token from cookies
        const token = request.state.jwt;
        if(!token) {
            return h.response({ message: "Ingen token tillgänglig"}).code(401);
        }

        // Verify token
        const decoded = Jwt.token.decode(token);
        const loggedInUserId = decoded.decoded.payload.user._id;

        const userId = request.params.id;

        if (userId !== loggedInUserId) {
            return h.response({ message: "Åtkomst nekad" }).code(403);
        }

        await User.findByIdAndDelete(request.params.id);
        return h.response({ message: "Användaren har raderats"}).code(204);
    } catch (error) {
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
    }
}

// Login
exports.loginUser = async (request, h) => {
    try {
        const { email, password } = request.payload;

        let user = await User.findOne({ email: email });

        // Check user
        if(!user) {
            return h.response({ message: "E-post eller eller lösenord är felaktigt" }).code(401);
        }

        // Check password
        const correctPassword = await bcrypt.compare( password, user.password );
        if(!correctPassword) {
            return h.response({ message: "E-post eller eller lösenord är felaktigt" }).code(401);
        }

        // Get user, no password
        user = await User.findOne({ email: email }, { password: 0 });

        // Generate token
        const token = generateToken(user);

        return h.response({ message: 'Du är inloggad', user: user}).state('jwt', token);

    } catch (error) {
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
    }
}

// Logout
exports.logout = async (request, h) => {
    try {
        // Destroy cookie
        h.unstate('jwt');
        
        return h.response().code(204);
    } catch (error) {
        return h.response({ message: "Något gick fel, vänligen försök igen" }).code(500);
    }
}

// Validate user
exports.validateToken = async (request, h) => {
    try {
        const token = request.state.jwt;
        
        if (!token) {
            return h.response({ message: "Ingen token tillgänglig" }).code(401);
        }

        try {
            // First decode to see what's in the token
            const decoded = Jwt.token.decode(token);
            
            // Verify token the same way it's done in your auth.js
            Jwt.token.verify(decoded, {
                key: process.env.JWT_KEY,
                algorithms: ['HS256']
            });
            
            // If verification passes, extract the user
            const user = decoded.decoded.payload.user;
            
            return h.response({ 
                message: "Token är godkänd", 
                user: user 
            }).code(200);
            
        } catch (error) {
            console.error("Fel vid verifiering:", error);
            h.unstate("jwt");
            return h.response({ message: "Ogiltigt eller gammalt token", error: error.message }).code(401);
        }
    } catch (error) {
        console.error("Oväntat fel:", error);
        return h.response({ message: "Ogiltigt token", error: error.message }).code(401);
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