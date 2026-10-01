import { useState } from "react";
import { FiStar, FiGitBranch, FiExternalLink, FiChevronDown, FiLock } from "react-icons/fi";
import type { GithubRepo } from "../types/github";
import { languageColor } from "../utils/languageColors";
import { useRepoReadme } from "../hooks/useRepoReadme";
import ReadmeViewer from "./ReadmeViewer";

interface RepoCardProps {
  repo: GithubRepo;
  ownerLogin: string;
  isTopRepo?: boolean;
}

export default function RepoCard({ repo, ownerLogin, isTopRepo: _isTopRepo = false }: RepoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { content, loading, error } = useRepoReadme(expanded ? `${ownerLogin}/${repo.name}` : null);

  return (
    <div
      className="h-100 d-flex flex-column"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      {/* faux terminal titlebar */}
      <div
        className="d-flex align-items-center gap-2 px-3 py-2"
        style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
        <span className="mono text-truncate ms-1 flex-grow-1" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
          {repo.name}
        </span>
        {repo.private && (
          <span className="d-flex align-items-center gap-1 mono text-accent flex-shrink-0" style={{ fontSize: "0.65rem" }}>
            <FiLock size={10} /> private
          </span>
        )}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${repo.name} on GitHub`}
          className="text-muted-custom flex-shrink-0"
        >
          <FiExternalLink size={12} />
        </a>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <p className="text-secondary-custom mb-3 flex-grow-1" style={{ fontSize: "0.85rem", minHeight: "2.6em" }}>
          {repo.description || "No description provided."}
        </p>

        <div className="d-flex align-items-center justify-content-between mono" style={{ fontSize: "0.75rem" }}>
          <div className="d-flex align-items-center gap-1 text-secondary-custom">
            {repo.language && (
              <>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: languageColor(repo.language),
                    display: "inline-block",
                  }}
                />
                {repo.language}
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-3 text-muted-custom">
            <span className="d-flex align-items-center gap-1">
              <FiStar size={12} /> {repo.stargazers_count}
            </span>
            <span className="d-flex align-items-center gap-1">
              <FiGitBranch size={12} /> {repo.forks_count}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="d-flex align-items-center justify-content-center gap-1 mt-3 mono"
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text-muted)",
            fontSize: "0.72rem",
            padding: "0.35rem 0",
          }}
        >
          {expanded ? "hide readme" : "view readme"}
          <FiChevronDown
            size={12}
            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </button>

        {expanded && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)", maxHeight: 260, overflowY: "auto" }}>
            {loading && (
              <div className="mono text-muted-custom" style={{ fontSize: "0.78rem" }}>
                loading readme...
              </div>
            )}
            {error && (
              <div className="mono text-muted-custom" style={{ fontSize: "0.78rem" }}>
                no readme found for this repo.
              </div>
            )}
            {content && <ReadmeViewer markdown={content} />}
          </div>
        )}
      </div>
    </div>
  );
}
