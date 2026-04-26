
function parseExplanation(str) {
  try {
    const clean = str?.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

export function ConceptRenderer({ data }) {
  const parsed = parseExplanation(data?.explanation);
  if (!parsed) return (
    <div className="empty-state" style={s.emptyState}> {/* Use className for SCSS, or style={} for JS */}
      <div className="empty-state__icon" style={s.emptyIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      </div>
      <h3 className="empty-state__title" style={s.emptyTitle}>Ready to learn?</h3>
      <p className="empty-state__desc" style={s.emptyDesc}>
        Ask for a concept below, and Studymate will break it down into easy-to-understand pieces.
      </p>
    </div>
  );

  const qr = parsed?.query_response || parsed?.exam_explanation;
  const topic = qr?.topic || data?.concept;
  const explanation = qr?.explanation || '';
  const analogy = qr?.analogy || null;

  return (
    <div style={s.wrap}>
      <div style={s.label}>Concept</div>
      <h2 style={s.title}>{topic}</h2>
      <p style={s.body}>{explanation}</p>

      {analogy && (
        <>
          <hr style={s.divider} />
          <div style={s.label}>Analogy</div>
          <div style={s.card}>
            {analogy.scenario && (
              <span style={s.pill}>{analogy.scenario}</span>
            )}

            {analogy.elements?.length > 0 && (
              <div style={s.grid}>
                {analogy.elements.map((el, i) => (
                  <div key={i} style={s.chip}>
                    <div style={s.chipTitle}>{el.data_point || el.name}</div>
                    <div style={s.chipDesc}>{el.description}</div>
                  </div>
                ))}
              </div>
            )}

            {analogy.process && (
              <div style={s.process}>{analogy.process}</div>
            )}

            {analogy.connection_to_topic && (
              <div style={s.connection}>{analogy.connection_to_topic}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { padding: '1rem 0', fontFamily: 'sans-serif' },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: 500, marginBottom: 16 },
  body: { fontSize: 15, lineHeight: 1.75, marginBottom: 24, color: '#464646' },
  divider: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' },
  card: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 },
  pill: { display: 'inline-block', fontSize: 12, padding: '3px 10px', borderRadius: 999, background: '#f3f4f6', color: '#6b7280', marginBottom: 14, border: '1px solid #e5e7eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 14 },
  chip: { background: '#f9fafb', borderRadius: 8, padding: '10px 12px', border: '1px solid #e5e7eb' },
  chipTitle: { fontSize: 12, fontWeight: 500, marginBottom: 3 },
  chipDesc: { fontSize: 12, color: '#6b7280', lineHeight: 1.5 },
  process: { fontSize: 13, color: '#6b7280', lineHeight: 1.6, padding: '10px 14px', borderLeft: '2px solid #d1d5db', marginBottom: 12, background: '#f9fafb', borderRadius: 4 },
  connection: { fontSize: 13, color: '#6b7280', lineHeight: 1.6, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8 },
  emptyState: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    textAlign: 'center', 
    padding: '48px 24px', 
    
   
    borderRadius: 12, 
    margin: '16px 0' 
  },
  emptyIcon: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 48, 
    height: 48, 
    backgroundColor: '#F3F0FF', 
    color: '#7C3AED', 
    borderRadius: '50%', 
    marginBottom: 16 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: 600, 
    color: '#1f2937', 
    marginBottom: 8 
  },
  emptyDesc: { 
    fontSize: 14, 
    color: '#6b7280',
    lineHeight: 1.5, 
    maxWidth: 280 
  }
};