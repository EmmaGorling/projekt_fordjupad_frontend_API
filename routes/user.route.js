"use srtrict"

// Imports
const userController = require("../controllers/user.controller");
const Joi = require("joi");

module.exports = (server) => {

    // Get all
    server.route({
        method: 'GET',
        path: '/users',
        handler: userController.getAllUsers
    });

    // Get user by id
    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: userController.getUser
    });

    // Create
    server.route({
        method: 'POST',
        path: '/users',
        handler: userController.createUser,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    firstName: Joi.string().min(2).required(),
                    lastName: Joi.string().min(2).required(),
                    password: Joi.string().min(6).required()
                }),
                failAction: (request, h, err) => {
                    return h.response({ message: err.details[0].message}).code(400).takeover();
                }
            }
        }
    });

    // Update
    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: userController.updateUser,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    firstName: Joi.string().min(2).required(),
                    lastName: Joi.string().min(2).required(),
                    password: Joi.string().min(6).required()
                }),
                failAction: (request, h, err) => {
                    return h.response({ message: err.details[0].message}).code(400).takeover();
                }
            }
        }
    });

    // Delete
    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: userController.deleteUser
    });

    // Login
    server.route({
        method: 'POST',
        path: '/users/login',
        handler: userController.loginUser,
        options: {
            auth: false
        }
    });

    // Logout
    server.route({
        method: 'GET',
        path: '/users/logout',
        handler: userController.logout,
        options: {
            auth: false
        }
    });

    // Validate
    server.route({
        method: 'GET',
        path: '/users/validate',
        handler: userController.validateToken,
        options: {
            auth: false
        }
    });
}