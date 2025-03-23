const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc',
      inStock,
      tags,
      color,
      size
    } = req.query;

    const query = {};
    const sort = {};

    // Basic filters
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Text search in name, description, and tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Stock filter
    if (inStock === 'true') {
      query['variants.stock'] = { $gt: 0 };
    } else if (inStock === 'false') {
      query['variants.stock'] = 0;
    }

    // Tags filter (comma-separated)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $all: tagArray };
    }

    // Variant filters
    if (color || size) {
      query.variants = { $elemMatch: {} };
      if (color) query.variants.$elemMatch.color = color;
      if (size) query.variants.$elemMatch.size = size;
    }

    // Sorting
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    // Add availability status and lowest price with discount
    const enhancedProducts = products.map(product => {
      const doc = product.toObject();
      doc.isInStock = product.variants.some(v => v.stock > 0);
      doc.lowestPrice = Math.min(...product.variants.map(v => 
        v.price * (1 - (v.discountPercentage || 0) / 100)
      ));
      return doc;
    });

    res.json({
      products: enhancedProducts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count,
      hasNextPage: page * limit < count,
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    variant.stock = quantity;
    await product.save();
    
    res.json(variant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10, category, page = 1, limit = 10 } = req.query;
    const query = {
      'variants.stock': { $lte: Number(threshold) }
    };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('category')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New endpoint for product statistics
exports.getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $unwind: '$variants'
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$variants.stock' },
          averagePrice: { $avg: '$variants.price' },
          lowStockProducts: {
            $sum: {
              $cond: [{ $lte: ['$variants.stock', 10] }, 1, 0]
            }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]);

    res.json({
      generalStats: stats[0],
      categoryDistribution: categoryStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
