"use strict"

// Imports
const Cookie = require("@hapi/cookie");
const Jwt = require("@hapi/jwt");
require("dotenv").config();

module.exports = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        // Register cookie strat
        server.auth.strategy("session", "cookie", {
            cookie: {
                name: "jwt",
                password: process.env.COOKIE_KEY,
                isSecure: true,
                path: "/",
                ttl: 24 * 60 * 60 * 1000,
                isSameSite: "None",
                clearInvalid: true,
                isHttpOnly: true
            },
            // Validate Http-cookie
            validate: async (request, session) => {
                try {
                    const token = session; // Get token

                    if(!token){
                        return { isValid: false };
                    }

                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_KEY,
                            algorithms: ['HS256']
                        });

                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };
                    } catch (error) {
                        console.error("Token verification error: ", error);
                        return {isValid: false};
                    }
                } catch (error) {
                    console.error("Validation error: ", error);
                    return { isValid: false };
                }
            }
        });

        server.auth.default("session");
    }
}