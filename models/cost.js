const mongoose = require("mongoose");

const costSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number },
  id: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "food",
      "health",
      "housing",
      "sport",
      "education",
      "transportation",
      "other",
    ],
    required: true,
  },
  sum: { type: Number, required: true },
});

// Define a virtual field for the computed pattern
costSchema.virtual("computed").get(function () {
  const category = this.category;
  const total = this.sum;
  return { [category]: total };
});

const Cost = mongoose.model("Cost", costSchema);

module.exports = Cost;
