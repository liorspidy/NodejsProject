const mongoose = require('mongoose');

// create a new costs schema with the given parameters
const costSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'food',
      'health',
      'housing',
      'sport',
      'education',
      'transportation',
      'other',
    ],
    required: true,
  },
  sum: { type: Number, required: true },
});

// make the id increment for each instance
costSchema.pre('save', async function (next) {
  if (this.isNew) {
    const maxCost = await Cost.findOne().sort({ id: -1 });
    this.id = maxCost ? maxCost.id + 1 : 1;
  }
  next();
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
