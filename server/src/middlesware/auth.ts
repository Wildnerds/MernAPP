import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import UserModel from "src/models/users";
import PasswordResetTokenModel from "src/models/passwordResetToken";

const JWT_SECRET = process.env.JWT_SECRET

interface UserProfile  {
    id: string,
    name: string, 
    email: string,
    verified: boolean,
}

declare global {
    namespace Express {
        interface Request {
            user: UserProfile
        }
    }
}


export const isAuth: RequestHandler = async (req, res, next) =>{
//     1. Read uauthorization header
// 2. See if token is present
// 3. send error if token not found
// 4. verify the token(we have to use jwt.verify)
// 5. Take out the user id from token (we will have it as payload)
// 6. check if we have the user with this id,
// 7. Send error if not,
// 8. Attach user profile inside req object,
// 9. Call 'next function,
// 10. Handle error for expired tokens


try {
    const authToken = req.headers.authorization
    if(!authToken) return sendErrorRes(res, "unauthorized request", 403)

    const token = authToken.split("Bearer ")[1]
    const payload = jwt.verify(token, JWT_SECRET) as {id: string}

    const user = await UserModel.findById(payload.id)
    if(!user) return sendErrorRes(res, "unauthorized request", 403)

     req.user = { 
        id: user._id, //can add underscore to the id later
        name: user.name,
        email: user.email,
        verified: user.verified,

    };
    next()
    
    } catch (error) {
    if(error instanceof TokenExpiredError){
        return sendErrorRes(res, "session expired", 401)
    }
    if(error instanceof JsonWebTokenError){
        return sendErrorRes(res, "unauthorized access", 401)
    }
    next(error)
    }

};

export const isValidPasswordResetToken: RequestHandler = async (req, res, next) =>{
    //     1. Read token and id
    // 2. find token inside database
    // 3. send error if token not found
    // 4. else compare token with encrytped value
    // 5. if not matched send error
    // 6. else call next function

    const {id, token} = req.body;
    const resetPasswordToken = await PasswordResetTokenModel.findOne({owner: id})
    if(!resetPasswordToken) return sendErrorRes(res, "Unathourized request, Invalid token", 403)
    
    const matched = await resetPasswordToken?.compareToken(token)
    if(!matched) return sendErrorRes(res, "Unathourized request, Invalid token", 403)

    next()
   

    };