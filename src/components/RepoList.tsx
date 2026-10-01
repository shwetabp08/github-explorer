import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { GithubRepo, SortOption } from "../types/github";
import RepoCard from "./RepoCard";

interface RepoListProps {
  repos: GithubRepo[];
  ownerLogin: string;
  privateAccessAttempted: boolean;
}

const PAGE_SIZE = 6;

const sortOptions = [
  { value: "stars", label: "Most stars" },
  { value: "updated", label: "Recently updated" },
  { value: "name", label: "Name" },
] as const;

const visibilityOptions = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
] as const;

export default function RepoList({ repos, ownerLogin, privateAccessAttempted }: RepoListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [filter, setFilter] = useState("");
  const [visibility, setVisibility] = useState<(typeof visibilityOptions)[number]["value"]>("all");
  const [page, setPage] = useState(1);

  const topRepoId = useMemo(() => {
    if (repos.length === 0) return null;
    const top = repos.reduce((best, r) =>
      r.stargazers_count > best.stargazers_count ? r : best
    );
    return top.stargazers_count > 0 ? top.id : null;
  }, [repos]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const visibleRepos = visibility === "all"
      ? repos
      : repos.filter((repo) => visibility === "private" ? repo.private : !repo.private);
    if (!q) return visibleRepos;
    return visibleRepos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q)
    );
  }, [repos, filter, visibility]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case "stars":
        return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
      case "updated":
        return copy.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filter, sortBy, visibility, repos]);

  // Clamp in case the current page no longer exists (e.g. filter shrank results).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  return (
    <div>
      <div className="repo-toolbar d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h3 className="h6 fw-bold mb-0 mono text-secondary-custom">
          repositories <span className="text-accent">({filtered.length})</span>
        </h3>
        <div className="repo-tools d-flex align-items-center gap-2 flex-wrap">
          <div className="repo-visibility" style={{ minWidth: 150 }}>
            <Select
              instanceId="repo-visibility-select"
              options={visibilityOptions}
              value={visibilityOptions.find((option) => option.value === visibility) ?? visibilityOptions[0]}
              onChange={(option) => setVisibility(option?.value ?? "all")}
              isSearchable={false}
              styles={{
                control: (base) => ({ ...base, backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderRadius: 6, minHeight: 34, boxShadow: "none", fontSize: "0.8rem" }),
                singleValue: (base) => ({ ...base, color: "var(--text-secondary)" }),
                menu: (base) => ({ ...base, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, zIndex: 20 }),
                option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? "var(--bg-elevated)" : "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.8rem" }),
              }}
            />
          </div>
          <div
            className="repo-filter d-flex align-items-center gap-2 px-2"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              minWidth: 160,
            }}
          >
            <FiSearch size={12} className="text-muted-custom flex-shrink-0" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="filter repos..."
              className="mono flex-grow-1"
              aria-label="Filter repositories"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "0.8rem",
                padding: "0.4rem 0",
                minWidth: 0,
              }}
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter("")}
                aria-label="Clear filter"
                className="flex-shrink-0"
                style={{ background: "none", border: "none", color: "var(--text-muted)" }}
              >
                <FiX size={12} />
              </button>
            )}
          </div>

          <div className="repo-sort" style={{ minWidth: 180 }}>
            <Select
              instanceId="repo-sort-select"
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === sortBy) ?? sortOptions[0]}
              onChange={(option) => setSortBy((option?.value ?? "stars") as SortOption)}
              isSearchable={false}
              menuPlacement="bottom"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border)",
                  borderRadius: 6,
                  minHeight: 34,
                  boxShadow: "none",
                  fontSize: "0.8rem",
                }),
                singleValue: (base) => ({ ...base, color: "var(--text-secondary)" }),
                menu: (base) => ({ ...base, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, zIndex: 20 }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "var(--bg-elevated)" : "var(--bg-card)",
                  color: "var(--text-primary)",
                  fontSize: "0.8rem",
                }),
                indicatorsContainer: (base) => ({ ...base, color: "var(--text-muted)" }),
              }}
            />
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div
          className="text-center py-4 mono text-muted-custom"
          style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", fontSize: "0.82rem" }}
        >
          {visibility === "private"
            ? privateAccessAttempted
              ? "No private repositories found."
              : "GitHub cannot show private repositories without the searched user's personal token."
            : filter
              ? `no repositories match "${filter}"`
              : "No repositories found."}
        </div>
      ) : (
        <>
          <div className="row g-3">
            {paginated.map((repo) => (
              <div key={repo.id} className="col-md-6">
                <RepoCard repo={repo} ownerLogin={ownerLogin} isTopRepo={repo.id === topRepoId} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  color: "var(--text-secondary)",
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                <FiChevronLeft size={15} />
              </button>

              <span className="mono text-muted-custom" style={{ fontSize: "0.8rem" }}>
                page <span className="text-accent">{page}</span> of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  color: "var(--text-secondary)",
                  opacity: page === totalPages ? 0.4 : 1,
                }}
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}