import express from "express"
import { registerHandler,resetPasswordHandler,loginHandler,forgotPasswordhandler,verifyEmailHandler,logoutHandler,refreshHandler } from '../controller/auth.controllers.js'

const authRouter = express.Router()

authRouter.post('/register', registerHandler)
authRouter.post('/login', loginHandler)
authRouter.get('/verify-email',verifyEmailHandler)
authRouter.post('/refresh', refreshHandler)
authRouter.post('/logout',logoutHandler)
authRouter.post('/forgot-password',forgotPasswordhandler)
authRouter.post('/reset-password',resetPasswordHandler)

export default authRouter