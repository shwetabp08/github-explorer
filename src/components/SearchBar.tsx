import { useState } from "react";
import { FiGithub, FiKey, FiChevronDown, FiX } from "react-icons/fi";
import UsernameAutocompleteInput from "./UsernameAutocompleteInput";

interface SearchBarProps {
  onSearch: (username: string, token: string) => void;
  loading: boolean;
  searched: boolean;
  onClear: () => void;
}

export default function SearchBar({ onSearch, loading, searched, onClear }: SearchBarProps) {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [username, setUsername] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const handleClear = () => {
    setToken("");
    setUsername("");
    setShowToken(false);
    setInputKey((key) => key + 1);
    onClear();
  };

  const submitToken = () => {
    if (username.trim() && token.trim()) {
      onSearch(username, token);
    }
  };

  return (
    <div className="text-center px-2">
      <div
        className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill mono"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        <FiGithub size={13} />
        <span>profile-explorer / v1.3</span>
      </div>

      <h1
        className="search-heading fw-bold mb-4"
        style={{ fontSize: "clamp(1.35rem, 3.6vw, 2.2rem)", letterSpacing: "-0.02em", lineHeight: 1.2 }}
      >
        Look up any developer, <span className="text-accent">right from the source.</span>
      </h1>

      <div className="search-controls mx-auto d-flex align-items-stretch gap-2" style={{ maxWidth: 480 }}>
        <div className="flex-grow-1 min-w-0">
          <UsernameAutocompleteInput
            key={inputKey}
            onSubmit={(u) => onSearch(u, token)}
            onValueChange={setUsername}
            loading={loading}
            autoFocus
          />
        </div>

        {searched && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search and return to start"
            title="Clear"
            className="search-clear d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 42,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-secondary)",
            }}
          >
            <FiX size={17} />
          </button>
        )}
      </div>

      <div className="mx-auto my-2" style={{ maxWidth: 440 }}>
        <button
          type="button"
          onClick={() => setShowToken((v) => !v)}
          className="d-inline-flex align-items-center gap-1 mono text-muted-custom"
          style={{ background: "none", border: "none", fontSize: "0.72rem" }}
        >
          <FiKey size={11} />
          view your own private repos
          <FiChevronDown
            size={11}
            style={{ transform: showToken ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </button>

        {showToken && (
          <div className="mt-2 text-start">
            <input
              type="password"
              placeholder="ghp_... (personal access token)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitToken();
                }
              }}
              className="mono w-100 px-3 py-2"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: "0.8rem",
              }}
            />
            <p className="text-muted-custom mt-2 mb-0" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
              Only works when the token belongs to the username you search — GitHub
              never allows anyone to see another account's private repos. Stays in
              this tab, sent only to api.github.com, never stored or logged.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}