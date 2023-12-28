const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
  customerName: { type: String, required: true, unique: true },
  emailCount: { type: Number, required: true, default: 0 },
  hue: { type: Number, required: true, default: 120 }, // Default to a hue that represents green.
});

module.exports = mongoose.model("Tree", TreeSchema);
