"use strict"

const Mongoose = require("mongoose");
const User = require('./user.model');
const { required } = require("joi");

const reviewSchema = new Mongoose.Schema(
    {
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        bookId: {
            type: String,
            required: true
        },
        bookTitle: {
            type: String
        },
        reviewText: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        likes: [{
            type: Mongoose.Schema.Types.ObjectId, ref: "User"
        }],
        dislikes: [{
            type: Mongoose.Schema.Types.ObjectId, ref: "User"
        }]
    },
    {
        timestamps: true
    }
);

const Review = Mongoose.model("Review", reviewSchema);
module.exports = Review;