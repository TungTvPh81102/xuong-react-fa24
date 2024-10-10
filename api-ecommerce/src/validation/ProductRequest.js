import joi from "joi";

export const productRequest = joi.object({
  category: joi.string().required(),
  name: joi.string().required().min(3).max(255),
  sku: joi.string().required().min(3).max(255),
  price: joi.number().required().min(1),
  image: joi.string().required(),
  quantity: joi.number().required().min(0),
  description: joi.optional(),
  rating: joi.optional(),
  attributes: joi.optional(),
  tags: joi.optional(),
  status: joi.boolean(),
});
