const Joi = require('joi');
const { errorResponse } = require('../utils/response.utils');

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

const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (!error) {
            return next();
        }

        const errors = error.details.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));

        return res.status(400).json(
            errorResponse('Validation error', errors)
        );
    };
};

const validateObjectId = (req, res, next) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json(
            errorResponse('Invalid ID format')
        );
    }
    next();
};

const validateQueryParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (!error) {
            return next();
        }

        const errors = error.details.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));

        return res.status(400).json(
            errorResponse('Invalid query parameters', errors)
        );
    };
};

const validateProduct = validateRequest(productSchema);
const validateCategory = validateRequest(categorySchema);
const validateInventoryUpdate = validateRequest(inventoryUpdateSchema);

module.exports = {
    validateProduct,
    validateCategory,
    validateInventoryUpdate,
    validateObjectId,
    validateQueryParams
};
