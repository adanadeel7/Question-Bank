import express from "express"
import rateLimit from "express-rate-limit"
import { registerHandler,resetPasswordHandler,loginHandler,forgotPasswordhandler,verifyEmailHandler,logoutHandler,refreshHandler } from '../controller/auth.controllers.js'

const authRouter = express.Router()

const strictAuthLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 5,
    skipSuccessfulRequests : true,
    standardHeaders : true,
    legacyHeaders : false,
    message : { message : "Too many attempts, please try again later" }
})

authRouter.post('/register', strictAuthLimiter, registerHandler)
authRouter.post('/login', strictAuthLimiter, loginHandler)
authRouter.get('/verify-email',verifyEmailHandler)
authRouter.post('/refresh', refreshHandler)
authRouter.post('/logout',logoutHandler)
authRouter.post('/forgot-password', strictAuthLimiter, forgotPasswordhandler)
authRouter.post('/reset-password', strictAuthLimiter, resetPasswordHandler)

export default authRouter