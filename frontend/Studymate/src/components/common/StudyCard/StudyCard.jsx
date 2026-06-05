import React from 'react';

function StudyCard({ data }) {
  if (!data) return <p>No summary data available.</p>;

  // Bulletproof helper function to handle AI unpredictability
  const renderDetails = (details) => {
    
    // Scenario 1: It's a standard string
    if (typeof details === 'string') {
      return (
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, margin: 0 }}>
          {details}
        </p>
      );
    }

    // Scenario 2: The AI returned a List/Array
    if (Array.isArray(details)) {
      return (
        <ul style={{ margin: "4px 0 0 0", paddingLeft: "1.2rem", fontSize: 13, color: "#555" }}>
          {details.map((item, index) => (
            <li key={index} style={{ marginBottom: "4px" }}>
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Scenario 3: The AI returned a Key-Value Object (like the Complexity object)
    if (typeof details === 'object' && details !== null) {
      return (
        <ul style={{ margin: "4px 0 0 0", paddingLeft: "1.2rem", fontSize: 13, color: "#555" }}>
          {Object.entries(details).map(([key, value]) => (
            <li key={key} style={{ marginBottom: "4px" }}>
              <strong>{key}:</strong> {
                typeof value === 'object' ? JSON.stringify(value) : String(value)
              }
            </li>
          ))}
        </ul>
      );
    }

    // Fallback for missing or weird data
    return null;
  };

  return (
    <div style={{ padding: "1.5rem 0", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.4, margin: "0 0 0.75rem" }}>
        {data.title || data.summary_title || "Module Summary"}
      </h2>

      {/* Added a safeguard here in case 'summary' is missing but 'module_name' exists */}
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
        {data.summary || data.module_name}
      </p>

      {data.key_concepts && data.key_concepts.length > 0 && (
        <>
          <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", margin: "0 0 0.75rem" }}>
            Key concepts
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {data.key_concepts.map(({ concept, details }, index) => (
              <div 
                key={concept || index} 
                style={{ background: "#f5f5f5", borderRadius: 8, padding: "0.85rem 1rem", border: "0.5px solid #e0e0e0" }}
              >
                <p style={{ fontSize: 12, fontWeight: 500, color: "#1a73e8", margin: "0 0 6px" }}>
                  {concept}
                </p>
                {/* Dynamically render based on the data type */}
                {renderDetails(details)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StudyCard;