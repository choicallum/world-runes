import { useState } from "react";
import ConfigPanel from "./components/ConfigPanel";
import { solve, emblems as initialEmblems } from "./solver/solver";

export default function App() {
  const emblemNames = Object.keys(initialEmblems);
  const [config, setConfig] = useState<{ emblems: Record<string, number>; maxCost: number; maxSize: number }>({
    emblems: initialEmblems,
    maxCost: 3,
    maxSize: 7,
  });
  const [results, setResults] = useState<{ subset: string; solution: string[] }[]>([]);

  const handleSolve = () => {
    const res = solve(config.emblems, config.maxCost, config.maxSize);
    setResults(res);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <ConfigPanel
        emblems={emblemNames}
        initialMaxCost={config.maxCost}
        initialMaxSize={config.maxSize}
        onChange={(c) => setConfig(c)}
      />

      <button onClick={handleSolve} style={{ marginBottom: "20px", padding: "8px 15px" }}>
        Solve
      </button>

      <div>
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <strong>{r.subset}</strong>: {r.solution.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
}
