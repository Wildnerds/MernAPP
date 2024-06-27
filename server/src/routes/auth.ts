import { Router } from "express";
import { createNewuser, generateForgotPasswordLink, generateVerificationLink, grantAccessToken, sendProfile, signIn, signOut, verifyEmail } from "controllers/auth";
import validate from "src/middlesware/validator";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { isAuth } from "src/middlesware/auth";

const authRouter = Router()

authRouter.post('/sign-up', validate(newUserSchema), createNewuser)
authRouter.post('/verify', validate(verifyTokenSchema),verifyEmail)
authRouter.get('/verify-token', isAuth, generateVerificationLink)
authRouter.post('/sign-in', signIn);
authRouter.get('/profile', isAuth, sendProfile);
authRouter.post('/refresh-token',grantAccessToken)
authRouter.post('/sign-out', isAuth, signOut);
authRouter.post('/forget-password', generateForgotPasswordLink);


export default authRouter