export default function ConfirmBar({ pendingAction, onConfirm, onCancel, busy }) {
  if (!pendingAction) return null;

  return (
    <div className="jarvis-confirm-bar">
      <div className="jarvis-confirm-text">
        <span className="jarvis-confirm-icon">⚠</span>
        Awaiting confirmation: <strong>{pendingAction.summary}</strong>
      </div>
      <div className="jarvis-confirm-actions">
        <button className="jarvis-confirm-btn jarvis-confirm-yes" onClick={onConfirm} disabled={busy}>
          Confirm
        </button>
        <button className="jarvis-confirm-btn jarvis-confirm-no" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
      <div className="jarvis-confirm-hint">You can also just say "confirm" or "cancel."</div>
    </div>
  );
}
