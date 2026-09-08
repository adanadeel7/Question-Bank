import { Request, Response } from "express";
import { Question } from "../models/Questions.models.js";
import { Attempt } from "../models/Attempt.models.js";
import { createQuestionSchema, updateQuestionSchema } from "./createQuestion.schema.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinaryUpload.js";
import { getQuestionsSchema } from "./getQuestions.schema.js";
import { QueryFilter } from "mongoose";
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


async function getQuestionHandler(req : Request, res : Response) {
  const result = getQuestionsSchema.safeParse(req.query)

  if(!result.success) { 
    return res.status(400).json({
      message : "Invalid Date",
      errors : result.error.flatten()
    })
  }

  const {topics,sessions,variants,from,to,unseen} = result.data
   const filter: QueryFilter<typeof Question> = {};

  if (topics.length > 0) {
    filter.topic = {$in : topics}

  }

  if (sessions.length > 0) {
    filter.session = {$in : sessions}

  }

  if (variants.length > 0) { 
    filter.variant = {$in : variants.map(Number)}
  } 

  if(from !== undefined || to !== undefined ) { 
    filter.year = {}

    if(from !== undefined) filter.year.$gte = from; 
    if(to !== undefined) filter.year.$lte = to;
  }

try{
  if (unseen) {
    const attemptedIds = await Attempt.distinct("question", {
      user : req.user!.id
    })
    filter._id = { $nin : attemptedIds }
  }

 const questions = await Question.find(filter).select('-marking_scheme')
  return res.status(200).json({
    message: "Question found",
      questions, 
  })
} catch(error) { 
  console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}


async function getMarkingSchemeHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      message: "Invalid question id",
    });
  }

  try {
    const question = await Question.findById(id).select("marking_scheme marks");

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    return res.status(200).json({
      message: "Marking scheme found",
      marking_scheme: question.marking_scheme,
      marks: question.marks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function reviewQuestionHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      message: "Invalid question id",
    });
  }

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { state: "reviewed" },
      { new: true },
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    return res.status(200).json({
      message: "Question marked reviewed",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function updateQuestionHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      message: "Invalid question id",
    });
  }

  try {
    const result = updateQuestionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const existing = await Question.findById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const files = req.files as
      | { content?: Express.Multer.File[]; marking_scheme?: Express.Multer.File[] }
      | undefined;

    const contentFile = files?.content?.[0];
    const markingSchemeFile = files?.marking_scheme?.[0];

    const updateData: Record<string, unknown> = { ...result.data };

    if (contentFile) {
      const newContent = await uploadBufferToCloudinary(contentFile.buffer);
      await deleteFromCloudinary(existing.content.publicId);
      updateData.content = newContent;
    }

    if (markingSchemeFile) {
      const newMarkingScheme = await uploadBufferToCloudinary(markingSchemeFile.buffer);
      await deleteFromCloudinary(existing.marking_scheme.publicId);
      updateData.marking_scheme = newMarkingScheme;
    }

    const question = await Question.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      message: "Question updated",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function deleteQuestionHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      message: "Invalid question id",
    });
  }

  try {
    const existing = await Question.findById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    await Promise.all([
      deleteFromCloudinary(existing.content.publicId),
      deleteFromCloudinary(existing.marking_scheme.publicId),
    ]);

    await Question.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Question deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

export {
  createQuestionHandler,
  getQuestionHandler,
  getMarkingSchemeHandler,
  reviewQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
};
