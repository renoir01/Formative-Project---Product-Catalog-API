const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent')
      .exec();
    
    // Organize categories into a tree structure
    const categoryTree = categories
      .filter(cat => !cat.parent)
      .map(cat => ({
        ...cat.toObject(),
        children: getChildCategories(categories, cat._id)
      }));

    res.json(categoryTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent');
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategories = await category.getSubcategories();
    const response = {
      ...category.toObject(),
      subcategories
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // Prevent circular parent references
    if (req.body.parent === req.params.id) {
      return res.status(400).json({ error: 'Category cannot be its own parent' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parent');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Check for subcategories
    const subcategories = await Category.find({ parent: req.params.id });
    if (subcategories.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with subcategories. Delete or reassign subcategories first.' 
      });
    }

    // Check for associated products
    const Product = require('../models/product.model');
    const products = await Product.find({ category: req.params.id });
    if (products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with associated products. Reassign or delete products first.' 
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to build category tree
function getChildCategories(categories, parentId) {
  return categories
    .filter(cat => cat.parent && cat.parent.toString() === parentId.toString())
    .map(cat => ({
      ...cat.toObject(),
      children: getChildCategories(categories, cat._id)
    }));
}
