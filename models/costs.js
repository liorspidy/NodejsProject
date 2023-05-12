const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
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

costSchema.add({ id: mongoose.Types.ObjectId });

costSchema.virtual('computed').get(function () {
  const category = this.category;
  const total = this.sum;
  return { [category]: total };
});

costSchema.index({ category: 1 });

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
