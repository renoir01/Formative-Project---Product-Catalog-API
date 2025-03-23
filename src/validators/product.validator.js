const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().required().min(10),
    basePrice: Joi.number().required().min(0),
    category: Joi.string().required().hex().length(24),
    tags: Joi.array().items(Joi.string()),
    variants: Joi.array().items(Joi.object({
        size: Joi.string().required(),
        color: Joi.string().required(),
        sku: Joi.string().required(),
        price: Joi.number().min(0),
        stock: Joi.number().integer().min(0)
    }))
});

const productUpdateSchema = productSchema.fork(
    ['name', 'description', 'basePrice', 'category'],
    (schema) => schema.optional()
);

const productQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    category: Joi.string().hex().length(24),
    sort: Joi.string().valid('price_asc', 'price_desc', 'name_asc', 'name_desc')
});

module.exports = {
    productSchema,
    productUpdateSchema,
    productQuerySchema
};
