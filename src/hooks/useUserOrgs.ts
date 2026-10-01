import { useEffect, useState } from "react";
import axios from "axios";

export interface GithubOrg {
  login: string;
  avatar_url: string;
  description: string | null;
}

export function useUserOrgs(username: string | null) {
  const [orgs, setOrgs] = useState<GithubOrg[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      setOrgs([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    axios
      .get<GithubOrg[]>(`https://api.github.com/users/${username}/orgs`)
      .then((res) => {
        if (!cancelled) setOrgs(res.data);
      })
      .catch(() => {
        if (!cancelled) setOrgs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { orgs, loading };
}