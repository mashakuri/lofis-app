import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLofis } from '../context/LofisContext';

const POSTER_1 = 'https://www.figma.com/api/mcp/asset/de9e9b8b-7a95-4f79-a8f8-a4ee696095e9';
const POSTER_2 = 'https://www.figma.com/api/mcp/asset/a5edb261-f610-4f4e-93c7-ff6cef378db9';

const DATE_OPTIONS = ['Current - Future', 'Future - Current', 'Today', 'Next 3 Days'];
const TYPE_OPTIONS = ['Social', 'Academic', 'Sports', 'Performance', 'Food'];
const MAJOR_OPTIONS = ['CS', 'Biology', 'Engineering', 'Business', 'Arts'];

export function BulletinScreen() {
  const { canPost } = useLofis();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'All' | 'My Events'>('All');
  const [activeFilter, setActiveFilter] = useState('None');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const dropdownOptions: Record<string, string[]> = {
    Date: DATE_OPTIONS,
    Type: TYPE_OPTIONS,
    Major: MAJOR_OPTIONS,
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#ba9066',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
      position: 'relative',
    }} onClick={() => setShowDropdown(null)}>

      {/* Header */}
      <div style={{ padding: '12px 20px 0', flexShrink: 0, position: 'relative', minHeight: 140 }}>
        {/* Title - positioned top right */}
        <div style={{ position: 'absolute', top: 12, right: 20, left: 120 }}>
          <div style={{
            fontFamily: '"Black Han Sans", "Bebas Neue", Impact, "Arial Black", sans-serif',
            fontSize: 36,
            fontWeight: 900,
            color: '#1a2d4a',
            lineHeight: 1.05,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            COMMUNITY<br />BULLETIN
          </div>
        </div>

        {/* Bird - overlaps title from left */}
        <div style={{ position: 'absolute', bottom: -10, left: 10, zIndex: 2 }}>
          <img
            src="https://www.figma.com/api/mcp/asset/c655094c-de8a-40c0-956d-96105f618723"
            alt="mascot"
            style={{ width: 110, height: 110, objectFit: 'contain' }}
            onError={e => {
              // fallback to local mascot
              (e.currentTarget as HTMLImageElement).src = '/mascot.png';
            }}
          />
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '14px 16px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff7e7',
            borderRadius: 999,
            padding: '10px 16px',
            border: '1.5px solid rgba(26,45,74,0.2)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2d4a" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder="Browse clubs, events, more..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', background: 'none', outline: 'none',
                fontFamily: 'var(--font-lato)', fontSize: 14,
                color: '#1a2d4a', width: '100%',
              }}
            />
          </div>
          {canPost && (
            <button
              onClick={() => navigate('/bulletin/create')}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '2px solid #1a2d4a',
                background: 'transparent',
                cursor: 'pointer', fontSize: 20, fontWeight: 300,
                color: '#1a2d4a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>+</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8, flexShrink: 0 }}>
        {(['All', 'My Events'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 18px', borderRadius: 999,
            border: `2px solid #1a2d4a`,
            background: tab === t ? '#1a2d4a' : 'transparent',
            color: tab === t ? '#fff7e7' : '#1a2d4a',
            fontFamily: 'var(--font-lato)', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', position: 'relative',
          }}>
            {t}
            {t === 'My Events' && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: '#ff3d3d', color: 'white',
                borderRadius: 999, width: 16, height: 16,
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>5</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#1a2d4a', flexShrink: 0 }}>Filter</span>
        {['None', 'Date', 'Type', 'Major'].map(f => (
          <div key={f} style={{ position: 'relative' }}>
            <button onClick={e => {
              e.stopPropagation();
              setShowDropdown(showDropdown === f ? null : f);
              setActiveFilter(f);
            }} style={{
              padding: '4px 12px', borderRadius: 999,
              border: `1.5px solid #1a2d4a`,
              background: activeFilter === f ? '#1a2d4a' : 'transparent',
              color: activeFilter === f ? '#fff7e7' : '#1a2d4a',
              fontFamily: 'var(--font-lato)', fontWeight: 600, fontSize: 11,
              cursor: 'pointer', flexShrink: 0,
            }}>{f}</button>

            {/* Dropdown */}
            {showDropdown === f && dropdownOptions[f] && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 100,
                background: 'rgba(26,45,74,0.95)',
                borderRadius: 12, padding: '8px 0',
                marginTop: 4, minWidth: 150,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }} onClick={e => e.stopPropagation()}>
                {dropdownOptions[f].map(opt => (
                  <div key={opt} style={{
                    padding: '8px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', color: 'white', fontSize: 13,
                  }}>
                    <span>{opt}</span>
                    <span style={{ color: '#ffe552' }}>✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Poster Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { id: 'p1', img: POSTER_1, hasImage: true },
            { id: 'p2', img: POSTER_2, hasImage: true },
            { id: 'p3', img: null, hasImage: false },
            { id: 'p4', img: null, hasImage: false },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => navigate('/bulletin/event')}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                aspectRatio: '9/12',
                background: card.hasImage ? 'transparent' : 'rgba(217,217,217,0.7)',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>
              {card.hasImage && card.img ? (
                <img
                  src={card.img}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    (e.currentTarget.parentElement as HTMLElement).style.background = 'rgba(217,217,217,0.7)';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(26,45,74,0.2)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Down chevron */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 1L8 8L15 1" stroke="#1a2d4a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{
        height: 72,
        background: '#c4956a',
        borderRadius: '22px 22px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 20px 8px',
        flexShrink: 0,
      }}>
        {[
          { path: '/map', icon: (active: boolean) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff7e7' : '#1a2d4a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          )},
          { path: '/bulletin', icon: (active: boolean) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#fff7e7' : '#1a2d4a'} stroke={active ? '#fff7e7' : '#1a2d4a'} strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3" fill={active ? '#1a2d4a' : '#fff7e7'}/>
            </svg>
          )},
          { path: '/profile', icon: (active: boolean) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff7e7' : '#1a2d4a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )},
        ].map(({ path, icon }) => {
          const active = window.location.pathname === path || (path === '/bulletin' && window.location.pathname.startsWith('/bulletin'));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                border: 'none',
                background: active ? '#1a2d4a' : 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              {icon(active)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
