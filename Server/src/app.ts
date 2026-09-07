import express from 'express'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.routes'
import questionRouter from './routes/createQuestion.routes.js'

const app = express()

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


export default app; 