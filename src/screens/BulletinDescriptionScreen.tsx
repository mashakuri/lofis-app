/**
 * BulletinDescriptionScreen — Figma "Bonnie - Create Poster (Add Description)" 182:387
 *
 * Upload path only. Cork bg, "ADD A DESCRIPTION" heading.
 * Poster thumbnail (228×305 gray), description input, hashtag input.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CORK_BG = {
  background: '#b98f66',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
  backgroundBlendMode: 'multiply' as const,
};

export function BulletinDescriptionScreen() {
  const nav = useNavigate();
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');

  return (
    <div style={{ flex: 1, minHeight: 0, ...CORK_BG, display: 'flex', flexDirection: 'column' }}>

      {/* Fixed header block */}
      <div style={{ flexShrink: 0, position: 'relative', paddingTop: 80, paddingBottom: 16 }}>

        {/* X close button */}
        <button
          onClick={() => nav(-1)}
          style={{
            position: 'absolute', top: 35, right: 26,
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
          <span style={{ display: 'block' }}>ADD A</span>
          <span style={{ display: 'block' }}>DESCRIPTION</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column' }}>

        {/* Action row: Save | Delete */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
          {['Save', 'Delete'].map(label => (
            <button key={label} style={{
              height: 30, padding: '0 16px', borderRadius: 30,
              border: '1.5px solid #000', background: 'rgba(255,255,255,0.3)',
              fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000', cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>

        {/* Poster thumbnail */}
        <div style={{
          width: 228, height: 305, background: '#e3e3e3',
          margin: '0 auto 20px',
          boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
        }} />

        {/* Description box */}
        <div style={{
          background: 'rgba(255,255,255,0.40)', borderRadius: 12,
          border: '2px solid #000', padding: '10px 14px',
          marginBottom: 12,
        }}>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#182b49', fontWeight: 700, marginBottom: 4 }}>
            Description
          </div>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Type Here..."
            rows={3}
            style={{
              width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none',
              fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#000', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Hashtag input */}
        <div style={{
          background: 'rgba(255,255,255,0.40)', borderRadius: 12,
          border: '2px solid #000', padding: '10px 14px',
          marginBottom: 24,
        }}>
          <textarea
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Add Hashtags #"
            rows={2}
            style={{
              width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none',
              fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#000', boxSizing: 'border-box',
            }}
          />
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
            onClick={() => nav('/bulletin/publish?type=upload')}
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
