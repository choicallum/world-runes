// lowkey extremely vibe coded but that's fine

import { useState, useEffect } from "react";

interface ResultEntry {
  subset: string;
  solution: string[];
}

interface ResultsListProps {
  results: ResultEntry[];
}

function tidyNameForFile(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function ResultsList({ results }: ResultsListProps) {
  const items = results ?? [];
  const bySize: Record<number, ResultEntry[]> = {};
  for (const r of items) {
    const size = r.solution.length;
    (bySize[size] = bySize[size] || []).push(r);
  }
  const sizes = Object.keys(bySize).map(Number).sort((a, b) => a - b);

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const sizeCountsKey = sizes.map(s => `${s}:${(bySize[s] || []).length}`).join(",");

  useEffect(() => {
    const next: Record<number, boolean> = {};
    if (!sizeCountsKey) {
      setCollapsed({});
      return;
    }

    const parts = sizeCountsKey.split(",");
    for (const part of parts) {
      const [sStr, countStr] = part.split(":");
      const s = Number(sStr);
      const count = Number(countStr);
      next[s] = count > 5;
    }

    setCollapsed(next);
  }, [sizeCountsKey]);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>Results</h3>

      {sizes.map((size) => {
        const teams = bySize[size] || [];
        const teamsCount = teams.length;
        const isCollapsed = !!collapsed[size];
        const arrow = isCollapsed ? "▸" : "▾";
        const headerText = `${size} Units (${teamsCount} ${teamsCount === 1 ? 'team' : 'teams'})`;

        return (
          <div key={size}>
            <h4
              onClick={() => setCollapsed(prev => ({ ...prev, [size]: !prev[size] }))}
              style={{ margin: "8px 0", fontSize: 14, cursor: "pointer", userSelect: "none" }}
            >
              {arrow} {headerText}
            </h4>
            {!isCollapsed && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {teams.map((r, idx) => {
                  const traits = r.subset.split(",").map((s) => s.trim()).filter(Boolean);

                  const counts: Record<string, number> = {};
                  for (const u of r.solution) counts[u] = (counts[u] || 0) + 1;
                  const unitEntries = Object.entries(counts);

                  return (
                    <div
                      key={`${size}-${idx}-${r.subset}`}
                      style={{
                        border: "1px solid #eee",
                        borderRadius: 6,
                        padding: 8,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", gap: 6, alignItems: "center", minWidth: 140 }}>
                        {traits.map((t) => {
                          const traitFile = `${process.env.PUBLIC_URL}/assets/traits/${t.replace(/\s+/g, "").toLowerCase()}.svg`;
                          return (
                            <img
                              key={t}
                              src={traitFile}
                              alt={t}
                              title={t}
                              style={{ width: 28, height: 28 }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          );
                        })}
                      </div>

                      <div style={{ width: 1, background: "#e6e6e6", opacity: 0.6, height: 36 }} />

                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
                        {unitEntries.map(([unit, count]) => {
                          const champFile = `${process.env.PUBLIC_URL}/assets/champions/${tidyNameForFile(unit)}.png`;
                          const emblemFile = `${process.env.PUBLIC_URL}/assets/emblems/${unit.replace(/\s+/g, "").toLowerCase()}_emblem.png`;
                          const traitFile = `${process.env.PUBLIC_URL}/assets/traits/${unit.replace(/\s+/g, "").toLowerCase()}.svg`;

                          return (
                            <div key={unit} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                              {Array.from({ length: count }).map((_, j) => (
                                <img
                                  key={`${unit}-${j}`}
                                  src={champFile}
                                  alt={unit}
                                  title={unit}
                                  data-stage={"0"}
                                  style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }}
                                  onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    const stage = parseInt(img.dataset.stage ?? "0", 10);
                                    if (stage === 0) {
                                      img.dataset.stage = "1";
                                      img.src = emblemFile;
                                    } else if (stage === 1) {
                                      img.dataset.stage = "2";
                                      img.src = traitFile;
                                    } else {
                                      img.style.display = "none";
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
