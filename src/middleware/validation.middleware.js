const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(), // MongoDB ObjectId as string
  basePrice: Joi.number().min(0).required(),
  variants: Joi.array().items(
    Joi.object({
      size: Joi.string(),
      color: Joi.string(),
      sku: Joi.string().required(),
      price: Joi.number().min(0).required(),
      stock: Joi.number().min(0).required(),
      discountPercentage: Joi.number().min(0).max(100)
    })
  ),
  images: Joi.array().items(Joi.string().uri()),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean()
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  parent: Joi.string().allow(null), // MongoDB ObjectId as string
  isActive: Joi.boolean()
});

const inventoryUpdateSchema = Joi.object({
  productId: Joi.string().required(),
  variantId: Joi.string().required(),
  quantity: Joi.number().min(0).required()
});

exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateInventoryUpdate = (req, res, next) => {
  const { error } = inventoryUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
