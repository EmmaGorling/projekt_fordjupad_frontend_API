"use strict"

// Imports
const reviewController = require("../controllers/review.controller");
const Joi = require("joi");

module.exports = (server) => {
    // Create review
    server.route({
        method: 'POST',
        path: '/reviews',
        handler: reviewController.createReview,
        options: {
            validate: {
                payload: Joi.object({
                    reviewText: Joi.string().min(1).required().messages({
                        "string.empty": "Recensionstext krävs"
                    }),
                    rating: Joi.number().min(1).max(5).required().messages({
                        "number.base": "Betyget måste vara ett nummer",
                        "number.min": "Betyget måste vara minst 1",
                        "number.max": "Betyget får vara högst 5"
                    })
                }),
                failAction: (request, h, err) => {
                    return h
                        .response({ message: err.details[0].message })
                        .code(400)
                        .takeover();
                }
            }
        }
    });

    // Get single review
    server.route({
        method: 'GET',
        path: '/reviews/{id}',
        handler: reviewController.getSingleReview,
        options: {
            auth: false
        }
    })

    // Update review
    server.route({
        method: 'PUT',
        path: '/reviews/{id}',
        handler: reviewController.updateReview,
        options: {
            validate: {
                payload: Joi.object({
                    reviewText: Joi.string().min(1).required().messages({
                        "string.empty": "Recensionstext krävs"
                    }),
                    rating: Joi.number().min(1).max(5).required().messages({
                        "number.base": "Betyget måste vara ett nummer",
                        "number.min": "Betyget måste vara minst 1",
                        "number.max": "Betyget får vara högst 5"
                    })
                }),
                failAction: (request, h, err) => {
                    return h
                        .response({ message: err.details[0].message })
                        .code(400)
                        .takeover();
                }
            }
        }
    })

    // Delete review
    server.route({
        method: 'DELETE',
        path: '/reviews/{id}',
        handler: reviewController.deleteReview
    });

    // Get reviews by book
    server.route({
        method: 'GET',
        path: '/reviews/book/{bookId}',
        handler: reviewController.getReviewsByBook,
        options: {
            auth: false
        }
    });

    // Get top reviews
    server.route({
        method: 'GET',
        path: '/reviews/top',
        handler: reviewController.getTopReviews,
        options: {
            auth: false
        }
    })
    // Get reviews from user
    server.route({
        method: 'GET',
        path: '/users/{id}/reviews',
        handler: reviewController.getReviewsByUser,
        options: {
            auth: false
        }
    })

    // Like
    server.route({
        method: 'POST',
        path: '/reviews/{reviewId}/like',
        handler: reviewController.likeReview
    });

    // Dislike
    server.route({
        method: 'POST',
        path: '/reviews/{reviewId}/dislike',
        handler: reviewController.dislikeReview
    });
}