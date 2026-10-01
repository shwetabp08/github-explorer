export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  twitter_username: string | null;
}

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  private: boolean;
  topics: string[];
}

export type SortOption = "stars" | "updated" | "name";

export interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    commits?: { message: string }[];
    ref_type?: string;
  };
}
