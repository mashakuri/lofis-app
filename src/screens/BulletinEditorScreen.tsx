/**
 * BulletinEditorScreen
 *
 * Template variant (169:440) — "CUSTOMIZE TEMPLATE": yellow preview, toolbar, effects search.
 * Upload variant  (169:697) — "CUSTOMIZE POSTER":   gray preview, same toolbar.
 *
 * Controlled by ?type=template|upload URL search param.
 */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CORK_BG = {
  background: '#b98f66',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
  backgroundBlendMode: 'multiply' as const,
};

export function BulletinEditorScreen() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const isUpload = params.get('type') === 'upload';

  const [editOpen, setEditOpen] = useState(false);
  const [description, setDescription] = useState('');

  const nextPath = isUpload ? '/bulletin/create/description' : `/bulletin/publish?type=template`;

  return (
    <div style={{ flex: 1, minHeight: 0, ...CORK_BG, display: 'flex', flexDirection: 'column' }}>

      {/* Fixed header block */}
      <div style={{ flexShrink: 0, position: 'relative', paddingTop: 85, paddingBottom: 16 }}>

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
          {isUpload
            ? <><span style={{ display: 'block' }}>CUSTOMIZE</span><span style={{ display: 'block' }}>POSTER</span></>
            : <><span style={{ display: 'block' }}>CUSTOMIZE</span><span style={{ display: 'block' }}>TEMPLATE</span></>
          }
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column' }}>

      {/* Poster preview */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, marginTop: 8 }}>
        <div style={{
          width: 240,
          height: 320,
          borderRadius: 5,
          background: isUpload ? '#e3e3e3' : '#ffea75',
          boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
        }} />
      </div>

      {/* Edit button + sub-options in one row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setEditOpen(o => !o)}
          style={{
            flexShrink: 0, height: 28, padding: '0 16px', borderRadius: 30,
            border: '1.5px solid #000', cursor: 'pointer',
            fontFamily: 'Lato, sans-serif', fontSize: 14,
            color: editOpen ? '#fff7e7' : '#000',
            background: editOpen ? '#182b49' : 'rgba(255,255,255,0.3)',
          }}
        >Edit</button>
        {editOpen && ['Add Text', 'Add Image', 'Add Shape', 'Add Sticker'].map(opt => (
          <button
            key={opt}
            style={{
              flexShrink: 0, height: 28, padding: '0 12px', borderRadius: 30,
              border: '1.5px solid rgba(0,0,0,0.4)', cursor: 'pointer',
              fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#182b49',
              background: 'rgba(255,255,255,0.40)',
            }}
          >{opt}</button>
        ))}
      </div>

      {/* Description write-in */}
      <div style={{
        background: 'rgba(255,255,255,0.40)', borderRadius: 12,
        border: '2px solid #000', padding: '10px 14px',
        marginBottom: 16,
      }}>
        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#182b49', fontWeight: 700, marginBottom: 4 }}>
          Description
        </div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Write a description for your poster..."
          rows={3}
          style={{
            width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'none',
            fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#000', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Nav row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16 }}>
        <button
          onClick={() => nav(-1)}
          style={{
            height: 36, padding: '0 20px', borderRadius: 999,
            border: '1.5px solid #000', background: 'rgba(255,255,255,0.3)',
            fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000', cursor: 'pointer',
          }}
        >Back</button>
        <button
          onClick={() => nav(nextPath)}
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
