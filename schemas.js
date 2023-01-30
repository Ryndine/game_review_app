const Joi = require('Joi')

module.exports.gameSchema = Joi.object({
    game: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        company: Joi.string().required(),
    }).required()
})