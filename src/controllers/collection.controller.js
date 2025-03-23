const Collection = require('../models/collection.model');
const { AppError } = require('../middleware/error.middleware');

exports.getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find()
            .populate('products', 'name basePrice imageUrl')
            .select('-__v');
        
        res.status(200).json({
            status: 'success',
            results: collections.length,
            data: collections
        });
    } catch (error) {
        throw new AppError('Error fetching collections', 500);
    }
};

exports.createCollection = async (req, res) => {
    try {
        const collection = await Collection.create(req.body);
        
        if (collection.discountPercentage > 0) {
            await collection.applyDiscount();
        }

        res.status(201).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('Collection with this name already exists', 400);
        }
        throw new AppError('Error creating collection', 500);
    }
};

exports.getCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('products', 'name basePrice imageUrl variants tags')
            .select('-__v');

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        throw new AppError('Error fetching collection', 500);
    }
};

exports.updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        if (req.body.discountPercentage !== undefined) {
            await collection.applyDiscount();
        }

        res.status(200).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        throw new AppError('Error updating collection', 500);
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        // Remove discount from products if collection had one
        if (collection.discountPercentage > 0) {
            await mongoose.model('Product').updateMany(
                { _id: { $in: collection.products } },
                { $set: { discountPercentage: 0 } }
            );
        }

        res.status(204).send();
    } catch (error) {
        throw new AppError('Error deleting collection', 500);
    }
};

exports.addProductToCollection = async (req, res) => {
    try {
        const { productId } = req.body;
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        if (collection.products.includes(productId)) {
            throw new AppError('Product already in collection', 400);
        }

        collection.products.push(productId);
        
        if (collection.discountPercentage > 0) {
            await mongoose.model('Product').findByIdAndUpdate(
                productId,
                { discountPercentage: collection.discountPercentage }
            );
        }

        await collection.save();

        res.status(200).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        throw new AppError('Error adding product to collection', 500);
    }
};

exports.removeProductFromCollection = async (req, res) => {
    try {
        const { productId } = req.params;
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        collection.products = collection.products.filter(
            id => id.toString() !== productId
        );

        // Remove discount from product if collection had one
        if (collection.discountPercentage > 0) {
            await mongoose.model('Product').findByIdAndUpdate(
                productId,
                { discountPercentage: 0 }
            );
        }

        await collection.save();

        res.status(200).json({
            status: 'success',
            data: collection
        });
    } catch (error) {
        throw new AppError('Error removing product from collection', 500);
    }
};

exports.getActiveCollections = async (req, res) => {
    try {
        const now = new Date();
        const collections = await Collection.find({
            isActive: true,
            $or: [
                { endDate: { $gt: now } },
                { endDate: null }
            ]
        }).populate('products', 'name basePrice imageUrl');

        res.status(200).json({
            status: 'success',
            results: collections.length,
            data: collections
        });
    } catch (error) {
        throw new AppError('Error fetching active collections', 500);
    }
};
