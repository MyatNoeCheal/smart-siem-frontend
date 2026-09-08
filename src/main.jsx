import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AssistantChatProvider } from "./context/AssistantChatContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AssistantChatProvider>
          <App />
        </AssistantChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);