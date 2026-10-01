import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface ReadmeViewerProps {
  markdown: string;
}

export default function ReadmeViewer({ markdown }: ReadmeViewerProps) {
  const html = useMemo(() => {
    const raw = marked.parse(markdown, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  return (
    <div
      className="readme-content"
      style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text-secondary)" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
