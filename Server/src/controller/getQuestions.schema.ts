import { z } from 'zod'
import { TOPICS } from '../models/Questions.models.js'

const multiSelect = z.union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]))

const topicList = z.union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]))
  .pipe(z.array(z.enum(TOPICS)))

const getQuestionsSchema = z.object({
    topics: topicList,
    sessions: multiSelect,
    variants: multiSelect,
    from: z.coerce.number().optional(),
    to: z.coerce.number().optional(),
    unseen: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
})

export { getQuestionsSchema }
export type GetQuestionsQuery = z.infer<typeof getQuestionsSchema>
