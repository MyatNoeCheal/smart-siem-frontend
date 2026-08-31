import { useCallback, useRef, useState } from "react";
import { createScriptedAttackSource } from "../simulation/AttackSimulationSource";
import { LOGIN_TO_DB_ATTACK } from "../simulation/attackScenarios";

export const SIM_STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  DETECTED: "detected",
};

export function useAttackSimulation(scenario = LOGIN_TO_DB_ATTACK) {
  const [status, setStatus] = useState(SIM_STATUS.IDLE);
  const [stage, setStage] = useState(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [nodeOverrides, setNodeOverrides] = useState({});
  const [pathHighlighted, setPathHighlighted] = useState(false);
  const [detectedThreat, setDetectedThreat] = useState(null);
  const [cameraPulse, setCameraPulse] = useState(0);

  const sourceRef = useRef(null);

  const reset = useCallback(() => {
    sourceRef.current?.stop();
    sourceRef.current = null;
    setStatus(SIM_STATUS.IDLE);
    setStage(null);
    setStageIndex(0);
    setNodeOverrides({});
    setPathHighlighted(false);
    setDetectedThreat(null);
  }, []);

  const start = useCallback(() => {
    reset();
    setStatus(SIM_STATUS.RUNNING);

    const source = createScriptedAttackSource(scenario);
    sourceRef.current = source;

    source.subscribe(({ stage: s }) => {
      setStage(s);
      setStageIndex(scenario.stages.findIndex((x) => x.key === s.key) + 1);

      if (s.nodeUpdates) {
        setNodeOverrides((prev) => {
          const next = { ...prev };
          s.nodeUpdates.forEach((u) => {
            next[u.nodeId] = { threatLevel: u.threatLevel, riskScore: u.riskScore };
          });
          return next;
        });
      }

      if (s.highlightPath) setPathHighlighted(true);

      if (s.detected) {
        setStatus(SIM_STATUS.DETECTED);
        setCameraPulse((c) => c + 1);
        setDetectedThreat({
          threatType: scenario.threat.type,
          user: scenario.threat.user,
          riskScore: scenario.threat.finalRiskScore,
          aiModel: scenario.threat.aiModel,
          confidence: scenario.threat.confidence,
          timestamp: new Date().toISOString(),
          path: scenario.path.nodeIds,
        });
      }
    });

    source.start();
  }, [scenario, reset]);

  return {
    status,
    stage,
    stageIndex,
    stageCount: scenario.stages.length,
    nodeOverrides,
    attackEdgeIds: pathHighlighted ? scenario.path.edgeIds : [],
    detectedThreat,
    cameraPulse,
    isRunning: status === SIM_STATUS.RUNNING,
    isDetected: status === SIM_STATUS.DETECTED,
    isIdle: status === SIM_STATUS.IDLE,
    start,
    reset,
  };
}