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

import Jarvis from "./pages/Jarvis";
import StubPage from "./pages/StubPage";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* JARVIS AI Assistant */}
        <Route path="/jarvis" element={<Jarvis />} />

        {/* Protected SIEM Dashboard */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          {/* Default */}
          <Route
            index
            element={<Navigate to="/overview" replace />}
          />

          {/* SIEM Pages */}
          <Route path="overview" element={<Overview />} />
          <Route path="threats" element={<Threats />} />
          <Route
            path="threats/:id"
            element={<ThreatInvestigation />}
          />
          <Route
            path="fraud-detection"
            element={<FraudDetection />}
          />
          <Route
            path="user-behavior"
            element={<UserBehavior />}
          />
          <Route
            path="admin-activity"
            element={<AdminActivity />}
          />
          <Route
            path="ai-insights"
            element={<AIInsightsHub />}
          />
          <Route path="logs" element={<Logs />} />

          {/* API Diagnostics */}
          <Route
            path="diagnostics"
            element={<ApiDiagnostics />}
          />

          {/* Unknown protected route */}
          <Route
            path="*"
            element={<Navigate to="/overview" replace />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}