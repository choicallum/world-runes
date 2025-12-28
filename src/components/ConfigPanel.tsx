import { useState, Dispatch, SetStateAction } from "react";

interface ConfigPanelProps {
  emblems: string[];
  initialMaxCost: number;
  initialMaxSize: number;
  onChange: Dispatch<
    SetStateAction<{
      emblems: Record<string, number>;
      maxCost: number;
      maxSize: number;
    }>
  >;
  onSolve: () => void;
}

export default function ConfigPanel({
  emblems,
  initialMaxCost,
  initialMaxSize,
  onChange,
  onSolve,
}: ConfigPanelProps) {
  const [selectedEmblems, setSelectedEmblems] = useState<Record<string, number>>(
    Object.fromEntries(emblems.map((e) => [e, 0]))
  );

  // numeric state
  const [maxCost, setMaxCost] = useState(initialMaxCost);
  const [maxSize, setMaxSize] = useState(initialMaxSize);

  // string input state (allows empty)
  const [maxCostInput, setMaxCostInput] = useState(String(initialMaxCost));
  const [maxSizeInput, setMaxSizeInput] = useState(String(initialMaxSize));

  const updateEmblem = (name: string, value: number) => {
    const updated = { ...selectedEmblems, [name]: Math.max(0, value) };
    setSelectedEmblems(updated);
    onChange({ emblems: updated, maxCost, maxSize });
  };

  const updateMaxCost = (value: string) => {
    setMaxCostInput(value);
    if (value === "") return;

    const cost = Math.min(Math.max(1, parseInt(value, 10)), 5);
    setMaxCost(cost);
    onChange({ emblems: selectedEmblems, maxCost: cost, maxSize });
  };

  const updateMaxSize = (value: string) => {
    setMaxSizeInput(value);
    if (value === "") return;

    const size = Math.min(Math.max(1, parseInt(value, 10)), 10);
    setMaxSize(size);
    onChange({ emblems: selectedEmblems, maxCost, maxSize: size });
  };

  const parsedCost = maxCostInput === "" ? NaN : parseInt(maxCostInput, 10);
  const parsedSize = maxSizeInput === "" ? NaN : parseInt(maxSizeInput, 10);

  const invalidCost = Number.isNaN(parsedCost) || parsedCost <= 0 || parsedCost > 5;
  const invalidSize = Number.isNaN(parsedSize) || parsedSize <= 0 || parsedSize >= 11;
  const isSolveDisabled = invalidCost || invalidSize;

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
              src={`${process.env.PUBLIC_URL}/assets/traits/${e.toLowerCase()}.svg`}
              alt={e}
              style={{ width: 28, height: 28, marginBottom: 4 }}
            />
            <label style={{ fontSize: "12px", marginBottom: "2px" }}>
              {e}
            </label>
            <input
              type="number"
              value={selectedEmblems[e] === 0 ? "" : selectedEmblems[e]}
              onChange={(ev) => {
                const val =
                  ev.target.value === ""
                    ? 0
                    : parseInt(ev.target.value, 10) || 0;
                updateEmblem(e, val);
              }}
              style={{
                width: "45px",
                textAlign: "center",
                MozAppearance: "textfield",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "80px",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "12px", marginBottom: "2px" }}>
            Max Unit Cost
          </label>
          <input
            type="number"
            min={1}
            value={maxCostInput}
            onChange={(ev) => updateMaxCost(ev.target.value)}
            style={{
              width: "60px",
              textAlign: "center",
              MozAppearance: "textfield",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "80px",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "12px", marginBottom: "2px" }}>
            Max Team Size
          </label>
          <input
            type="number"
            min={1}
            value={maxSizeInput}
            onChange={(ev) => updateMaxSize(ev.target.value)}
            style={{
              width: "60px",
              textAlign: "center",
              MozAppearance: "textfield",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onSolve}
          disabled={isSolveDisabled}
          style={{
            marginTop: "8px",
            padding: "8px 15px",
            opacity: isSolveDisabled ? 0.6 : 1,
            cursor: isSolveDisabled ? "not-allowed" : "pointer",
          }}
          title={
            isSolveDisabled
              ? "Enter valid values: cost 1–5 and team size 1–10"
              : "Solve"
          }
        >
          Solve
        </button>
      </div>
    </div>
  );
}
