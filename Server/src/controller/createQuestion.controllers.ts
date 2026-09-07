import { Request, Response } from "express";
import { Question } from "../models/Questions.models.js";
import { createQuestionSchema } from "./createQuestion.schema.js";
import { uploadBufferToCloudinary } from "../config/cloudinaryUpload.js";

async function createQuestionHandler(req: Request, res: Response) {
  try {
    const result = createQuestionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const files = req.files as
      | { content?: Express.Multer.File[]; marking_scheme?: Express.Multer.File[] }
      | undefined;

    const contentFile = files?.content?.[0];
    const markingSchemeFile = files?.marking_scheme?.[0];

    if (!contentFile || !markingSchemeFile) {
      return res.status(400).json({
        message: "Both content and marking_scheme images are required",
      });
    }

    const [content, marking_scheme] = await Promise.all([
      uploadBufferToCloudinary(contentFile.buffer),
      uploadBufferToCloudinary(markingSchemeFile.buffer),
    ]);

    const question = await Question.create({
      ...result.data,
      content,
      marking_scheme,
      state: "tagged",
    });

    return res.status(201).json({
      message: "Question created",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

export { createQuestionHandler };
