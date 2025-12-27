import { useState, Dispatch, SetStateAction } from "react";

interface ConfigPanelProps {
  emblems: string[];
  initialMaxCost: number;
  initialMaxSize: number;
  onChange: Dispatch<SetStateAction<{ emblems: Record<string, number>; maxCost: number; maxSize: number; }>>;
}

export default function ConfigPanel({ emblems, initialMaxCost, initialMaxSize, onChange }: ConfigPanelProps) {
  const [selectedEmblems, setSelectedEmblems] = useState<Record<string, number>>(
    Object.fromEntries(emblems.map(e => [e, 0]))
  );
  const [maxCost, setMaxCost] = useState(initialMaxCost);
  const [maxSize, setMaxSize] = useState(initialMaxSize);

  const updateEmblem = (name: string, value: number) => {
    const updated = { ...selectedEmblems, [name]: Math.max(0, value) };
    setSelectedEmblems(updated);
    onChange({ emblems: updated, maxCost, maxSize });
  };

  const updateMaxCost = (value: number) => {
    const cost = Math.min(Math.max(1, value), 5);
    setMaxCost(cost);
    onChange({ emblems: selectedEmblems, maxCost: cost, maxSize});
  };

  const updateMaxSize = (value: number) => {
    const size = Math.min(Math.max(1, value), 10);
    setMaxSize(size);
    onChange({ emblems: selectedEmblems, maxCost, maxSize: size });
  };

 return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        {emblems.map((e) => (
          <div
            key={e}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "70px",
            }}
          >
            <img
              src={`/assets/traits/${e.toLowerCase()}.svg`}
              alt={e}
              style={{ width: 28, height: 28, marginBottom: 4 }}
            />
            <label style={{ fontSize: "12px", marginBottom: "2px" }}>{e}</label>
            <input
              type="number"
              value={selectedEmblems[e] === 0 ? "" : selectedEmblems[e]}
              onChange={(ev) => {
                const val = ev.target.value === "" ? 0 : parseInt(ev.target.value) || 0;
                updateEmblem(e, val);
              }}
              style={{
                width: "45px",
                textAlign: "center",
                /* remove number input arrows */
                MozAppearance: "textfield",
              }}
              onKeyDown={(e) => e.key === "e" && e.preventDefault()} // prevent "e" for scientific notation
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column", minWidth: "80px" }}>
          <label style={{ fontSize: "12px", marginBottom: "2px" }}>Max Cost</label>
          <input
            type="number"
            min={1}
            value={maxCost}
            onChange={(ev) => updateMaxCost(parseInt(ev.target.value) || 1)}
            style={{ width: "60px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: "80px" }}>
          <label style={{ fontSize: "12px", marginBottom: "2px" }}>Max Size</label>
          <input
            type="number"
            min={1}
            value={maxSize}
            onChange={(ev) => updateMaxSize(parseInt(ev.target.value) || 1)}
            style={{ width: "60px" }}
          />
        </div>
      </div>
    </div>
  );
}
