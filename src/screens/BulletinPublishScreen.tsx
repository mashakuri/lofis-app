/**
 * BulletinPublishScreen — Figma "Bonnie - Poster Uploaded!" 250:1545 / 265:1669
 *
 * Success screen after posting. Cork bg, "POSTER UPLOADED!" heading.
 * Posted card (140×177): yellow for template, gray for upload.
 * Three gray placeholder cards beside it.
 * Two CTAs: "Return to Home" and "Create Another Poster".
 *
 * ?type=template | upload determines the posted card color.
 */
import { useNavigate, useSearchParams } from 'react-router-dom';

const CORK_BG = {
  background: '#b98f66',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
  backgroundBlendMode: 'multiply' as const,
};

export function BulletinPublishScreen() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const isUpload = params.get('type') === 'upload';
  const postedColor = isUpload ? '#e3e3e3' : '#ffea75';

  return (
    <div style={{ flex: 1, minHeight: 0, ...CORK_BG, display: 'flex', flexDirection: 'column' }}>

      {/* Fixed header block */}
      <div style={{ flexShrink: 0, position: 'relative', paddingTop: 80, paddingBottom: 16 }}>
        <div style={{
          textAlign:        'center',
          fontFamily:       'Inter, sans-serif',
          fontWeight:       700,
          fontSize:         38,
          lineHeight:       '44px',
          color:            '#182b49',
          WebkitTextStroke: '1.5px rgba(251,234,141,1)',
          paintOrder:       'stroke fill',
          userSelect:       'none',
        }}>
          <span style={{ display: 'block' }}>POSTER</span>
          <span style={{ display: 'block' }}>UPLOADED!</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 32px', display: 'flex', flexDirection: 'column' }}>

      {/* Posted card + placeholders row */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
        {/* The uploaded poster */}
        <div style={{
          width: 140, height: 177, background: postedColor,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'flex-end', padding: 8,
        }}>
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#182b49', fontWeight: 700 }}>
            {isUpload ? 'My Poster' : 'My Template'}
          </span>
        </div>

        {/* Three gray placeholders */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 140, height: 177, background: '#e3e3e3',
            boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
            opacity: 0.6,
          }} />
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 16 }}>
        <button
          onClick={() => nav('/bulletin')}
          style={{
            width: 201, height: 49, borderRadius: 30,
            border: 'none',
            background: 'rgba(255,255,255,0.40)',
            fontFamily: 'Lato, sans-serif', fontSize: 15,
            color: '#182b49', cursor: 'pointer',
          }}
        >Return to Home</button>
        <button
          onClick={() => nav('/bulletin/create')}
          style={{
            width: 201, height: 49, borderRadius: 30,
            border: 'none', background: '#182b49',
            fontFamily: 'Lato, sans-serif', fontSize: 15,
            color: '#fff7e7', cursor: 'pointer',
          }}
        >Create Another Poster</button>
      </div>

      </div>{/* end scrollable */}
    </div>
  );
}
