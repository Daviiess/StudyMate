import React from 'react';

// 1. Text cleaner (Removes * and #)
const cleanText = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/[*#]/g, '').trim(); 
};

export function ConceptRenderer({ data }) {
  if (!data) return null;

  let parsed = null;
  let rawString = data?.explanation || '';

  // 2. THE BULLETPROOF PARSER
  try {
    const startIndex = rawString.indexOf('{');
    const endIndex = rawString.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonString = rawString.substring(startIndex, endIndex + 1);
      parsed = JSON.parse(jsonString);
    } 
  } catch (e) {
    parsed = null; 
  }

  // 3. Extract Topic (Checking the new "title" key as well)
  const topic = data?.concept || parsed?.query || parsed?.topic || parsed?.title || 'Concept Explanation';

  // 4. CHECK FOR THE NEW "SECTIONS" SCHEMA
  const sections = Array.isArray(parsed?.sections) ? parsed.sections : [];

  // 5. Extract Standard Explanation (if sections don't exist)
  let explanation = '';
  if (parsed && sections.length === 0) {
    explanation = parsed.explanation || parsed.answer || parsed.details || parsed.query_response?.explanation || '';
    if (!explanation) {
      explanation = JSON.stringify(parsed, null, 2);
    }
  } else if (!parsed) {
    explanation = rawString.replace(/```json/gi, '').replace(/```/g, '').trim();
  }
  explanation = cleanText(explanation);

  // 6. Extract Analogy (if it exists)
  const analogy = parsed?.analogy || parsed?.query_response?.analogy || null;
  const hasAnalogyContent = analogy && (
    typeof analogy === 'string' ? analogy.trim().length > 0 : Object.keys(analogy).length > 0
  );

  return (
    <div style={s.wrap}>
      <h2 style={s.title}>{cleanText(topic)}</h2>

      {/* RENDER THE NEW "SECTIONS" FORMAT IF IT EXISTS */}
      {sections.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          {sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '1.25rem' }}>
              {section.heading && (
                <h3 style={s.sectionHeading}>{cleanText(section.heading)}</h3>
              )}
              {section.content && (
                <div style={s.process}>
                  {cleanText(section.content)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* OTHERWISE, RENDER STANDARD TEXT */
        <p style={s.body}>{explanation}</p>
      )}

      {/* Render Analogy exactly as before */}
      {hasAnalogyContent && (
        <>
          <hr style={s.divider} />
          <div style={s.labelWrapper}>
            <span style={s.labelIcon}>💡</span>
            <p style={s.label}>Real-world Analogy</p>
          </div>
          
          <div style={s.card}>
            {typeof analogy === 'string' ? (
              <div style={s.process}>{cleanText(analogy)}</div>
            ) : (
              <>
                {(analogy.real_world_object || analogy.scenario || analogy.concept) && (
                  <div style={{ marginBottom: '1.25rem' }}>
                     <span style={s.badge}>
                      {cleanText(analogy.real_world_object || analogy.scenario || analogy.concept)}
                    </span>
                  </div>
                )}
                
                {(analogy.explanation || analogy.process || analogy.description) && (
                  <div style={s.process}>
                    {cleanText(analogy.explanation || analogy.process || analogy.description)}
                  </div>
                )}

                {Array.isArray(analogy.elements) && analogy.elements.length > 0 && (
                  <div style={s.grid}>
                    {analogy.elements.map((el, i) => (
                      <div key={i} style={s.chip}>
                        <p style={s.chipTitle}>{cleanText(el.data_point || el.name)}</p>
                        <p style={s.chipDesc}>{cleanText(el.description)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!analogy.real_world_object && !analogy.explanation && !analogy.scenario && !Array.isArray(analogy.elements) && !analogy.process && !analogy.description && (
                  <div style={s.process}>
                    {Object.entries(analogy).map(([key, value]) => (
                      typeof value === 'string' ? (
                        <div key={key} style={{ marginBottom: 12 }}>
                          <strong style={{ textTransform: 'capitalize', color: '#3730a3' }}>{key.replace(/_/g, ' ')}: </strong> 
                          {cleanText(value)}
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 🎨 PREMIUM STYLES DICTIONARY
const s = {
  wrap: { 
    padding: '0.5rem 0 2rem 0', 
    fontFamily: 'Inter, system-ui, sans-serif' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 700, 
    color: '#0f172a', 
    letterSpacing: '-0.02em', 
    lineHeight: 1.3, 
    margin: '0 0 1.25rem' 
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e293b', // Slightly softer slate for subheadings
    margin: '0 0 0.5rem 0'
  },
  body: { 
    fontSize: 15.5, 
    color: '#334155', 
    lineHeight: 1.75, 
    margin: '0 0 2rem', 
    whiteSpace: 'pre-wrap' 
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '2rem 0 1.5rem 0'
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1rem'
  },
  labelIcon: {
    fontSize: '14px'
  },
  label: { 
    fontSize: 12, 
    fontWeight: 700, 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em', 
    color: '#6366f1', 
    margin: 0 
  },
  card: { 
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
    borderRadius: 12, 
    padding: '1.5rem', 
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
  },
  badge: {
    display: 'inline-block',
    background: '#e0e7ff', 
    color: '#4338ca', 
    padding: '4px 12px',
    borderRadius: 999, 
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em'
  },
  process: { 
    fontSize: 15, 
    color: '#475569', 
    lineHeight: 1.7, 
    margin: '0 0 1.5rem', 
    whiteSpace: 'pre-wrap',
    paddingLeft: '1rem',
    borderLeft: '3px solid #cbd5e1'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
    gap: 12, 
    marginTop: 20 
  },
  chip: { 
    background: '#ffffff', 
    borderRadius: 8, 
    padding: '1.25rem', 
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' 
  },
  chipTitle: { 
    fontSize: 14, 
    fontWeight: 600, 
    color: '#0f172a', 
    margin: '0 0 6px' 
  },
  chipDesc: { 
    fontSize: 14, 
    color: '#64748b', 
    lineHeight: 1.6, 
    margin: 0 
  },
};