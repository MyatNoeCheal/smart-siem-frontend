import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Overview from "./pages/Overview";
import Threats from "./pages/Threats";
import Cases from "./pages/Cases";
import Fraud from "./pages/Fraud";
import AIInsights from "./pages/AIInsights";
import StubPage from "./pages/StubPage";
import { getStoredAuth, clearStoredAuth } from "./lib/api";

export default function App() {
  const [auth, setAuth] = useState(getStoredAuth());

  if (!auth) {
    return <Login onSuccess={(user) => setAuth({ user })} />;
  }

  function logout() {
    clearStoredAuth();
    setAuth(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout currentUser={auth.user} onLogout={logout} />}>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/fraud" element={<Fraud />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          {/* Not built out yet -- JARVIS can still navigate here, it just
              shows a placeholder instead of real data for now. */}
          <Route path="/:page" element={<StubPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
