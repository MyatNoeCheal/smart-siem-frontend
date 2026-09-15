/* npm run dev */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./layouts/AppShell";
import RequireAuth from "./components/RequireAuth";

const Overview = lazy(() => import("./pages/Overview"));
const Threats = lazy(() => import("./pages/Threats"));
const ThreatInvestigation = lazy(() => import("./pages/ThreatInvestigation"));
const FraudDetection = lazy(() => import("./pages/FraudDetection"));
const UserBehavior = lazy(() => import("./pages/UserBehavior"));
const AdminActivity = lazy(() => import("./pages/AdminActivity"));
const Logs = lazy(() => import("./pages/Logs"));
const AIInsightsHub = lazy(() => import("./pages/AIInsightsHub"));
const Login = lazy(() => import("./pages/Login"));
const ApiDiagnostics = lazy(() => import("./pages/dev/ApiDiagnostics"));
const Jarvis = lazy(() => import("./pages/Jarvis"));

function RouteLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center font-mono text-[11px] uppercase tracking-wider text-navy-400">
      Loading workspace...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<RouteLoading />}>
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
      </Suspense>
    </BrowserRouter>
  );
}