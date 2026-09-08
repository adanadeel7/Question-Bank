import { getQuestionsRequest, type ApiQuestion } from "./api";

export async function buildDrillQuestions(topicValues: string[], limit = 8): Promise<ApiQuestion[]> {
  const results = await Promise.all(
    topicValues.map((v) => getQuestionsRequest({ topics: [v], unseen: true })),
  );
  const pool: ApiQuestion[] = results.flatMap((r) => r.questions);
  return pool.slice(0, limit);
}
