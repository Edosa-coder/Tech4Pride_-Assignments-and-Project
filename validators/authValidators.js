const Joi = require("joi");

const registerSchema = Joi.object({
    full_name: Joi.string()
        .min(2)
        .max(100)
        .required(),
    email: Joi.string()
        .email()
        .max(255)
        .required(),

    phone: Joi.string()
    .pattern(/^[0-9]{11,15}$/)
    .required(),

password: Joi.string()
    .min(8)
    .max(100)
    .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required(),

        password: Joi.string()
            .required()
})
module.exports = {
    registerSchema,
    loginSchema
};