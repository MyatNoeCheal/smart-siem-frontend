import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Overview from "./pages/Overview";
import ThreatInvestigation from "./pages/ThreatInvestigation";
import FraudDetection from "./pages/FraudDetection";
import UserBehavior from "./pages/UserBehavior";
import AIAssistant from "./pages/AIAssistant";
import PlaceholderPage from "./pages/PlaceholderPage";
import ApiDiagnostics from "./pages/dev/ApiDiagnostics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route
            path="threats"
            element={<PlaceholderPage title="Threats" subtitle="Correlated threat & incident queue" />}
          />
          <Route path="threats/:id" element={<ThreatInvestigation />} />
          <Route path="fraud-detection" element={<FraudDetection />} />
          <Route path="user-behavior" element={<UserBehavior />} />
          <Route
            path="admin-activity"
            element={<PlaceholderPage title="Admin Activity" subtitle="Internal & insider misuse monitoring" />}
          />
          <Route path="ai-insights" element={<AIAssistant />} />
          <Route
            path="logs"
            element={<PlaceholderPage title="Logs" subtitle="Full raw event log" />}
          />
          <Route path="diagnostics" element={<ApiDiagnostics />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}