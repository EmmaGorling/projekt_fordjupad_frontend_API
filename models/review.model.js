"use strict"

const Mongoose = require("mongoose");

const reviewSchema = new Mongoose.Schema(
    {
        userId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bookId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        }
    }
);

const Review = Mongoose.model("Review", reviewSchema);
module.exports = Review;