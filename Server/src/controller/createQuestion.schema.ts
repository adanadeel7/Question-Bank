import { z } from 'zod'
import { TOPICS } from '../models/Questions.models.js'

const createQuestionSchema = z.object({
    subject: z.string(),
    code: z.coerce.number(),
    year: z.coerce.number(),
    session: z.string(),
    variant: z.coerce.number(),
    question_number: z.coerce.number(),
    topic: z.enum(TOPICS),
    marks: z.coerce.number(),
    text: z.string().min(1),
})

const updateQuestionSchema = createQuestionSchema.partial()

export { createQuestionSchema, updateQuestionSchema }
