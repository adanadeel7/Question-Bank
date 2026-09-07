import express from "express"
import { createQuestionHandler } from "../controller/createQuestion.controllers.js"
import { protect } from "../middlewares/auth.middleware.js"
import { requireAdmin } from "../middlewares/admin.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"

const questionRouter = express.Router()

questionRouter.post(
    "/",
    protect,
    requireAdmin,
    upload.fields([
        { name: "content", maxCount: 1 },
        { name: "marking_scheme", maxCount: 1 },
    ]),
    createQuestionHandler,
)

export default questionRouter
