import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { GithubRepo } from "../types/github";
import { languageColor } from "../utils/languageColors";

interface LanguageChartProps {
  repos: GithubRepo[];
}

export default function LanguageChart({ repos }: LanguageChartProps) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((r) => {
      if (!r.language) return;
      counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [repos]);

  if (data.length === 0) return null;

  return (
    <div
      className="p-3 mb-3"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
      }}
    >
      <h3 className="h6 fw-bold mb-3 mono text-secondary-custom">languages</h3>
      <div className="d-flex align-items-center flex-wrap gap-3">
        <div style={{ width: 140, height: 140, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={38}
                outerRadius={60}
                paddingAngle={2}
                stroke="var(--bg-card)"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={languageColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                }}
                itemStyle={{ color: "var(--text-primary)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="d-flex flex-column gap-1 flex-grow-1" style={{ minWidth: 140 }}>
          {data.map((d) => (
            <div
              key={d.name}
              className="d-flex align-items-center justify-content-between mono"
              style={{ fontSize: "0.8rem" }}
            >
              <span className="d-flex align-items-center gap-2 text-secondary-custom">
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: languageColor(d.name),
                    display: "inline-block",
                  }}
                />
                {d.name}
              </span>
              <span className="text-muted-custom">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
