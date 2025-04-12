const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    feedback: { type: String, required: true }, // Feedback textcl
    createdAt: { type: Date, default: Date.now }, // Timestamp
});

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);
module.exports = FeedbackModel;