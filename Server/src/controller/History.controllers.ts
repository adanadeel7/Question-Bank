import { Request, Response } from "express";
import { History } from "../models/History.models.js";

async function historyHandler(req: Request, res: Response) {
  try {
    const findUser = await History.find({ user: req.user!.id })
      .sort({ createdAt: -1 })
      .populate("question", "session year variant question_number topic marks");

    return res.status(200).json({
      message: "History found",
      history: findUser,
    });
  } catch (error) {
    console.log(error)
        return res.status(500).json({message : "Internal Error"})
  }
}

export {historyHandler}