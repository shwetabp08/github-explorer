import { useEffect, useState } from "react";
import axios from "axios";

interface ReadmeState {
  content: string | null;
  loading: boolean;
  error: boolean;
}

export function useRepoReadme(fullName: string | null) {
  const [state, setState] = useState<ReadmeState>({ content: null, loading: false, error: false });

  useEffect(() => {
    if (!fullName) {
      setState({ content: null, loading: false, error: false });
      return;
    }
    let cancelled = false;
    setState({ content: null, loading: true, error: false });

    axios
      .get(`https://api.github.com/repos/${fullName}/readme`)
      .then((res) => {
        if (cancelled) return;
        const decoded = decodeURIComponent(
          escape(atob(res.data.content.replace(/\n/g, "")))
        );
        setState({ content: decoded, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ content: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [fullName]);

  return state;
}
