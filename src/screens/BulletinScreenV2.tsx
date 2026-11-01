/**
 * BulletinScreenV2 — Figma "Bonnie - Bulletin Board(2)" 407:2196
 * Detail view  — Figma "Bonnie - Bulletin Board"        261:2246
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLofis } from '../context/LofisContext';
import { assets } from '../data/figmaAssets';

const S  = 390 / 402;
const px = (n: number) => Math.round(n * S);

const FILTERS = ['Date', 'Type', 'Major'] as const;
type Filter   = typeof FILTERS[number] | null;
type DateType  = 'Today' | 'Next 3 Days' | 'This Week';
type EventType = 'Social' | 'Academic' | 'Sports' | 'Performance';

const DATE_OPTS: DateType[]  = ['Today', 'Next 3 Days', 'This Week'];
const TYPE_OPTS: EventType[] = ['Social', 'Academic', 'Sports', 'Performance'];
const MAJOR_OPTS             = ['Computer Science', 'Biology', 'Engineering', 'Business', 'Chemistry'];

const DROPDOWN_OPTS: Record<string, string[]> = {
  Date: DATE_OPTS,
  Type: TYPE_OPTS,
  Major: MAJOR_OPTS,
};

interface Poster {
  id:          string;
  img:         string | null;
  title:       string;
  club:        string;
  description: string;
  type:        EventType;
  dateType:    DateType;
  friends:     number;
}

const POSTERS: Poster[] = [
  {
    id:          'p1',
    img:         '/poster1.jpg',
    title:       'Spring Into ACM',
    club:        'ACM at UCSD',
    description: 'Come out to our first general meeting of the spring quarter! Meet the ACM board, learn about upcoming events, and connect with the CS community at UCSD. All majors welcome.',
    type:        'Social',
    dateType:    'Today',
    friends:     12,
  },
  {
    id:          'p2',
    img:         '/poster2.jpg',
    title:       'Summit Day Hike',
    club:        'TrailBlazers',
    description: 'Join us for a hike to Potato Chip Rock! One of San Diego\'s most iconic trails — stunning views, great company, and the perfect photo op. Bring water, snacks, and good shoes.',
    type:        'Sports',
    dateType:    'Next 3 Days',
    friends:     8,
  },
  {
    id:          'p3',
    img:         '/poster 3.jpg',
    title:       'Winter Info Session',
    club:        'DS3',
    description: 'Come watch DS3\'s end-of-quarter project showcase at the Dino Cage! Students will present their projects from this quarter — from ML models to data visualizations. Come support your peers!',
    type:        'Academic',
    dateType:    'This Week',
    friends:     5,
  },
  {
    id:          'p4',
    img:         '/poster4.jpg',
    title:       'Jazz Night Live',
    club:        'The Archive',
    description: 'Out the Archive (OTA) is back with our end-of-quarter showcase! See student project presentations alongside live music performances. A night celebrating creativity across code and sound.',
    type:        'Performance',
    dateType:    'Today',
    friends:     20,
  },
];

const CARD_W = px(140) + 4;
const CARD_H = 223;

// ─── Shared header (used in both grid and detail views) ───────────────────────
function BulletinHeader() {
  return (
    <div style={{ position: 'relative', height: 170, flexShrink: 0, marginTop: 53, paddingTop: 24 }}>
      <img
        src={assets.bulletinMascot}
        alt=""
        style={{
          position:  'absolute',
          top:       29,
          bottom:    -60,
          left:      0,
          width:     200,
          objectFit: 'contain',
          zIndex:    0,
        }}
        onError={e => (e.currentTarget.style.display = 'none')}
      />
      <div style={{
        position:         'absolute',
        top:              34,
        left:             0,
        right:            0,
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
        <span style={{ display: 'block' }}>COMMUNITY</span>
        <span style={{ display: 'block', marginLeft: 10 }}>BULLETIN</span>
      </div>
    </div>
  );
}

// ─── Placeholder card ─────────────────────────────────────────────────────────
function PlaceholderCard() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="36" height="32" viewBox="0 0 36 32" fill="none" opacity={0.25}>
        <rect x="1" y="1" width="34" height="30" rx="3" stroke="#182b49" strokeWidth="1.5"/>
        <circle cx="11" cy="11" r="3.5" stroke="#182b49" strokeWidth="1.5"/>
        <path d="M1 22l8-7 6 6 4-4 7 7" stroke="#182b49" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────
function DropdownBox({
  opts, checked, toggle,
}: {
  opts:    string[];
  checked: Set<string>;
  toggle:  (v: string) => void;
}) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background:   'rgba(255,247,231,0.90)',
        borderRadius: 10,
        padding:      '6px 10px',
        minWidth:     px(170),
        boxShadow:    '0 6px 20px rgba(0,0,0,0.28)',
        border:       '1px solid rgba(0,0,0,0.12)',
      }}
    >
      {opts.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            width:          '100%',
            padding:        '5px 4px',
            marginBottom:   2,
            border:         'none',
            borderRadius:   6,
            background:     'transparent',
            cursor:         'pointer',
            fontFamily:     'Lato, sans-serif',
            fontSize:       13,
            color:          '#182b49',
          }}
        >
          <span>{opt}</span>
          <div style={{
            width:          13,
            height:         13,
            borderRadius:   2,
            flexShrink:     0,
            marginLeft:     8,
            background:     checked.has(opt) ? '#182b49' : 'rgba(255,255,255,0.7)',
            border:         '1.5px solid #182b49',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            {checked.has(opt) && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Detail view — Figma 261:2246 ────────────────────────────────────────────
function DetailView({ poster, onBack }: { poster: Poster; onBack: () => void }) {
  const { saved, toggleSave } = useLofis();
  const isSaved = saved.has(poster.id);
  return (
    <div style={{
      position:        'absolute',
      inset:           0,
      zIndex:          50,
      display:         'flex',
      flexDirection:   'column',
      overflowY:       'auto',
      scrollbarWidth:  'none',
      // same cork bg as PhoneLayout so it fully covers the grid
      background:      '#b98f66',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.40'/%3E%3C/svg%3E")`,
      backgroundSize:  '200px 200px',
    }}>
      {/* Poster image — centered, with top margin so it sits below the Dynamic Island */}
      <div style={{ position: 'relative', flexShrink: 0, padding: '86px 11px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width:        '96%',
          aspectRatio:  '3/4',
          overflow:     'hidden',
          background:   '#e3e3e3',
          borderRadius: 8,
          boxShadow:    '0 4px 16px rgba(0,0,0,0.3)',
        }}>
          {poster.img ? (
            <img
              src={poster.img}
              alt={poster.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <PlaceholderCard />
          )}
        </div>

        {/* Close button — top-right, white ×, no background */}
        <button
          onClick={onBack}
          style={{
            position:   'absolute',
            top:        35,
            right:      26,
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      '#182b49',
            fontSize:   26,
            lineHeight: 1,
            padding:    4,
          }}
          aria-label="Close"
        >×</button>
      </div>

      {/* Club row: avatar | name | + button ··· chat | bell */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        padding:     '10px 20px',
        gap:         8,
        marginTop:   5,
        flexShrink:  0,
      }}>
        {/* Avatar circle */}
        <div style={{
          width:          32,
          height:         32,
          borderRadius:   '50%',
          background:     'rgba(0,0,0,0.18)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#fff7e7" strokeWidth="1.8"/>
            <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="#fff7e7" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Club name */}
        <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 700, color: '#182b49', flex: 1 }}>
          {poster.club}
        </span>

        {/* Follow button — + when not saved, ✓ on white when saved */}
        <button
          onClick={() => toggleSave(poster.id)}
          style={{
            background:     isSaved ? '#fff7e7' : 'none',
            border:         '1.5px solid #182b49',
            borderRadius:   '50%',
            width:          22,
            height:         22,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          '#182b49',
            fontSize:       isSaved ? 13 : 16,
            lineHeight:     1,
            padding:        0,
            flexShrink:     0,
            transition:     'background 0.15s',
          }}
        >
          {isSaved ? (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" style={{ marginLeft: 1 }}>
              <path d="M1 4.5L4 7.5L10 1" stroke="#182b49" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1V10M1 5.5H10" stroke="#182b49" strokeWidth="1.8" strokeLinecap="square"/>
            </svg>
          )}
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Chat icon */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="#182b49" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Bell icon */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="#182b49" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Description box */}
      <div style={{
        margin:       '0 20px 10px',
        background:   'rgba(255,247,231,0.7)',
        borderRadius: 12,
        padding:      '12px 14px',
        flexShrink:   0,
      }}>
        <p style={{
          margin:     0,
          fontFamily: 'Lato, sans-serif',
          fontSize:   13,
          color:      poster.description ? '#182b49' : 'rgba(24,43,73,0.4)',
          lineHeight: '1.5',
        }}>
          {poster.description || 'Description...'}
        </p>
      </div>

      {/* Friends saved row */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        padding:     '4px 20px 20px',
        flexShrink:  0,
      }}>
        <span style={{
          fontFamily: 'Lato, sans-serif',
          fontSize:   13,
          color:      '#182b49',
          fontWeight: 600,
          flex:       1,
        }}>
          {poster.friends}+ Friends Saved This Event
        </span>
        {/* Globe icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#182b49" strokeWidth="1.8"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
            stroke="#182b49" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function BulletinScreenV2() {
  const { saved } = useLofis();
  const navigate = useNavigate();

  const [tab,            setTab]            = useState<'All' | 'My Events'>('All');
  const [activeFilter,   setActiveFilter]   = useState<Filter>(null);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [checkedDate,    setCheckedDate]    = useState<Set<string>>(new Set());
  const [checkedType,    setCheckedType]    = useState<Set<string>>(new Set());
  const [checkedMajor,   setCheckedMajor]   = useState<Set<string>>(new Set());
  const [search,         setSearch]         = useState('');
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);

  const toggleDate  = (v: string) => setCheckedDate(p  => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; });
  const toggleType  = (v: string) => setCheckedType(p  => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; });
  const toggleMajor = (v: string) => setCheckedMajor(p => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; });

  const onFilterClick = (f: Filter) => {
    if (f && DROPDOWN_OPTS[f]) {
      setShowDropdown(prev => activeFilter !== f ? true : !prev);
    } else {
      setShowDropdown(false);
    }
    setActiveFilter(f);
  };

  const closeDropdown = () => setShowDropdown(false);

  // Filtering
  const filteredPosters = POSTERS.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.club.toLowerCase().includes(q)) return false;
    }
    if (checkedDate.size > 0 && !checkedDate.has(p.dateType)) return false;
    if (checkedType.size > 0 && !checkedType.has(p.type))     return false;
    return true;
  });

  return (
    <div
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}
      onClick={closeDropdown}
    >
      {/* ── STATIC HEADER BLOCK (does not scroll) ────────────────────── */}
      <div style={{ flexShrink: 0, position: 'relative' }}>

        {/* Header */}
        <BulletinHeader />

        {/* Search + "+" */}
        <div style={{
          position:     'relative',
          zIndex:       1,
          display:      'flex',
          alignItems:   'center',
          paddingLeft:  px(51),
          paddingRight: px(50),
          gap:          px(10),
          marginTop:    8,
          marginBottom: px(10),
          flexShrink:   0,
        }}>
          <div style={{
            flex:         1,
            height:       px(32),
            background:   '#fff7e7',
            borderRadius: px(130),
            border:       '3px solid #000',
            display:      'flex',
            alignItems:   'center',
            padding:      `0 ${px(12)}px`,
            gap:          6,
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#182b49" strokeWidth="1.5"/>
              <path d="M9 9l4 4" stroke="#182b49" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="Browse clubs, events, more..."
              style={{
                border:      'none',
                background:  'none',
                outline:     'none',
                fontFamily:  'Lato, sans-serif',
                fontSize:    10,
                color:       '#182b49',
                width:       '100%',
              }}
            />
            {search && (
              <button
                onClick={e => { e.stopPropagation(); setSearch(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(0,0,0,0.4)', fontSize: 14, lineHeight: 1, flexShrink: 0 }}
              >×</button>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); navigate('/bulletin/create'); }}
            style={{
              background:       'none',
              border:           'none',
              cursor:           'pointer',
              padding:          0,
              fontFamily:       'Inter, sans-serif',
              fontSize:         px(25),
              fontWeight:       400,
              color:            '#fff7e7',
              WebkitTextStroke: '2.5px #000',
              paintOrder:       'stroke fill',
              lineHeight:       1,
              width:            px(17),
              display:          'flex',
              alignItems:       'center',
              justifyContent:   'center',
              flexShrink:       0,
            }}
          >+</button>
        </div>

        {/* Tabs */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          paddingLeft:  px(22),
          gap:          px(13),
          position:     'relative',
          top:          -8,
          marginTop:    25,
          marginBottom: px(6),
          flexShrink:   0,
        }}>
          <button
            onClick={e => { e.stopPropagation(); setTab('All'); }}
            style={{
              width:        px(46),
              height:       px(28),
              borderRadius: px(30),
              border:       '2px solid #000',
              cursor:       'pointer',
              fontFamily:   'Lato, sans-serif',
              fontSize:     px(15),
              fontWeight:   400,
              color:        tab === 'All' ? '#fff7e7' : '#000',
              background:   tab === 'All' ? '#182b49' : 'rgba(255,255,255,0.3)',
              flexShrink:   0,
            }}
          >All</button>
          <button
            onClick={e => { e.stopPropagation(); setTab('My Events'); closeDropdown(); }}
            style={{
              width:        px(88),
              height:       px(28),
              borderRadius: px(30),
              border:       '2px solid #000',
              cursor:       'pointer',
              fontFamily:   'Lato, sans-serif',
              fontSize:     px(15),
              fontWeight:   400,
              color:        '#000',
              background:   tab === 'My Events' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
            }}
          >My Events</button>
        </div>

        {/* Filter row */}
        {tab === 'All' && (
          <div style={{
            display:     'flex',
            alignItems:  'center',
            paddingLeft: px(28),
            gap:         px(8),
            flexShrink:  0,
          }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: px(15), color: '#fff', flexShrink: 0 }}>
              Filter
            </span>
            <div style={{ display: 'flex', gap: px(8), overflowX: 'visible', scrollbarWidth: 'none' }}>
              {FILTERS.map(f => {
                const opts = f === 'Date' ? DATE_OPTS : f === 'Type' ? TYPE_OPTS : f === 'Major' ? MAJOR_OPTS : null;
                const checked = f === 'Date' ? checkedDate : f === 'Type' ? checkedType : checkedMajor;
                const toggle  = f === 'Date' ? toggleDate  : f === 'Type' ? toggleType  : toggleMajor;
                return (
                  <div key={f} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      onClick={e => { e.stopPropagation(); onFilterClick(f); }}
                      style={{
                        height:       px(28),
                        padding:      `0 ${px(12)}px`,
                        borderRadius: px(30),
                        border:       '2px solid #000',
                        cursor:       'pointer',
                        fontFamily:   'Lato, sans-serif',
                        fontSize:     px(15),
                        fontWeight:   400,
                        color:        '#000',
                        background:   activeFilter === f ? '#fff7e7' : 'rgba(255,255,255,0.3)',
                        display:      'block',
                      }}
                    >{f}</button>
                    {showDropdown && activeFilter === f && opts && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 300, marginTop: 4 }}>
                        <DropdownBox opts={opts} checked={checked} toggle={toggle} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>{/* end static header block */}

      {/* 3px boundary below the filter row */}
      <div style={{ height: 3, flexShrink: 0 }} />

      {/* ── SCROLL CONTAINER (poster grid only) ──────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>

        {/* Poster grid */}
        {tab === 'My Events' ? (() => {
          const savedPosters = POSTERS.filter(p => saved.has(p.id));
          return savedPosters.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" opacity={0.35}>
                <path d="M8 12h32v28a2 2 0 01-2 2H10a2 2 0 01-2-2V12z" stroke="#fff7e7" strokeWidth="2"/>
                <path d="M4 12h40M16 12V8a2 2 0 012-2h12a2 2 0 012 2v4" stroke="#fff7e7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: 'rgba(255,247,231,0.7)', margin: 0 }}>
                No saved events yet
              </p>
            </div>
          ) : (
            <div style={{
              display:             'grid',
              gridTemplateColumns: `${CARD_W}px ${CARD_W}px`,
              columnGap:           `${px(30)}px`,
              rowGap:              `${px(36)}px`,
              marginLeft:          `${px(48) - 2}px`,
              paddingTop:          `${px(14)}px`,
              paddingBottom:       `${px(8)}px`,
            }}>
              {savedPosters.map(p => (
                <div key={p.id} onClick={() => setSelectedPoster(p)}
                  style={{ width: CARD_W, height: CARD_H, borderRadius: 4, background: '#e3e3e3',
                           overflow: 'hidden', boxShadow: '0 4px 4px rgba(0,0,0,0.25)', cursor: 'pointer' }}>
                  {p.img
                    ? <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    : <PlaceholderCard />}
                </div>
              ))}
            </div>
          );
        })() : filteredPosters.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: 'rgba(255,247,231,0.7)', margin: 0 }}>
              No events match your search
            </p>
          </div>
        ) : (
          <div style={{
            display:             'grid',
            gridTemplateColumns: `${CARD_W}px ${CARD_W}px`,
            columnGap:           `${px(30)}px`,
            rowGap:              `${px(36)}px`,
            marginLeft:          `${px(48) - 2}px`,
            paddingTop:          `${px(14)}px`,
            paddingBottom:       `${px(8)}px`,
          }}>
            {filteredPosters.map(p => (
              <div
                key={p.id}
                onClick={e => { e.stopPropagation(); setSelectedPoster(p); }}
                style={{
                  width:        CARD_W,
                  height:       CARD_H,
                  borderRadius: 4,
                  background:   '#e3e3e3',
                  overflow:     'hidden',
                  boxShadow:    '0 4px 4px rgba(0,0,0,0.25)',
                  flexShrink:   0,
                  cursor:       'pointer',
                }}
              >
                {p.img ? (
                  <img
                    src={p.img}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <PlaceholderCard />
                )}
              </div>
            ))}
          </div>
        )}

      </div>{/* end scroll container */}

      {/* Detail view overlay */}
      {selectedPoster && (
        <DetailView
          poster={selectedPoster}
          onBack={() => setSelectedPoster(null)}
        />
      )}
    </div>
  );
}
