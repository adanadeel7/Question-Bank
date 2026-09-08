import express from "express"
import { createAttemptHandler } from "../controller/attempts.controllers.js"
import { protect } from "../middlewares/auth.middleware.js"

const attemptRouter = express.Router()

attemptRouter.post("/", protect, createAttemptHandler)

export default attemptRouter
