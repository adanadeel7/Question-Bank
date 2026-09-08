import express from "express"
import {
    createQuestionHandler,
    reviewQuestionHandler,
    updateQuestionHandler,
    deleteQuestionHandler,
} from "../controller/createQuestion.controllers.js"
import { protect } from "../middlewares/auth.middleware.js"
import { requireAdmin } from "../middlewares/admin.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"

const questionRouter = express.Router()

const questionImages = upload.fields([
    { name: "content", maxCount: 1 },
    { name: "marking_scheme", maxCount: 1 },
])

questionRouter.post("/", protect, requireAdmin, questionImages, createQuestionHandler)
questionRouter.put("/:id", protect, requireAdmin, questionImages, updateQuestionHandler)
questionRouter.patch("/:id/review", protect, requireAdmin, reviewQuestionHandler)
questionRouter.delete("/:id", protect, requireAdmin, deleteQuestionHandler)

export default questionRouter
