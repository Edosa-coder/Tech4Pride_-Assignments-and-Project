const Joi = require("joi");

const createAccountSchema = Joi.object({
    account_type: Joi.string()
        .valid("savings", "current", "fixed")
        .required(),

    currency: Joi.string()
        .length(3)
        .pattern(/^[A-Z]{3}$/)
        .default("NGN")
});

const depositSchema = Joi.object({
    account_number: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .required(),

   amount: Joi.number()
    .positive()
    .custom((value, helpers) => {
        if (Math.round(value * 100) !== value * 100) {
            return helpers.error("number.precision");
        }

        return value;
    })
     .messages ({
        "number.precision": "Amount must have no more than 2 decimal places"
     })
    .required(),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("", null)
        .optional()
});

const withdrawSchema = Joi.object({
    account_number: Joi.string()
       .pattern(/^[0-9]{10}$/)
       .required(),
    
       amount: Joi.number()
          .positive()
          .custom((value, helpers) => {
              if (Math.round(value * 100) !== value * 100) {
                  return helpers.error("number.precision");
              }
              return value;
          })
          .messages ({
              "number.precision": "Amount must have no more than 2 decimal places"
          })
          .required(),

        description: Joi.string()
            .trim()
            .max(255)
            .allow("", null)
            .optional()
});

const transferSchema = Joi.object({
    from_account_number: Joi.string()
       .pattern(/^[0-9]{10}$/)
       .required(),

    to_account_number: Joi.string()
       .pattern(/^[0-9]{10}$/)
       .required(),

    amount: Joi.number()
       .positive()
       .custom((value, helpers) => {
           if (Math.round(value * 100) !== value * 100) {
               return helpers.error("number.precision");
           }
           return value;
       })
       .messages ({
           "number.precision": "Amount must have no more than 2 decimal places"
       })
       .required(),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("", null)
        .optional()
}).custom((value, helpers) => {
    if (value.from_account_number === value.to_account_number) {
        return helpers.error("any.invalid");
    }

    return value;
}).messages({
    "any.invalid": "Source and destination accounts must be different."
});

module.exports = {
    createAccountSchema,
    depositSchema,
    withdrawSchema,
    transferSchema,
};