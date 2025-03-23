const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(50)
        .trim()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters'
        }),
    email: Joi.string()
        .required()
        .email()
        .trim()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),
    password: Joi.string()
        .required()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .trim()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
});

const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters'
        }),
    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email address'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema
};
