import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.routes'
import questionRouter from './routes/createQuestionAdmin.routes.js'
import userquestionRouter from './routes/createQuestionUser.js'
import attemptRouter from './routes/attempts.routes.js'
import meRouter from './routes/me.routes.js'
import historyRouter from './routes/history.routes.js'

const app = express()

app.use(cors({
    origin : process.env.APP_URL,
    credentials : true,
}))
app.use(express.json())
app.use(cookieParser())

// Auth endpoints are brute-force targets (login especially), so they get a tight, dedicated budget.
const authLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false
})

// Everything else is normal app usage (practicing questions fires many legitimate requests),
// so it gets a much looser budget — this just guards against abuse, not real usage.
const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 1000,
    standardHeaders : true,
    legacyHeaders : false
})

app.use(apiLimiter)


app.get('/health', (req,res) => {
    res.json({status : 'ok'})
})

app.use('/auth',authLimiter,authRouter)
app.use('/admin/questions', questionRouter)
app.use('/questions',userquestionRouter)
app.use('/attempts',attemptRouter)
app.use('/me',meRouter)
app.use('/history',historyRouter)


export default app; 