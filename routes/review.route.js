"use strict"

// Imports
const reviewController = require("../controllers/review.controller");
const Joi = require("joi");

module.exports = (server) => {
    // Create review
    server.route({
        method: 'POST',
        path: '/reviews',
        handler: reviewController.createReview
    });

    // Get single review
    server.route({
        method: 'GET',
        path: '/reviews/{id}',
        handler: reviewController.getSingleReview
    })

    // Get reviews by book
    server.route({
        method: 'GET',
        path: '/reviews/book/{bookId}',
        handler: reviewController.getReviewsByBook
    });

    // Get reviews from user
    server.route({
        method: 'GET',
        path: '/users/{id}/reviews',
        handler: reviewController.getReviewsByUser
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