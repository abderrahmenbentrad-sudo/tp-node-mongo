
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    motif: {
      type: String,
      required: true,
      trim: true
    },
    diagnostic: {
      type: String,
      default: ''
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
