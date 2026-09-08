import { z } from 'zod'

const attemptSchema = z.object({
    question: z.string().regex(/^[0-9a-fA-F]{24}$/),
    marksScored: z.number().min(0),
    timeTaken: z.number().min(0),
})

export { attemptSchema }
