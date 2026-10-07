const Joi = require("joi");

const createAccountSchema = Joi.object({
    account_type: Joi.string()
        .valid("savings", "current", "fixed")
        .required(),

    currency: Joi.string()
        .length(3)
        .uppercase()
        .default("NGN")
});

module.exports = {
    createAccountSchema
};