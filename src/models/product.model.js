const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  discountPercentage: { type: Number, min: 0, max: 100, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
  variants: [variantSchema],
  images: [String],
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add text indexes for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating the lowest price among variants
productSchema.virtual('lowestPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return this.basePrice;
  return Math.min(...this.variants.map(v => v.price));
});

// Method to check if product is low on stock
productSchema.methods.isLowStock = function(threshold = 10) {
  return this.variants.some(variant => variant.stock <= threshold);
};

module.exports = mongoose.model('Product', productSchema);
