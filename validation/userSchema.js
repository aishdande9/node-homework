const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one letter and one number",
      "any.required": "Password is required",
    }),
});

module.exports = { userSchema };