import { useEffect, useRef, useState } from "react";
import { FiUsers, FiCheck, FiGithub, FiShare2 } from "react-icons/fi";

interface ResultsToolbarProps {
  login: string;
  avatarUrl: string;
  showCompare: boolean;
  onToggleCompare: () => void;
}

export default function ResultsToolbar({
  login,
  avatarUrl,
  showCompare,
  onToggleCompare,
}: ResultsToolbarProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedKind, setCopiedKind] = useState<"github" | "app" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copy = async (text: string, kind: "github") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKind(kind);
      setTimeout(() => setCopiedKind(null), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between gap-2 flex-wrap px-3 py-2 mb-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
      }}
    >
      <div className="d-flex align-items-center gap-2 min-w-0">
        <img src={avatarUrl} alt="" width={22} height={22} style={{ borderRadius: "50%", flexShrink: 0 }} />
        <span className="mono text-secondary-custom text-truncate" style={{ fontSize: "0.82rem" }}>
          @{login}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0 position-relative" ref={menuRef}>
        <button
          type="button"
          onClick={onToggleCompare}
          className="d-flex align-items-center gap-1 mono"
          style={{
            background: showCompare ? "var(--accent-dim)" : "var(--bg-elevated)",
            border: `1px solid ${showCompare ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 7,
            color: showCompare ? "var(--accent)" : "var(--text-secondary)",
            fontSize: "0.78rem",
            padding: "0.4rem 0.7rem",
          }}
        >
          <FiUsers size={13} />
          Compare
        </button>

        <button
          type="button"
          onClick={() => setShowShareMenu((v) => !v)}
          className="d-flex align-items-center gap-1 mono"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            color: "var(--text-secondary)",
            fontSize: "0.78rem",
            padding: "0.4rem 0.7rem",
          }}
        >
          <FiShare2 size={13} />
          Share
        </button>

        {showShareMenu && (
          <div
            className="position-absolute end-0 mt-1 p-1"
            style={{
              top: "100%",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              minWidth: 230,
              zIndex: 30,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <button
              type="button"
              onClick={() => copy(`https://github.com/${login}`, "github")}
              className="d-flex align-items-center gap-2 w-100 px-2 py-2 text-start mono"
              style={{ background: "none", border: "none", borderRadius: 6, color: "var(--text-primary)", fontSize: "0.8rem" }}
            >
              {copiedKind === "github" ? (
                <FiCheck size={14} className="text-accent flex-shrink-0" />
              ) : (
                <FiGithub size={14} className="flex-shrink-0" />
              )}
              <span className="flex-grow-1">
                {copiedKind === "github" ? "Copied!" : "Copy GitHub profile link"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}