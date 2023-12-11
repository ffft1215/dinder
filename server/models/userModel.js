const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
  pronouns: {
    type: [String],
    default: [],
  },
  restrictions: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
  premium: {
    type: Boolean,
    default: false,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
