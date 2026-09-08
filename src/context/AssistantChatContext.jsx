import { createContext, useContext, useState } from "react";

const AssistantChatContext = createContext(null);

const STARTER_REPLY =
  "Online. I can read SIEM posture, alerts, logs, entity risk, and predictive risk. Ask me for a threat brief, correlation, case notes, or an investigation plan.";

// Lives ABOVE the router so the conversation survives navigating to a
// different page, or switching the AI Insights tab (Model Insights <->
// AI Assistant) -- both of those unmount AIAssistant.jsx, and a plain
// useState inside it would lose everything each time. This context is
// in-memory only for the session -- refreshing the browser still clears
// it, same as any client-side-only state.
export function AssistantChatProvider({ children }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: STARTER_REPLY }]);
  const [lastResult, setLastResult] = useState(null);

  const resetChat = () => {
    setMessages([{ role: "assistant", content: STARTER_REPLY }]);
    setLastResult(null);
  };

  return (
    <AssistantChatContext.Provider value={{ messages, setMessages, lastResult, setLastResult, resetChat }}>
      {children}
    </AssistantChatContext.Provider>
  );
}

export function useAssistantChat() {
  const ctx = useContext(AssistantChatContext);
  if (!ctx) throw new Error("useAssistantChat must be used inside AssistantChatProvider");
  return ctx;
}