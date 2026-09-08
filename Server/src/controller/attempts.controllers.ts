import { Request, Response } from "express";
import { Attempt } from "../models/Attempt.models.js";
import { Question } from "../models/Questions.models.js";
import { UserStats } from "../models/userStats.models.js";
import { attemptSchema } from "./attempts.schema.js";

async function createAttemptHandler(req: Request, res: Response) {
  try {
    const result = attemptSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const { question, marksScored, timeTaken } = result.data;

    const questionDoc = await Question.findById(question);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (marksScored > questionDoc.marks) {
      return res.status(400).json({
        message: `marksScored cannot exceed the question's marks (${questionDoc.marks})`,
      });
    }

    const attempt = await Attempt.create({
      user: req.user!.id,
      question,
      marksScored,
      timeTaken,
    });

    await UserStats.findOneAndUpdate(
      { user: req.user!.id },
      {
        $inc: {
          totalAttempted: 1,
          totalMarksScored: marksScored,
          totalMarksPossible: questionDoc.marks,
          [`topics.${questionDoc.topic}.attempted`]: 1,
          [`topics.${questionDoc.topic}.marksScored`]: marksScored,
          [`topics.${questionDoc.topic}.marksPossible`]: questionDoc.marks,
        },
      },
      { upsert: true },
    );

    return res.status(201).json({
      message: "Attempt recorded",
      attempt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

export { createAttemptHandler };
