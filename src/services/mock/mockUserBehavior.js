// [MOCK FALLBACK] — shape matches GET /user-behavior
export const mockUserBehaviorRaw = {
  results: [
    { _id: "ub1", timestamp: "2026-08-30T13:10:00Z", user_id: "cust_5583", ip: "192.0.2.10", event_type: "login", risk_level: "low" },
    { _id: "ub2", timestamp: "2026-08-30T13:08:00Z", user_id: "cust_5583", ip: "192.0.2.10", event_type: "checkout", risk_level: "medium" },
  ],
};