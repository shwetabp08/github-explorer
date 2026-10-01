import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { useUserSearch } from "../hooks/useUserSearch";

interface UsernameAutocompleteInputProps {
  onSubmit: (username: string) => void;
  onValueChange?: (username: string) => void;
  loading?: boolean;
  placeholder?: string;
  size?: "md" | "sm";
  autoFocus?: boolean;
}

export default function UsernameAutocompleteInput({
  onSubmit,
  onValueChange,
  loading = false,
  placeholder = "octocat",
  size = "md",
  autoFocus = false,
}: UsernameAutocompleteInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions } = useUserSearch(showSuggestions ? value : "");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSubmit = (username: string) => {
    setShowSuggestions(false);
    onSubmit(username);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSubmit(value);
  };

  const handleSelect = (login: string) => {
    setValue(login);
    onValueChange?.(login);
    runSubmit(login);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex].login);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const inputPad = size === "sm" ? "0.5rem" : "0.75rem";
  const fontSize = size === "sm" ? "0.85rem" : "0.95rem";
  const btnPad = size === "sm" ? "0.9rem" : "1.5rem";

  return (
    <div ref={wrapperRef} className="position-relative w-100">
      <form onSubmit={handleSubmit} className="uac-form">
        <div
          className="uac-input-wrap d-flex align-items-center gap-2 flex-grow-1 px-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            minWidth: 140,
          }}
        >
          <span className="mono text-accent" aria-hidden="true">
            ~$
          </span>
          <input
            type="text"
            className="mono flex-grow-1"
            placeholder={placeholder}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => {
              const nextValue = e.target.value;
              setValue(nextValue);
              onValueChange?.(nextValue);
              setShowSuggestions(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            aria-label="GitHub username"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="username-suggestions"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              outline: "none",
              padding: `${inputPad} 0`,
              fontSize,
              minWidth: 0,
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="uac-submit-btn d-flex align-items-center gap-2 fw-semibold"
          style={{
            background: "var(--accent)",
            border: "1px solid var(--accent)",
            color: "#1a1a1a",
            opacity: loading || !value.trim() ? 0.6 : 1,
            flexShrink: 0,
            padding: `0 ${btnPad}`,
            fontSize,
          }}
        >
          <FiSearch size={size === "sm" ? 14 : 16} />
          {loading ? "..." : "Search"}
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="username-suggestions"
          role="listbox"
          className="list-unstyled text-start"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 8px)",
            margin: 0,
            padding: 6,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 60,
            boxShadow: "var(--shadow-card)",
          }}
        >
          {suggestions.map((s, i) => (
            <li key={s.login} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onClick={() => handleSelect(s.login)}
                onMouseEnter={() => setActiveIndex(i)}
                className="d-flex align-items-center gap-2 w-100 px-2 py-2 text-start mono"
                style={{
                  background: i === activeIndex ? "var(--bg-elevated)" : "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                }}
              >
                <img
                  src={s.avatar_url}
                  alt=""
                  width={20}
                  height={20}
                  style={{ borderRadius: "50%" }}
                />
                {s.login}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}