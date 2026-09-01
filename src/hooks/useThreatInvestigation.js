import { useCallback, useEffect, useState } from "react";
import { getThreats } from "../services/threatService";
import { getLogs } from "../services/logService";
import { estimateConfidence, buildFallbackTimeline, DETECTION_MODEL_LABEL } from "../data/threatInvestigationMock";

export function useThreatInvestigation(threatId) {
  const [state, setState] = useState({ threat: null, timeline: [], loading: true, error: null, timelineSource: "mock" });
  const [investigationStatus, setInvestigationStatus] = useState("new");
  const [actionLog, setActionLog] = useState([]);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    const threatsRes = await getThreats({ limit: 200, group_incidents: true });
    const threat = threatsRes.data.items.find((t) => t.id === threatId) || null;

    if (!threat) {
      setState({ threat: null, timeline: [], loading: false, error: "Threat not found in the current window.", timelineSource: "mock" });
      return;
    }

    setInvestigationStatus(threat.status || "new");

    // Try to build a REAL timeline from actual logged events for this IP,
    // rather than only ever showing a synthesized one.
    let timeline = [];
    let timelineSource = "mock";
    if (threat.ip && threat.ip !== "—") {
      const logsRes = await getLogs({ search: threat.ip, page: 1, page_size: 15 });
      if (logsRes.source === "live" && logsRes.data.items.length) {
        timeline = logsRes.data.items
          .slice()
          .reverse()
          .map((l) => ({ id: l.id, label: l.eventType, timestamp: l.timestamp }));
        timelineSource = "live";
      }
    }
    if (!timeline.length) timeline = buildFallbackTimeline(threat);

    setState({
      threat: {
        ...threat,
        confidence: estimateConfidence(threat.riskScore),
        detectionModel: DETECTION_MODEL_LABEL,
        firstSeen: timeline[0]?.timestamp || threat.lastSeen,
      },
      timeline,
      loading: false,
      error: threatsRes.error,
      timelineSource,
    });
  }, [threatId]);

  useEffect(() => {
    load();
  }, [load]);

  // Local-only state changes, as required -- no PATCH /alerts/{id}/status
  // call yet. Wiring that in later is a one-line change right here.
  const applyAction = useCallback((newStatus, label) => {
    setInvestigationStatus(newStatus);
    setActionLog((prev) => [{ id: `act-${Date.now()}`, label, timestamp: new Date().toISOString() }, ...prev]);
  }, []);

  return { ...state, investigationStatus, actionLog, applyAction, retry: load };
}