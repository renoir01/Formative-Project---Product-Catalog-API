const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get all subcategories
categorySchema.methods.getSubcategories = async function() {
  return await this.model('Category').find({ parent: this._id });
};

module.exports = mongoose.model('Category', categorySchema);
