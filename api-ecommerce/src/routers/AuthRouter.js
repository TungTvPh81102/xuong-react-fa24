import express from "express";
import {
  requestPasswordReset,
  resetPassword,
  signin,
  signup,
} from "../controllers/Auth/AuthController";
import { requestBody } from "../middlewares/RequestBody";
import {
  authSignInRequest,
  authSignUpRequest,
} from "../validation/AuthRequest";

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", requestBody(authSignUpRequest), signup);
AuthRouter.post("/sign-in", requestBody(authSignInRequest), signin);
AuthRouter.post("/request-password-reset", requestPasswordReset);
AuthRouter.post("/reset-password", resetPassword);

export default AuthRouter;
