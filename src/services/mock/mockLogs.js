// [MOCK FALLBACK] — shape matches GET /logs
export const mockLogsRaw = {
  results: Array.from({ length: 10 }, (_, i) => ({
    _id: `log-${i}`,
    timestamp: new Date(Date.now() - i * 5 * 60000).toISOString(),
    ip: `198.51.100.${10 + i}`,
    event_type: ["login", "browse", "checkout", "failed_login"][i % 4],
    severity: ["low", "low", "medium", "high"][i % 4],
  })),
  total: 4820,
  page: 1,
  total_pages: 193,
};