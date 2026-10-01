import { useEffect, useState } from "react";
import axios from "axios";
import type { GithubEvent } from "../types/github";

export function useUserEvents(username: string | null) {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      setEvents([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    axios
      .get<GithubEvent[]>(`https://api.github.com/users/${username}/events/public`, {
        params: { per_page: 10 },
      })
      .then((res) => {
        if (!cancelled) setEvents(res.data);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { events, loading };
}
