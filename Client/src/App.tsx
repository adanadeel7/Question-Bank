import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { TopicBrowse } from "./pages/TopicBrowse";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { PracticeSession } from "./pages/PracticeSession";
import { SessionSummary } from "./pages/SessionSummary";
import { Progress } from "./pages/Progress";
import { History } from "./pages/History";
import { TopicPicker } from "./pages/TopicPicker";
import { ProfileSettings } from "./pages/ProfileSettings";
import { NotBuiltYet } from "./pages/NotBuiltYet";
import { AdminIngestionQueue } from "./pages/admin/AdminIngestionQueue";
import { AdminQuestionEditor } from "./pages/admin/AdminQuestionEditor";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAddQuestion } from "./pages/admin/AdminAddQuestion";
import { AdminBrowseQuestions } from "./pages/admin/AdminBrowseQuestions";
import { AdminEditQuestion } from "./pages/admin/AdminEditQuestion";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/browse" element={<TopicBrowse />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session/summary"
        element={
          <ProtectedRoute>
            <SessionSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topics"
        element={
          <ProtectedRoute>
            <TopicPicker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/queue"
        element={
          <ProtectedRoute requireAdmin>
            <AdminIngestionQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/new"
        element={
          <ProtectedRoute requireAdmin>
            <AdminAddQuestion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/all"
        element={
          <ProtectedRoute requireAdmin>
            <AdminBrowseQuestions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/editor"
        element={
          <ProtectedRoute requireAdmin>
            <AdminQuestionEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/:id/edit"
        element={
          <ProtectedRoute requireAdmin>
            <AdminEditQuestion />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NotBuiltYet />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
