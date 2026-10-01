import { FiGitCommit, FiStar, FiGitPullRequest, FiAlertCircle, FiFolderPlus, FiActivity } from "react-icons/fi";
import type { ReactElement } from "react";
import type { GithubEvent } from "../types/github";
import { timeAgo } from "../utils/timeAgo";

interface ActivityFeedProps {
  events: GithubEvent[];
  loading: boolean;
}

function describeEvent(event: GithubEvent): { icon: ReactElement; text: string } {
  const repo = event.repo.name;
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload.commits?.length ?? 1;
      return {
        icon: <FiGitCommit size={14} className="text-accent" />,
        text: `pushed ${count} commit${count > 1 ? "s" : ""} to ${repo}`,
      };
    }
    case "WatchEvent":
      return { icon: <FiStar size={14} className="text-accent" />, text: `starred ${repo}` };
    case "CreateEvent":
      return {
        icon: <FiFolderPlus size={14} className="text-accent" />,
        text: `created ${event.payload.ref_type ?? "repository"} in ${repo}`,
      };
    case "PullRequestEvent":
      return {
        icon: <FiGitPullRequest size={14} className="text-accent" />,
        text: `${event.payload.action ?? "opened"} a pull request in ${repo}`,
      };
    case "IssuesEvent":
      return {
        icon: <FiAlertCircle size={14} className="text-accent" />,
        text: `${event.payload.action ?? "opened"} an issue in ${repo}`,
      };
    case "ForkEvent":
      return { icon: <FiGitCommit size={14} className="text-accent" />, text: `forked ${repo}` };
    default:
      return { icon: <FiActivity size={14} className="text-accent" />, text: `active in ${repo}` };
  }
}

export default function ActivityFeed({ events, loading }: ActivityFeedProps) {
  if (loading) {
    return <div className="text-muted-custom mono py-3" style={{ fontSize: "0.8rem" }}>loading activity...</div>;
  }

  if (events.length === 0) {
    return (
      <div
        className="p-3 mt-3 text-center text-muted-custom mono"
        style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", fontSize: "0.8rem" }}
      >
        no recent public activity
      </div>
    );
  }

  return (
    <div
      className="p-3 mt-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
      }}
    >
      <h3 className="h6 fw-bold mb-3 mono text-secondary-custom">recent activity</h3>
      <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
        {events.slice(0, 8).map((event) => {
          const { icon, text } = describeEvent(event);
          return (
            <li key={event.id} className="d-flex align-items-start gap-2">
              <span className="mt-1 flex-shrink-0">{icon}</span>
              <div className="flex-grow-1 min-w-0">
                <div className="text-secondary-custom" style={{ fontSize: "0.85rem" }}>
                  {text}
                </div>
                <div className="mono text-muted-custom" style={{ fontSize: "0.72rem" }}>
                  {timeAgo(event.created_at)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
