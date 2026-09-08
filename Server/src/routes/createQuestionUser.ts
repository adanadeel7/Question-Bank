import express from "express"
import { getQuestionHandler, getMarkingSchemeHandler } from "../controller/createQuestion.controllers.js"
import { protect } from "../middlewares/auth.middleware.js"

const userquestionRouter = express.Router()

userquestionRouter.get('/',protect,getQuestionHandler)
userquestionRouter.get('/:id/marking-scheme', protect, getMarkingSchemeHandler)

export default userquestionRouter