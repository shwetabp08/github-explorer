import {
  FiMapPin,
  FiLink,
  FiTwitter,
  FiBriefcase,
  FiExternalLink,
  FiUsers as FiOrgIcon,
} from "react-icons/fi";
import type { GithubUser } from "../types/github";
import { useUserOrgs } from "../hooks/useUserOrgs";

interface ProfileCardProps {
  user: GithubUser;
  repoCount: number;
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ProfileCard({ user, repoCount }: ProfileCardProps) {
  const { orgs } = useUserOrgs(user.login);

  const stats = [
    { label: "Repos", value: repoCount },
    { label: "Followers", value: user.followers },
    { label: "Following", value: user.following },
  ];

  return (
    <div
      className="p-4 h-auto"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="d-flex align-items-start gap-3 mb-3">
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          width={72}
          height={72}
          crossOrigin="anonymous"
          style={{
            borderRadius: "12px",
            border: "1px solid var(--border)",
            flexShrink: 0,
          }}
        />
        <div className="flex-grow-1 min-w-0">
          <h2 className="h5 fw-bold mb-0 text-truncate">
            {user.name || user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="mono text-decoration-none d-inline-flex align-items-center gap-1"
            style={{ fontSize: "0.85rem" }}
          >
            @{user.login}
            <FiExternalLink size={12} />
          </a>
        </div>
      </div>

      {user.bio && (
        <p className="text-secondary-custom mb-3" style={{ fontSize: "0.92rem" }}>
          {user.bio}
        </p>
      )}

      <div className="d-flex flex-column gap-2 mb-3" style={{ fontSize: "0.85rem" }}>
        {user.company && (
          <div className="d-flex align-items-center gap-2 text-secondary-custom">
            <FiBriefcase size={14} className="text-accent" />
            {user.company}
          </div>
        )}
        {user.location && (
          <div className="d-flex align-items-center gap-2 text-secondary-custom">
            <FiMapPin size={14} className="text-accent" />
            {user.location}
          </div>
        )}
        {user.blog && (
          <div className="d-flex align-items-center gap-2 text-secondary-custom text-truncate">
            <FiLink size={14} className="text-accent" />
            <a
              href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noreferrer"
              className="text-truncate"
            >
              {user.blog}
            </a>
          </div>
        )}
        {user.twitter_username && (
          <div className="d-flex align-items-center gap-2 text-secondary-custom">
            <FiTwitter size={14} className="text-accent" />@{user.twitter_username}
          </div>
        )}
      </div>

      {orgs.length > 0 && (
        <div className="mb-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div
            className="d-flex align-items-center gap-1 mono text-muted-custom mb-2"
            style={{ fontSize: "0.7rem" }}
          >
            <FiOrgIcon size={11} />
            organizations
          </div>
          <div className="d-flex flex-wrap gap-2">
            {orgs.map((org) => (
              <a
                key={org.login}
                href={`https://github.com/${org.login}`}
                target="_blank"
                rel="noreferrer"
                title={org.login}
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={org.avatar_url}
                  alt={org.login}
                  width={30}
                  height={30}
                  crossOrigin="anonymous"
                  style={{ objectFit: "cover" }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div
        className="d-flex justify-content-between pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="mono fw-bold text-accent" style={{ fontSize: "1.1rem" }}>
              {s.value.toLocaleString()}
            </div>
            <div className="text-muted-custom" style={{ fontSize: "0.72rem" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mono text-muted-custom mt-3 pt-2"
        style={{ fontSize: "0.72rem", borderTop: "1px solid var(--border)" }}
      >
        joined {formatJoinDate(user.created_at)}
      </div>
    </div>
  );
}