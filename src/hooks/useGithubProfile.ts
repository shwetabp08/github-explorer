import { useState, useCallback } from "react";
import axios from "axios";
import type { GithubUser, GithubRepo } from "../types/github";

interface UseGithubProfileResult {
  user: GithubUser | null;
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  fetchProfile: (username: string, token?: string) => Promise<void>;
  reset: () => void;
}

const API_BASE = "https://api.github.com";

export function useGithubProfile(): UseGithubProfileResult {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const fetchProfile = useCallback(async (username: string, token?: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        axios.get<GithubUser>(`${API_BASE}/users/${trimmed}`),
        axios.get<GithubRepo[]>(
          `${API_BASE}/users/${trimmed}/repos?per_page=100&sort=updated`
        ),
      ]);

      setUser(userRes.data);
      setRepos(reposRes.data.filter((r) => !r.fork).map((repo) => ({ ...repo, private: false })));

      // Private repos are only ever visible to their own owner. If a token
      // was supplied, check whether it belongs to the searched account —
      // GitHub will never return another user's private repos regardless.
      const trimmedToken = token?.trim();
      if (trimmedToken) {
        try {
          const authRes = await axios.get(`${API_BASE}/user`, {
            headers: { Authorization: `Bearer ${trimmedToken}` },
          });
          const authedLogin: string = authRes.data.login;

          if (authedLogin.toLowerCase() === trimmed.toLowerCase()) {
            const privRes = await axios.get<GithubRepo[]>(
              `${API_BASE}/user/repos?visibility=private&affiliation=owner&per_page=100`,
              { headers: { Authorization: `Bearer ${trimmedToken}` } }
            );
            setRepos((currentRepos) => [
              ...currentRepos,
              ...privRes.data.filter((repo) => !repo.fork).map((repo) => ({ ...repo, private: true })),
            ]);
          }
        } catch {
          // Invalid or insufficient token access should not block public results.
        }
      }
    } catch (err) {
      setUser(null);
      setRepos([]);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError(`No GitHub user found for "${trimmed}"`);
      } else if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("GitHub API rate limit reached. Try again in a minute.");
      } else {
        setError("Something went wrong while fetching that profile.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setRepos([]);
    setError(null);
    setSearched(false);
    setLoading(false);
  }, []);

  return {
    user,
    repos,
    loading,
    error,
    searched,
    fetchProfile,
    reset,
  };
}