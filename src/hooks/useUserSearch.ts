import { useEffect, useState } from "react";
import axios from "axios";
import { useDebouncedValue } from "./useDebouncedValue";

export interface UserSuggestion {
  login: string;
  avatar_url: string;
}

export function useUserSearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 350);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    axios
      .get("https://api.github.com/search/users", {
        params: { q: debounced, per_page: 6 },
      })
      .then((res) => {
        if (!cancelled) {
          setSuggestions(res.data.items ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return { suggestions, loading };
}
