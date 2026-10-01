import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import { FiGithub } from "react-icons/fi";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import ActivityFeed from "./components/ActivityFeed";
import ComparePanel from "./components/ComparePanel";
import ResultsToolbar from "./components/ResultsToolbar";
import RecentSearches from "./components/RecentSearches";
import { LoadingState, ErrorState, IdleState } from "./components/StatusMessage";
import { useGithubProfile } from "./hooks/useGithubProfile";
import { useUserEvents } from "./hooks/useUserEvents";
import { useUrlUsername } from "./hooks/useUrlUsername";

const RECENT_SEARCHES_LIMIT = 5;

export default function App() {
  const {
    user,
    repos,
    loading,
    error,
    searched,
    fetchProfile,
    reset,
  } = useGithubProfile();

  const { events, loading: eventsLoading } = useUserEvents(user?.login ?? null);
  const { syncUrl } = useUrlUsername((username) => fetchProfile(username));
  const [showCompare, setShowCompare] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [privateAccessAttempted, setPrivateAccessAttempted] = useState(false);

  const handleSearch = (username: string, token: string) => {
    setShowCompare(false);
    setPrivateAccessAttempted(Boolean(token.trim()));
    fetchProfile(username, token);
    syncUrl(username.trim() || null);
  };

  const handleClear = () => {
    reset();
    setShowCompare(false);
    setPrivateAccessAttempted(false);
    syncUrl(null);
  };

  // Track successful lookups for the "recently viewed" chips. In-memory
  // only — resets on page reload, never persisted anywhere.
  useEffect(() => {
    if (!user) return;
    setRecentSearches((prev) => {
      const withoutCurrent = prev.filter(
        (u) => u.toLowerCase() !== user.login.toLowerCase()
      );
      return [user.login, ...withoutCurrent].slice(0, RECENT_SEARCHES_LIMIT);
    });
  }, [user]);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  return (
    <div className="app-shell">
      <div className="container py-3 py-md-4 px-3" style={{ maxWidth: 1080 }}>
        <SearchBar onSearch={handleSearch} loading={loading} searched={searched} onClear={handleClear} />

        <RecentSearches
          usernames={recentSearches}
          onSelect={(u) => handleSearch(u, "")}
        />

        <div className="pb-5">
          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && !searched && <IdleState />}

          {!loading && !error && user && (
            <>
              <ResultsToolbar
                login={user.login}
                avatarUrl={user.avatar_url}
                showCompare={showCompare}
                onToggleCompare={() => setShowCompare((v) => !v)}
              />

              {showCompare && (
                <ComparePanel
                  primaryLogin={user.login}
                  primaryFollowers={user.followers}
                  primaryPublicRepos={user.public_repos}
                  primaryTotalStars={totalStars}
                  onClose={() => setShowCompare(false)}
                />
              )}

              <div className="row g-3">
                <div className="col-12 col-lg-4">
                  <ProfileCard user={user} repoCount={repos.length} />
                  <ActivityFeed events={events} loading={eventsLoading} />
                </div>

                <div className="col-12 col-lg-8">
                  <LanguageChart repos={repos} />
                  <RepoList
                    repos={repos}
                    ownerLogin={user.login}
                    privateAccessAttempted={privateAccessAttempted}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <footer
          className="text-center py-3 mono text-muted-custom d-flex align-items-center justify-content-center gap-2 flex-wrap px-2"
          style={{ borderTop: "1px solid var(--border)", fontSize: "0.75rem" }}
        >
          <FiGithub size={12} />
          built with React, TypeScript &amp; the GitHub REST API
        </footer>
      </div>
    </div>
  );
}