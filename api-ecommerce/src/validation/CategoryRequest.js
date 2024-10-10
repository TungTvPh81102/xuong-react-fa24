import joi from "joi";

export const categoryRequest = joi.object({
  name: joi.string().required().min(3).max(255),
  status: joi.boolean(),
});
