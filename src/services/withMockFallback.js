const MOCK_TAG = "[MOCK FALLBACK]";

/**
 * Runs `liveCall`; if it throws (backend down, endpoint not built
 * yet, network error), logs a clearly-labeled console warning and
 * returns `mockData` instead. The caller always gets back the same
 * { raw, source, error } shape regardless of which path was taken.
 */
export async function withMockFallback(liveCall, mockData, context) {
  try {
    const raw = await liveCall();
    return { raw, source: "live", error: null };
  } catch (err) {
    console.warn(`${MOCK_TAG} ${context} — live request failed (${err.message}). Using mock data.`);
    return { raw: mockData, source: "mock", error: err.message };
  }
}