const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: [
            "Lecture Hall",
            "SAC",
            "Music Room",
            "Camera",
            "Projector",
            "Lab Equipment",
            "Computer Lab",
            "Equipment",
            "Other"
        ],
        required: true
    },

    location: {
        type: String,
        default: ""
    },

    capacity: {
        type: Number,
        default: 0
    },

    quantity: {
        type: Number,
        default: 1
    },

    available: {
        type: Boolean,
        default: true
    },

    isActive: {
    type: Boolean,
    default: true,
},
},
{
    timestamps: true
});

module.exports = mongoose.model("Resource", resourceSchema);