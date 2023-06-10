const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);
module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        qty:{
            warehouseStock: Joi.number().required().min(0),
            shopStock: Joi.number().required().min(0)
        }


    }).required(),
    image: Joi.string().allow('').optional()
});



