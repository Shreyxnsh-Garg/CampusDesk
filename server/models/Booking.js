const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    purpose: {
      type: String,
      required: true
    },

    status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed"
},
reminderSent: {
  type: Boolean,
  default: false
}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);