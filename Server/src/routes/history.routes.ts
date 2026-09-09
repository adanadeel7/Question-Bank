import express from "express"
import { historyHandler } from "../controller/History.controllers.js"
import { protect } from "../middlewares/auth.middleware.js"

const historyRouter = express.Router()

historyRouter.get("/", protect, historyHandler)

export default historyRouter
