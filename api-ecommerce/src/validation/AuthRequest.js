import Joi from "joi";
import joi from "joi";

export const authSignUpRequest = joi.object({
  username: joi.string().required().min(3).max(255),
  email: joi.string().email().required(),
  password: joi.string().required().min(6).max(255),
  confirmPassword: joi.string().required().valid(Joi.ref("password")),
});

export const authSignInRequest = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(6).max(255),
});
