const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Brunch", "Dinner"],
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  meetingLocation: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  approvedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  pendingUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const Event = mongoose.model("event", eventSchema);

module.exports = Event;
