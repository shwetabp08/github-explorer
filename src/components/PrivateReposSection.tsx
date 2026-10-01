import { FiLock } from "react-icons/fi";
import type { GithubRepo } from "../types/github";
import RepoCard from "./RepoCard";

interface PrivateReposSectionProps {
  privateRepos: GithubRepo[] | null;
  privateAccessible: boolean;
  ownerLogin: string;
}

export default function PrivateReposSection({
  privateRepos,
  privateAccessible,
  ownerLogin,
}: PrivateReposSectionProps) {
  if (!privateAccessible) {
    return (
      <div
        className="d-flex align-items-start gap-2 p-3 mt-3"
        style={{
          background: "var(--bg-elevated)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius)",
        }}
      >
        <FiLock size={16} className="text-muted-custom mt-1 flex-shrink-0" />
        <p className="mb-0 text-muted-custom" style={{ fontSize: "0.8rem" }}>
          Private repositories aren't shown. GitHub only ever lets an
          account's owner view them — add your personal access token above
          if this is your own profile.
        </p>
      </div>
    );
  }

  if (privateRepos && privateRepos.length === 0) {
    return (
      <div
        className="d-flex align-items-center gap-2 p-3 mt-3"
        style={{
          background: "var(--bg-elevated)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius)",
        }}
      >
        <FiLock size={16} className="text-muted-custom flex-shrink-0" />
        <p className="mb-0 text-muted-custom" style={{ fontSize: "0.8rem" }}>
          No private repositories on this account.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="h6 fw-bold mb-3 mono text-secondary-custom d-flex align-items-center gap-2">
        <FiLock size={14} className="text-accent" />
        private repositories <span className="text-accent">({privateRepos?.length ?? 0})</span>
      </h3>
      <div className="row g-3">
        {privateRepos?.map((repo) => (
          <div key={repo.id} className="col-md-6 col-lg-4">
            <RepoCard repo={repo} ownerLogin={ownerLogin} />
          </div>
        ))}
      </div>
    </div>
  );
}
