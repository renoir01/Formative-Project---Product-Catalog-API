const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Collection description is required'],
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});

// Apply discount to all products in collection
collectionSchema.methods.applyDiscount = async function() {
    if (!this.discountPercentage) return;
    
    await mongoose.model('Product').updateMany(
        { _id: { $in: this.products } },
        { $set: { discountPercentage: this.discountPercentage } }
    );
};

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
