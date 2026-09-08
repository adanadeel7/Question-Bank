import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.routes'
import questionRouter from './routes/createQuestionAdmin.routes.js'
import userquestionRouter from './routes/createQuestionUser.js'
import attemptRouter from './routes/attempts.routes.js'

const app = express()

app.use(cors({
    origin : process.env.APP_URL,
    credentials : true,
}))
app.use(express.json())
app.use(cookieParser())

const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false
})

app.use(apiLimiter)


app.get('/health', (req,res) => {
    res.json({status : 'ok'})
})

app.use('/auth',authRouter)
app.use('/admin/questions', questionRouter)
app.use('/questions',userquestionRouter)
app.use('/attempts',attemptRouter)


export default app; 