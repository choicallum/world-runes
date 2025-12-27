interface ResultsListProps {
  results: Record<string, string[]>;
}

export default function ResultsList({ results }: ResultsListProps) {
  return (
    <div>
      {Object.entries(results).map(([subset, solutions]) => (
        <div key={subset} style={{ marginBottom: "10px" }}>
          <strong>{subset}</strong>
          <ul>
            {solutions.map((sol, i) => (
              <li key={i}>{sol}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
