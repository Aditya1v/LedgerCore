const Joi = require("joi");

const createTransactionSchema = Joi.object({
  fromAccount: Joi.string().required(),

  toAccount: Joi.string().required(),

  amount: Joi.number()
    .positive()
    .required(),

  category: Joi.string()
    .trim()
    .required(),

  merchant: Joi.string()
    .max(100)
    .allow("")
    .optional(),

  description: Joi.string()
    .max(300)
    .allow("")
    .optional(),

  tags: Joi.array()
    .items(Joi.string())
    .default([]),

  idempotencyKey: Joi.string().required(),
});

module.exports = {
  createTransactionSchema,
};