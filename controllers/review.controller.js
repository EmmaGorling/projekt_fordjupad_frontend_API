"use strict"

const Review = require("../models/review.model");
const Jwt = require("@hapi/jwt");

// Create review
exports.createReview = async (request, h) => {
    try {
        const loggedInUserId = validateUserToken(request, h);


        // Create review
        const { bookId, reviewText, rating } = request.payload;

        const newReview = new Review({
            user: loggedInUserId,
            bookId,
            reviewText,
            rating
        });

        const savedReview = await newReview.save();
        return h.response(savedReview).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Get single review
exports.getSingleReview = async (request, h) => {
    try {
        const review = await Review.findById(request.params.id);
        return h.response(review).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Get reviews by book
exports.getReviewsByBook = async (request, h) => {
    try {
        const reviews = await Review.find({ bookId: request.params.bookId })
            .populate("user", "firstName lastName");

            return h.response(reviews).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Get reviews by user
exports.getReviewsByUser = async (request, h) => {
    try {
        const userId = request.params.id;

        const reviews = await Review.find({ user: userId });

        return h.response(reviews).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}


// Like a review
exports.likeReview = async (request, h) => {
    try {
        const loggedInUserId = validateUserToken(request, h);

        const review = await Review.findById(request.params.reviewId);
        if(!review) return h.respone({ message: "Review not found" }).code(404);

        if (review.likes.includes(loggedInUserId)) {
            review.likes = review.likes.filter(id => id.toString() !== loggedInUserId);
        } else {
            review.likes.push(loggedInUserId);
            review.dislikes = review.dislikes.filter(id => id.toString() !== loggedInUserId);
        }

        await review.save();
        return h.response(review).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Dislike review
exports.dislikeReview = async (request, h) => {
    try {
        const loggedInUserId = validateUserToken(request, h);

        const review = await Review.findById(request.params.reviewId);
        if (!review) return h.response({ message: "Review not found" }).code(404);

        if (review.dislikes.includes(loggedInUserId)) {
            review.dislikes = review.dislikes.filter(id => id.toString() !== loggedInUserId);
        } else {
            review.dislikes.push(loggedInUserId);
            review.likes = review.likes.filter(id => id.toString() !== loggedInUserId);
        }

        await review.save();
        return h.response(review).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Validate user
const validateUserToken = (request, h) => {
    try {
        const token = request.state.jwt;
        if (!token) {
            return h.response({ message: "No token available" }).code(401).takeover();
        }

        const decoded = Jwt.token.decode(token);
        const loggedInUserId = decoded.decoded.payload.user._id;

        return loggedInUserId;
    } catch (error) {
        return h.response({ message: "Invalid token" }).code(403).takeover();
    }
}