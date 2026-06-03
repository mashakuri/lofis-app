/**
 * BulletinUploadScreen — Figma "Bonnie - Create Poster (Upload)" 169:498
 *
 * Cork bg, "DESIGN POSTER" heading.
 * Centered gray upload zone (245×358), description write-in, Next → editor upload variant.
 */
import { useNavigate } from 'react-router-dom';

const CORK_BG = {
  background: '#b98f66',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
  backgroundBlendMode: 'multiply' as const,
};

export function BulletinUploadScreen() {
  const nav = useNavigate();

  return (
    <div style={{ flex: 1, minHeight: 0, ...CORK_BG, display: 'flex', flexDirection: 'column' }}>

      {/* Fixed header block */}
      <div style={{ flexShrink: 0, position: 'relative', paddingTop: 140, paddingBottom: 16 }}>

        {/* X close button */}
        <button
          onClick={() => nav(-1)}
          style={{
            position: 'absolute', top: 95, right: 26,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#182b49', fontSize: 26, lineHeight: 1, padding: 4, zIndex: 3,
          }}
          aria-label="Close"
        >×</button>

        {/* Heading */}
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
UPLOAD POSTER
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column' }}>

        {/* Upload zone */}
        <div style={{
          width: 245, background: '#e3e3e3',
          margin: '10px auto 12px', position: 'relative',
          cursor: 'pointer', boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
          height: 358, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000' }}>
            Click to Upload
          </span>
        </div>

        {/* Delete below the square */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 6 }}>
          <button style={{
            height: 30, padding: '0 20px', borderRadius: 30,
            border: '1.5px solid #000', background: 'rgba(255,255,255,0.3)',
            fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000', cursor: 'pointer',
          }}>Delete</button>
        </div>

        {/* Nav row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
          <button
            onClick={() => nav(-1)}
            style={{
              height: 36, padding: '0 20px', borderRadius: 999,
              border: '1.5px solid #000', background: 'rgba(255,255,255,0.3)',
              fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000', cursor: 'pointer',
            }}
          >Back</button>
          <button
            onClick={() => nav('/bulletin/editor?type=upload')}
            style={{
              height: 36, padding: '0 20px', borderRadius: 999,
              border: 'none', background: '#182b49',
              fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#fff7e7', cursor: 'pointer',
            }}
          >Next</button>
        </div>

      </div>{/* end scrollable */}
    </div>
  );
}
