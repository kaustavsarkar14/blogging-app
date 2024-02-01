const mongoose = require("mongoose");

const AccessSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("access", AccessSchema);
