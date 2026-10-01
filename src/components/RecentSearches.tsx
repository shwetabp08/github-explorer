import { FiClock } from "react-icons/fi";

interface RecentSearchesProps {
  usernames: string[];
  onSelect: (username: string) => void;
}

export default function RecentSearches({ usernames, onSelect }: RecentSearchesProps) {
  if (usernames.length === 0) return null;

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-4 px-2">
      <span className="d-flex align-items-center gap-1 mono text-muted-custom" style={{ fontSize: "0.72rem" }}>
        <FiClock size={11} />
        recent:
      </span>
      {usernames.map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onSelect(u)}
          className="mono"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            color: "var(--text-secondary)",
            fontSize: "0.74rem",
            padding: "0.25rem 0.7rem",
          }}
        >
          @{u}
        </button>
      ))}
    </div>
  );
}