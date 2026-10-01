import { FiAlertCircle, FiGithub } from "react-icons/fi";

export function LoadingState() {
  return (
    <div className="text-center py-5 mono text-secondary-custom">
      <div
        className="mx-auto mb-3"
        style={{
          width: 28,
          height: 28,
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      fetching profile...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="text-center py-4 px-3 mx-auto mono"
      style={{
        maxWidth: 480,
        background: "rgba(255,107,107,0.08)",
        border: "1px solid rgba(255,107,107,0.3)",
        borderRadius: "var(--radius)",
        color: "var(--danger)",
      }}
    >
      <FiAlertCircle size={20} className="mb-2" />
      <div style={{ fontSize: "0.9rem" }}>{message}</div>
    </div>
  );
}

export function IdleState() {
  return (
    <div className="text-center py-4 text-muted-custom">
      <FiGithub size={28} className="mb-2" opacity={0.5} />
      <div className="mono" style={{ fontSize: "0.85rem" }}>
        try "sjha2048", "greatfrontend", or your own username
      </div>
    </div>
  );
}
