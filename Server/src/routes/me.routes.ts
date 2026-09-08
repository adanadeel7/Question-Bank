import express from "express"
import { getMyStatsHandler } from "../controller/me.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const meRouter = express.Router()

meRouter.get("/stats", protect, getMyStatsHandler)

export default meRouter
