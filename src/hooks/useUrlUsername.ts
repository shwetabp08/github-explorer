import { useEffect, useRef } from "react";

export function useUrlUsername(onRestore: (username: string) => void) {
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const params = new URLSearchParams(window.location.search);
    const u = params.get("u");
    if (u) onRestore(u);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncUrl = (username: string | null) => {
    const url = new URL(window.location.href);
    if (username) {
      url.searchParams.set("u", username);
    } else {
      url.searchParams.delete("u");
    }
    window.history.replaceState({}, "", url.toString());
  };

  return { syncUrl };
}
