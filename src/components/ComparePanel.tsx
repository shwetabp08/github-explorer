import { FiUsers } from "react-icons/fi";
import { useGithubProfile } from "../hooks/useGithubProfile";
import UsernameAutocompleteInput from "./UsernameAutocompleteInput";
import Modal from "./Modal";

interface ComparePanelProps {
  primaryLogin: string;
  primaryFollowers: number;
  primaryPublicRepos: number;
  primaryTotalStars: number;
  onClose: () => void;
}

function StatRow({ label, a, b }: { label: string; a: number; b: number }) {
  const aWins = a > b;
  const bWins = b > a;
  return (
    <div className="d-flex align-items-center justify-content-between py-2" style={{ fontSize: "0.85rem" }}>
      <span className="mono fw-bold" style={{ color: aWins ? "var(--accent)" : "var(--text-secondary)" }}>
        {a.toLocaleString()}
      </span>
      <span className="text-muted-custom" style={{ fontSize: "0.72rem" }}>
        {label}
      </span>
      <span className="mono fw-bold" style={{ color: bWins ? "var(--accent)" : "var(--text-secondary)" }}>
        {b.toLocaleString()}
      </span>
    </div>
  );
}

export default function ComparePanel({
  primaryLogin,
  primaryFollowers,
  primaryPublicRepos,
  primaryTotalStars,
  onClose,
}: ComparePanelProps) {
  const { user, repos, loading, error, searched, fetchProfile } = useGithubProfile();

  const totalStars = repos.reduce((sum, x) => sum + x.stargazers_count, 0);

  return (
    <Modal
      onClose={onClose}
      title={
        <>
          <FiUsers size={14} className="text-accent" />
          compare with
        </>
      }
    >
      {!user && (
        <UsernameAutocompleteInput
          onSubmit={(u) => fetchProfile(u)}
          loading={loading}
          placeholder="second username"
          size="sm"
          autoFocus
        />
      )}

      {searched && error && (
        <div className="mono mt-2" style={{ fontSize: "0.8rem", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {user && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3 mt-1">
            <span className="mono text-accent" style={{ fontSize: "0.85rem" }}>
              @{primaryLogin}
            </span>
            <span className="mono text-muted-custom" style={{ fontSize: "0.75rem" }}>
              vs
            </span>
            <div className="d-flex align-items-center gap-2">
              <img src={user.avatar_url} alt="" width={24} height={24} style={{ borderRadius: "50%" }} />
              <span className="mono text-accent" style={{ fontSize: "0.85rem" }}>
                @{user.login}
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            <StatRow label="followers" a={primaryFollowers} b={user.followers} />
            <StatRow label="public repos" a={primaryPublicRepos} b={user.public_repos} />
            <StatRow label="total stars" a={primaryTotalStars} b={totalStars} />
          </div>
          <p className="text-muted-custom mono mt-2 mb-0" style={{ fontSize: "0.7rem" }}>
            @{primaryLogin} on the left, @{user.login} on the right — highlighted number is the higher one
          </p>
        </div>
      )}
    </Modal>
  );
}