import { Router } from "express";
import { createNewuser, sendProfile, signIn, verifyEmail } from "controllers/auth";
import validate from "src/middlesware/validator";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { isAuth } from "src/middlesware/auth";

const authRouter = Router()

authRouter.post('/sign-up', validate(newUserSchema), createNewuser)
authRouter.post('/verify', validate(verifyTokenSchema),verifyEmail)
authRouter.post('/sign-in', signIn);
authRouter.get('/profile', isAuth, sendProfile);


export default authRouter