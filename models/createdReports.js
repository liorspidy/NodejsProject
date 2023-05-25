const mongoose = require('mongoose');

const createdReportsSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  report: { type: Object, required: true },
});

const createdReports = mongoose.model('createdReport', createdReportsSchema);

module.exports = createdReports;
