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

const depositSchema = Joi.object({
    account_number: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .required(),
    amount: Joi.number()
          .positive()
          .precision(2)
          .required(),

    description: Joi.string()
        .trim()
        .max(255)
        .allow(" ", null)
        .optional()
})

module.exports = {
    createAccountSchema,
    depositSchema
};