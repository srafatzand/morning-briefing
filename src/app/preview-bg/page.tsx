export default function PreviewBg() {
  const sample = {
    label: 'Morning Briefing',
    date: 'Tuesday, April 7, 2026  ·  ~9 min read',
    heading: 'Your Daily Brief',
    section: 'AI & Tech',
    context: 'The AI landscape is shifting rapidly as model capabilities outpace regulatory frameworks, with major labs racing to deploy agents in production environments.',
    headline: 'AI Virtual Try-On Startups Tackle Retail\'s $849 Billion Returns Problem',
    body: 'A surge of AI startups are deploying virtual try-on technology to combat online retail returns, which totaled $849.9 billion in 2025 according to the National Retail Federation.',
  };

  const options = [
    {
      id: 'A',
      name: 'Dot Grid',
      desc: 'Tiny 1 px dots on a 28 px grid — clean, graph-paper feel',
      bg: `#0a0a0a`,
      extra: `
        background-image: radial-gradient(circle, #252525 1px, transparent 1px);
        background-size: 28px 28px;
      `,
      style: {
        background: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle, #252525 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      } as React.CSSProperties,
    },
    {
      id: 'B',
      name: 'Film Grain',
      desc: 'SVG noise overlay — organic, filmic, warm depth',
      style: {
        background: '#0a0a0a',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
      } as React.CSSProperties,
    },
    {
      id: 'C',
      name: 'Scanlines',
      desc: 'Faint 1 px horizontal rules every 4 px — subtle terminal / CRT feel',
      style: {
        background: '#0a0a0a',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #141414 3px, #141414 4px)',
      } as React.CSSProperties,
    },
  ];

  return (
    <div style={{ fontFamily: 'ui-monospace, monospace', minHeight: '100vh', background: '#050505', padding: '40px 24px' }}>
      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Background Preview</p>
      <h1 style={{ color: '#ece9e4', fontSize: '22px', fontWeight: 600, marginBottom: '40px' }}>Choose a background style</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {options.map((opt) => (
          <div key={opt.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ color: '#ece9e4', fontSize: '13px', fontWeight: 600 }}>Option {opt.id} — {opt.name}</span>
            </div>
            <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>{opt.desc}</p>

            {/* Preview panel */}
            <div
              style={{
                ...opt.style,
                borderRadius: '0px',
                border: '1px solid #1e1e1e',
                padding: '32px',
                minHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {/* Simulated header */}
              <div style={{ borderBottom: '1px solid #1e1e1e', paddingBottom: '16px', marginBottom: '28px' }}>
                <p style={{ color: '#777', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 8px' }}>Morning Briefing</p>
                <h2 style={{ color: '#ece9e4', fontSize: '28px', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.2 }}>{sample.heading}</h2>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{sample.date}</p>
              </div>

              {/* Simulated section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                  <span style={{ color: '#666', fontSize: '11px' }}>01</span>
                  <span style={{ color: '#ece9e4', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sample.section}</span>
                </div>
                <p style={{ color: '#b8b5b0', fontSize: '12px', fontStyle: 'italic', borderLeft: '1px solid #2a2a2a', paddingLeft: '16px', margin: '0 0 20px', lineHeight: 1.7 }}>
                  {sample.context}
                </p>
                <h3 style={{ color: '#ece9e4', fontSize: '13px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.4 }}>{sample.headline}</h3>
                <p style={{ color: '#c0bdb8', fontSize: '12px', margin: 0, lineHeight: 1.7 }}>{sample.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: '#444', fontSize: '11px', marginTop: '40px' }}>
        Tell Claude which option (A, B, or C) you prefer and it will be applied.
      </p>
    </div>
  );
}
