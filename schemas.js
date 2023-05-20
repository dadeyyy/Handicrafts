const Joi = require('joi')
module.exports.handicraftSchema = Joi.object({
    handicraft: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        products: Joi.string().required(),
        description: Joi.string()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

