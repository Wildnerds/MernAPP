import { Router } from "express";
import { createNewuser, generateForgotPasswordLink, generateVerificationLink, grantAccessToken, grantValid, sendProfile, sendPublicProfile, signIn, signOut, updateAvatar, updatePassword, updateProfile, verifyEmail } from "controllers/auth";
import validate from "src/middlesware/validator";
import { newUserSchema, resetPasswordSchema, verifyTokenSchema } from "src/utils/validationSchema";
import { isAuth, isValidPasswordResetToken } from "src/middlesware/auth";
import fileParser from "src/middlesware/fileParser";

const authRouter = Router()

authRouter.post('/sign-up', validate(newUserSchema), createNewuser)
authRouter.post('/verify', validate(verifyTokenSchema),verifyEmail)
authRouter.get('/verify-token', isAuth, generateVerificationLink)
authRouter.post('/sign-in', signIn);
authRouter.get('/profile', isAuth, sendProfile);
authRouter.post('/refresh-token',grantAccessToken)
authRouter.post('/sign-out', isAuth, signOut);
authRouter.post('/forget-password', generateForgotPasswordLink);
authRouter.post('/verify-password-reset-token',
    validate(verifyTokenSchema),isValidPasswordResetToken, grantValid);
authRouter.post('/reset-password',
    validate(resetPasswordSchema),
    isValidPasswordResetToken, 
    updatePassword);
authRouter.patch('/update-profile',isAuth, updateProfile);
authRouter.patch('/update-avatar',isAuth, fileParser, updateAvatar);
authRouter.get('/profile/:id', isAuth, sendPublicProfile)


export default authRouter