
function parseSummary(rawSummary) {

  const cleaned = rawSummary?.replace(/^```json\s*/,'').replace(/```\s*$/,'').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}


function StudyCard({ document }) {
  const data = parseSummary(document?.summary);

  if (!data) return <p>Failed to parse summary.</p>;

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4, margin: "0 0 0.75rem" }}>
        {data.title}
      </h2>

      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
        {data.summary}
      </p>

      <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", margin: "0 0 0.75rem" }}>
        Key concepts
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {data.key_concepts?.map(({ concept, details }) => (
          <div key={concept} style={{ background: "#f5f5f5", borderRadius: 8, padding: "0.85rem 1rem", border: "0.5px solid #e0e0e0" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#1a73e8", margin: "0 0 4px" }}>
              {concept}
            </p>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, margin: 0 }}>
              {details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default StudyCard;