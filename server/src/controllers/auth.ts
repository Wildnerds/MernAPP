
import { RequestHandler } from "express"
import UserModel from "src/models/users";
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import { send } from "process";
import jwt, { TokenExpiredError } from "jsonwebtoken"
import mail from "src/utils/mail";
import PasswordResetTokenModel from "src/models/passwordResetToken";

import { profile } from "console";
import { isValidObjectId } from "mongoose";
import cloudUploader from "src/cloud";

    const VERIFICATION_LINK = process.env.VERIFICATION_LINK
    const JWT_SECRET = process.env.JWT_SECRET!
    const PASSWORD_RESET_LINK = process.env.PASSWORD_RESET_LINK
  
export const createNewuser: RequestHandler = async (req, res) =>{  
    // 1. Read incoming data like : name, email, password
    const {email, password, name} = req.body;
    // 2, validate if the data is ok or not,
     // 3, send error it not,
    if(!name) return sendErrorRes(res, "Name is missing", 422)
    if(!email) return sendErrorRes(res, "Email is missing", 422)
    if(!password) return sendErrorRes(res, "Password is missing", 422)

     // 4, check if we already have account with same user,
    const existingUser = await UserModel.findOne({email})

    // 5, send error if yes otherwise create new account and save user inside DB,

    if(existingUser) 
        return sendErrorRes(res, "Unauthorized request, email is already in use", 401)

    const user = await UserModel.create({email,password,name});
    
    user.comparePassword(password);

        // 6, generate and store verification token,
       const token = crypto.randomBytes(36).toString('hex')
       await AuthVerificationTokenModel.create({owner: user._id, token});
        
    // 7, send verification link with token to register email,
    const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`

      

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASSWORD,
        }
      });

      await transport.sendMail({
        from: "verification@myapp.com",
        to: user.email,
        html: `<h1>please click on <a href="${link}">this link</a> to verify your account<h1>`
      })

     // 8, send message back for user to check email inbox
        res.json({message: "Please check your email"})

};

export const verifyEmail: RequestHandler = async (req, res) =>{
    //     1. Read incoming data like: id token
    // 2. Find the token inside DB (using owner id)
    // 3. send error if token not found
    // 4. Check if the token is valid or not(because we have the encrypted value)
    // 5. if not valid send error otherwise update user is verified
    // 6. Remove token from database
    // 7. Send success message.
    const {id, token} = req.body;
    
    const authToken = await AuthVerificationTokenModel.findOne({owner: id});
    if(!authToken) return sendErrorRes(res, 'Unauthorized request, invalid token', 403)
    
     const isMatched = await authToken.compareToken(token)
     if(!isMatched) return sendErrorRes(res, 'Unauthorized request, invalid token', 403)

     await UserModel.findByIdAndUpdate(id, {verified: true})

     await AuthVerificationTokenModel.findByIdAndDelete(authToken._id)
        res.json({message: "Thanks for joining us, your email is now verified"})
    };

    export const generateVerificationLink: RequestHandler = async (req, res) =>{
        //1  check if user is authenicated of not
        //2 remove previous token if any
        //3 create/store new token 
        //4 send link inside users email 
        //5 send response back

        const {id} = req.user;
        const token = crypto.randomBytes(36).toString("hex")
        const link = `${VERIFICATION_LINK}?id=${id}&token=${token}`

        await AuthVerificationTokenModel.findOneAndDelete({owner: id})

        await AuthVerificationTokenModel.create({owner: id, token})

        await mail.sendVerification(req.user.email, link )

        res.json({message: "Check your inbox"})
    }
    
 
export const signIn: RequestHandler = async (req, res) => {
//         1. Read incoming data like: email and password
// 2. Find user with the provided email,
// 3. send error if user not found
// 4. Check if the password is valid or not(because we have the encrypted form)
// 5. if not valid send error otherwise generate access & refresh token
// 6. Store refresh token inside DB
// 7. Send both tokens to users

const {email, password} = req.body;
const user = await UserModel.findOne({email})
if(!user) return sendErrorRes(res, "Email/password mismatch", 403)

    const isMatched = await user.comparePassword(password)
    if(!isMatched) return sendErrorRes(res, "Email/password mismatch", 403)

        const payload = {id: user._id}

        const accessToken = jwt.sign(payload, JWT_SECRET,{
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(payload, JWT_SECRET)

       if(!user.tokens) user.tokens = [refreshToken]
       else user.tokens.push(refreshToken)

       await user.save();

       res.json({
        profile: {
            id: user._id,
            email:user.email,
            name: user.name,
            verified: user.verified,
            avatar: user.avatar?.url
        },
        tokens: {refresh: refreshToken, access: accessToken}
       })
    }
    export const sendProfile: RequestHandler = async (req, res) =>{
        res.json({
            profile: req.user
        })
    };
    
    export const grantAccessToken: RequestHandler = async (req, res) =>{
        // Read and verify refresh Token
        // find user with payload.id and refresh token
        // if the refresh token is valid and no user found, token is compromised
        // Remove all the previous tokens and send error response
        // If the token is valid and user found, create new refresh token and access Token
        // Remove previous TokenExpiredError, update user and send new tokens
        
        const {refreshToken} = req.body;
    

        if(!refreshToken) return sendErrorRes(res,"Unathourized request", 403);

            const payload = jwt.verify(refreshToken, JWT_SECRET) as {id: string}
        if(!payload.id) return sendErrorRes(res,"Unathourized request", 401)

        
        let user = await UserModel.findById({
            _id: payload.id,
            tokens: refreshToken
        })

        if(!user){
            // if user is compromised remove all the previous token 

            await UserModel.findByIdAndUpdate(payload.id, {tokens: []})
            return sendErrorRes(res, "Unauthorized request", 401)

        }

        const newAccessToken = jwt.sign({id: user._id}, JWT_SECRET,{
            expiresIn: "15m",
        });
        const newRefreshToken = jwt.sign({id: user._id}, JWT_SECRET)
        const filteredTokens = user.tokens.filter((t) => t !== refreshToken)
        user.tokens = filteredTokens;
        user.tokens.push(newRefreshToken)
        await user.save()

        await user.save()

        res.json({
            tokens: {refresh: newRefreshToken, access: newAccessToken},
        })

   

    
    }

    export const signOut: RequestHandler = async (req, res) =>{
      
        // remove refresh token

        const {refreshToken} = req.body
        const user = await UserModel.findOne({
            _id: req.user.id, 
            tokens: refreshToken})
        if(!user) return sendErrorRes(res, "Unauthorized request, User not found", 403);
        const newTokens = user.tokens.filter(t => t !== refreshToken)
        user.tokens = newTokens
        await user.save()
        res.send("Hey Swapper!! We gonna miss you")
    
    }

    export const generateForgotPasswordLink: RequestHandler = async (req, res) =>{

                // 1. ASk for users email
                // 2. find user with the given email
                // 3. send error if there is no user
                // 4. Else generate password reset(first remove if there is any
                // 5. Generate reset link (like we did for verification
                // 6. Send link inside user's email
                // 7. Send response back


            const {email} = req.body
            const user = await  UserModel.findOne({email});
            if(!user) return sendErrorRes(res, "Account not found", 404)

                // remove token
                await PasswordResetTokenModel.findOneAndDelete({owner: user._id})

                // create new Token
                const token = crypto.randomBytes(36).toString('hex')
                await PasswordResetTokenModel.create({owner: user._id, token})
                

                // send link to user email for new password creation
                const passwordResetLink = `${PASSWORD_RESET_LINK}?id=${user._id}&token=${token}`;
                await mail.sendPasswordResetLink(user.email, passwordResetLink)

                // send response

                res.json({message: "Please check your mail"});
    };

    export const grantValid: RequestHandler = async (req, res) =>{

        res.json({valid: true});
};

export const updatePassword: RequestHandler = async (req, res) =>{

    // 1, Read User id, reset password token and password
    // 2, Validate all these things
    // 3, If valid find user with given id
    // 4, check if user is using same password
    // 5, if there is no user or user is missing the same password, send error res
    // 6, Else update new password
    // 7, Remove password reset token
    // 8, Send confirmation email
    // 9, Send response back

    const {id, password} = req.body

    const user = await UserModel.findById(id)
    if(!user) return sendErrorRes(res, "Unauthorized access", 403)

    const matched = await user.comparePassword(password)
    if(matched) return sendErrorRes(res, "The new password must be different", 422)

    user.password = password
    await user.save()

    await PasswordResetTokenModel.findOneAndDelete({owner: user._id})

    await mail.sendPasswordUpdateMessage(user.email)

    res.json({message: "Password reset successful"})

};

export const updateProfile: RequestHandler = async (req, res) =>{

    // 1, User must be logged in (authenicated)
    // 2, Name must be valid
    // 3, Find user and update the name
    // 4, Send new profile
   
    const {name} = req.body
    if(typeof name !== 'string' || name.trim().length < 3){
        return sendErrorRes(res, "invalid name", 422)
   }
    await UserModel.findByIdAndUpdate(req.user.id, {name})

    res.json({profile:{ ...req.user, name}})


}

export const updateAvatar: RequestHandler = async (req, res) =>{

    /**
    1, User must be logged in
    2, Read Incoming file,
    3, file type must be image
    4, Check if user already have avater or not,
    5, if yes remove the old avater,
    6, Upload new avater and update user,
    7, send response back
    **/ 

    const {avatar} = req.files
    if(Array.isArray(avatar)){
        return sendErrorRes(res, "You cannot upload multiple files", 422)
    }

    if(!avatar.mimetype?.startsWith("image")){
        return sendErrorRes(res, "Invalid image file", 422)
    }
    const user = await UserModel.findByIdAndUpdate(req.user.id)
    if(!user){
        return sendErrorRes(res, "User not found", 404)
    }
    if(user.avatar?.id){
        //remove avater
       await cloudUploader.destroy(user.avatar.id)
    }

    //upload avater file
    const {secure_url: url, public_id: id} = await cloudUploader.upload(avatar.filepath,
        {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
            background: "white",
            border: "2px_solid_black",
            quality: "auto",
            folder: "avatars",
        }
    )
    user.avatar = {url, id}
    await user.save()
    res.json({profile: {...req.user, avatar: user.avatar.url}})
};

export const sendPublicProfile: RequestHandler = async (req, res) =>{
    const profileId = req.params.id;
    if(!isValidObjectId(profileId)){ 
        return sendErrorRes(res,"Invalid profile id", 422)  
}

const user = await UserModel.findById(profileId)
if(!user){
    return sendErrorRes(res,"profile not found", 404)
}
res.json({profile:{id: user._id, name: user.name, avatar: user.avatar?.url}})

}
