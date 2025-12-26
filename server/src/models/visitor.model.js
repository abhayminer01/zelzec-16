const mongoose = require("mongoose");

const VisitorCountSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});

const visitor = mongoose.model("VisitorCount", VisitorCountSchema);
module.exports = visitor;