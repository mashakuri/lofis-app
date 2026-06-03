/**
 * BulletinTemplateScreen — Figma "Bonnie - Create Poster (Template Browser)" 169:583
 *
 * Cork bg, "CHOOSE TEMPLATE" heading.
 * Search bar + filter chips.
 * 2 template cards: blue (#8eadff) and coral (#ff7575), 149×203.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CORK_BG = {
  background: '#b98f66',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
  backgroundBlendMode: 'multiply' as const,
};

const FILTER_CHIPS = ['Poster Style', 'Event Type', 'Color'] as const;
const TEMPLATES = [
  { id: 't1', color: '#8eadff', label: 'Academic' },
  { id: 't2', color: '#ff7575', label: 'Social'   },
  { id: 't3', color: '#95f489', label: 'Workshop' },
  { id: 't4', color: '#ffea75', label: 'Food'     },
];

export function BulletinTemplateScreen() {
  const nav = useNavigate();
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  return (
    <div style={{ flex: 1, overflowY: 'auto', ...CORK_BG, display: 'flex', flexDirection: 'column', padding: '0 16px 24px', position: 'relative' }}>

      {/* X close button */}
      <button
        onClick={() => nav(-1)}
        style={{
          position: 'absolute', top: 108, right: 26,
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
        marginTop:        80,
        marginBottom:     20,
      }}>
        <span style={{ display: 'block' }}>CHOOSE</span>
        <span style={{ display: 'block' }}>TEMPLATE</span>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 32, padding: '0 14px',
        background: '#fff7e7', borderRadius: 130,
        border: '2px solid #000', marginBottom: 12,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#000" strokeWidth="1.5"/>
          <path d="M10 10L13 13" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Keyword Search..."
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#000',
          }}
        />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: 'white', flexShrink: 0 }}>Filter</span>
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => setActiveChip(c => c === chip ? null : chip)}
            style={{
              flexShrink: 0, height: 28, padding: '0 12px', borderRadius: 30,
              border: '2px solid #000', cursor: 'pointer',
              fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#000',
              background: activeChip === chip ? '#fff' : 'rgba(255,255,255,0.3)',
            }}
          >{chip}</button>
        ))}
      </div>

      {/* Template grid: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px', justifyItems: 'center' }}>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => nav(`/bulletin/editor?type=template&color=${encodeURIComponent(t.color)}`)}
            style={{
              width: 149, height: 203, borderRadius: 5,
              background: t.color, border: '2px solid rgba(0,0,0,0.1)',
              cursor: 'pointer', display: 'flex', alignItems: 'flex-end',
              padding: 8, boxShadow: '0 4px 4px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#182b49', fontWeight: 700 }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
