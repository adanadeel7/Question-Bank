const API_URL = import.meta.env.VITE_API_URL as string;

let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
}

export interface ApiUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  role: "student" | "admin";
}

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(currentAccessToken ? { Authorization: `Bearer ${currentAccessToken}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message ?? "Something went wrong", res.status, data.errors);
  }

  return data as T;
}

export function registerRequest(body: { name: string; email: string; password: string }) {
  return request<{ message: string; user: Pick<ApiUser, "id" | "email" | "isEmailVerified"> }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function loginRequest(body: { email: string; password: string }) {
  return request<{ message: string; accessToken: string; user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function refreshRequest() {
  return request<{ message: string; accessToken: string; user: ApiUser }>("/auth/refresh", {
    method: "POST",
  });
}

export function logoutRequest() {
  return request<{ message: string }>("/auth/logout", { method: "POST" });
}

export function verifyEmailRequest(token: string) {
  return request<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });
}

export interface ApiQuestion {
  _id: string;
  subject: string;
  code: number;
  year: number;
  session: string;
  variant: number;
  question_number: number;
  content: { url: string; publicId: string };
  text: string;
  topic: string;
  state: string;
  marks: number;
}

export interface GetQuestionsParams {
  topics?: string[];
  sessions?: string[];
  variants?: string[];
  from?: number;
  to?: number;
  unseen?: boolean;
}

export function getQuestionsRequest(params: GetQuestionsParams) {
  const qs = new URLSearchParams();
  params.topics?.forEach((t) => qs.append("topics", t));
  params.sessions?.forEach((s) => qs.append("sessions", s));
  params.variants?.forEach((v) => qs.append("variants", v));
  if (params.from !== undefined) qs.set("from", String(params.from));
  if (params.to !== undefined) qs.set("to", String(params.to));
  if (params.unseen !== undefined) qs.set("unseen", String(params.unseen));

  return request<{ message: string; questions: ApiQuestion[] }>(`/questions?${qs.toString()}`, {
    method: "GET",
  });
}

export function getMarkingSchemeRequest(questionId: string) {
  return request<{ message: string; marking_scheme: { url: string; publicId: string }; marks: number }>(
    `/questions/${questionId}/marking-scheme`,
    { method: "GET" },
  );
}

export function createAttemptRequest(body: { question: string; marksScored: number; timeTaken: number }) {
  return request<{ message: string; attempt: { _id: string; marksScored: number; timeTaken: number } }>(
    "/attempts",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function createQuestionRequest(formData: FormData) {
  return request<{ message: string; question: ApiQuestion }>("/admin/questions", {
    method: "POST",
    body: formData,
  });
}

export function updateQuestionRequest(id: string, formData: FormData) {
  return request<{ message: string; question: ApiQuestion }>(`/admin/questions/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteQuestionRequest(id: string) {
  return request<{ message: string }>(`/admin/questions/${id}`, {
    method: "DELETE",
  });
}

export function reviewQuestionRequest(id: string) {
  return request<{ message: string; question: ApiQuestion }>(`/admin/questions/${id}/review`, {
    method: "PATCH",
  });
}

export interface ApiTopicStats {
  attempted: number;
  marksScored: number;
  marksPossible: number;
}

export interface ApiUserStats {
  topics: Record<string, ApiTopicStats>;
  totalAttempted: number;
  totalMarksScored: number;
  totalMarksPossible: number;
}

export function getMyStatsRequest() {
  return request<{ message: string; stats: ApiUserStats }>("/me/stats", {
    method: "GET",
  });
}

export interface ApiHistoryEntry {
  _id: string;
  question: {
    _id: string;
    session: string;
    year: number;
    variant: number;
    question_number: number;
    topic: string;
    marks: number;
  };
  marksScored: number;
  timeTaken: number;
  createdAt: string;
}

export function getHistoryRequest() {
  return request<{ message: string; history: ApiHistoryEntry[] }>("/history", {
    method: "GET",
  });
}
