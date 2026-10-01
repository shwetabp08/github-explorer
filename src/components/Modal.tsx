import { useEffect, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="p-3 w-100"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          maxWidth: 420,
          maxHeight: "85vh",
          overflow: "visible",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="h6 fw-bold mb-0 mono text-secondary-custom d-flex align-items-center gap-2">
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", color: "var(--text-muted)" }}
          >
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}