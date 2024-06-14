import { RequestHandler } from "express"
import UserModel from "src/models/users";
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import { send } from "process";
import jwt from "jsonwebtoken"


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

    const user = await UserModel.create({email, password,name});
    
    user.comparePassword(password);

        // 6, generate and store verification token,
       const token = crypto.randomBytes(36).toString('hex')
       await AuthVerificationTokenModel.create({owner: user._id, token});
        
    // 7, send verification link with token to register email,
    const link = `http://localhost:8000/verify.html?id=${user._id}&token=${token}`

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "2c186ffed6247a",
          pass: "cacec05e2a6e66"
        }
      });

      await transport.sendMail({
        from: "verification@myapp.com",
        to: user.email,
        html: `<h1>please click on <a href="${link}">this link</a> to verify your account<h1>`
      })

     // 8, send message back to check email inbox
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

        const accessToken = jwt.sign(payload, "secret",{
            expiresIn: "15m",
        })
        const refreshToken = jwt.sign(payload, "secret")

       if(!user.tokens) user.tokens = [refreshToken]
       else user.tokens.push(refreshToken)

       await user.save();

       res.json({
        profile: {
            id: user._id,
            email:user.email,
            name: user.name,
            verified: user.verified,
        },
        tokens: {refresh: refreshToken, access: accessToken}
       })
    }
    export const sendProfile: RequestHandler = async (req, res) =>{
        res.json({
            profile: req.user
        })
    }