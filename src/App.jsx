import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Overview from "./pages/Overview";
import Threats from "./pages/Threats";
import ThreatInvestigation from "./pages/ThreatInvestigation";
import FraudDetection from "./pages/FraudDetection";
import UserBehavior from "./pages/UserBehavior";
import AdminActivity from "./pages/AdminActivity";
import Logs from "./pages/Logs";
import AIInsightsHub from "./pages/AIInsightsHub";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import ApiDiagnostics from "./pages/dev/ApiDiagnostics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="threats" element={<Threats />} />
          <Route path="threats/:id" element={<ThreatInvestigation />} />
          <Route path="fraud-detection" element={<FraudDetection />} />
          <Route path="user-behavior" element={<UserBehavior />} />
          <Route path="admin-activity" element={<AdminActivity />} />
          <Route path="ai-insights" element={<AIInsightsHub />} />
          <Route path="logs" element={<Logs />} />
          <Route path="diagnostics" element={<ApiDiagnostics />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}