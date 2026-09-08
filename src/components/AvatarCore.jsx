export default function AvatarCore({ listening, speaking, thinking }) {
  const state = thinking ? "thinking" : speaking ? "speaking" : listening ? "listening" : "idle";

  const label =
    state === "listening" ? "LISTENING" :
    state === "speaking" ? "SPEAKING" :
    state === "thinking" ? "PROCESSING" : "STANDBY";

  return (
    <div className="jarvis-core" data-state={state}>
      <svg viewBox="0 0 400 400" className="jarvis-core-svg">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8FE9FF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="150" fill="url(#coreGlow)" className="core-halo" />

        {[150, 118, 90].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="#38BDF8"
            strokeOpacity={0.35 - i * 0.08}
            strokeWidth="1"
            className={`core-ring core-ring-${i}`}
          />
        ))}

        <circle cx="200" cy="200" r="60" fill="none" stroke="#8FE9FF" strokeWidth="1.4" className="core-ring-inner" />
        <circle cx="200" cy="200" r="34" fill="#8FE9FF" className="core-nucleus" />
      </svg>

      <div className="jarvis-core-label">
        <span className="jarvis-core-dot" />
        {label}
      </div>
    </div>
  );
}
