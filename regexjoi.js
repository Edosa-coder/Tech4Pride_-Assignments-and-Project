import Joi from "joi";

const PATTERN = /^[a-z0-9._+-@]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const schema = Joi.object({
    email: Joi.string()
        .pattern(PATTERN)
        .required()
});

const values = [
    "45edosa@gmail.com",
    "ebun25@yahoo.com",
    "asabe@yahoo.org",
    "nic@google.com",
    "asabeyahoo@.org",
    "45edosagmail@.com",
    "@samueledosa@google.com",
    "tech4pride@co.uk"
];

values.forEach((email, index) => {
    const { error } = schema.validate({ email });

    console.log({
        index,
        email,
        match: !error,
        length: email.length
    });
});