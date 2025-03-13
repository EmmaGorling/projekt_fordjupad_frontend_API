"use strict"

// Import packages
const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
const auth = require('./auth');
require("dotenv").config();

// Create server
const init = async () => {
    // Initialize server
    const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: "localhost",
        routes: {
            cors: {
                origin: ["https://www.thunderclient.com", "http.//localhost:5500", "http://127.0.0.1:5500", "http://localhost:5173"],
                credentials: true,
                maxAge: 86400,  // 24 hours
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin", "Authorization"]
            }
        }
    });

    // Connet to MongoDB
    Mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.error("Error when connecting to database: " + error);
    });

    // Register JWT auth strategy
    await auth.register(server);

    // Routes
    require('./routes/user.route')(server);
    require('./routes/review.route')(server);

    // Start server
    await server.start();
    console.log("Server running on %s", server.info.uri);
}

// If unhandeled errors
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1)
});

// Start server
init();