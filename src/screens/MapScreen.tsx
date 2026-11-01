/**
 * MapScreen — Figma "Masha - Map/Home Screen" 228:2944
 *
 * Calendar overlay: date-range selection (start → end, strip between).
 * After GO: event panel slides up with ALL/MINE toggle + category accordions.
 * Filter dropdown hides/shows map pins by category.
 * Tap a pin → event detail bottom sheet.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../data/figmaAssets';
import { PINS, UCSD, PIN_HEX } from '../data/pins';
import type { EventPin } from '../types';

declare global { interface Window { L: any } }

const FILTERS = ['All', 'Clubs', 'Events', 'Fairs', 'Food'];
const MONTHS  = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAYS    = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const PIN_DETAILS: Record<string, { date: string; location: string; description: string }> = {
  '1': { date: 'Jun 7 · 11AM – 4PM',  location: 'Price Center Plaza',  description: 'Annual engineering showcase featuring student projects from all disciplines.' },
  '2': { date: 'Jun 5 · 2PM – 5PM',   location: 'EBU2 Courtyard',      description: 'Weekly robotics club meetup — open to all skill levels.' },
  '3': { date: 'Jun 10 · 10AM – 3PM', location: 'Library Walk',         description: 'Explore 200+ student orgs and find your community.' },
  '4': { date: 'Every Fri · 11AM',    location: 'Warren Mall',          description: 'Local food trucks serving lunch on the Warren side of campus.' },
  '5': { date: 'Jun 6 · 6PM – 8PM',   location: 'Jacobs Hall 2512',    description: 'General meeting — portfolio reviews and creative workshops.' },
  '6': { date: 'Jun 8 · 4PM – 7PM',   location: 'Geisel Library Lawn', description: 'Casual study mixer to connect with students before finals week.' },
};

const MESSAGES = [
  { id: 'new', name: 'NEW CHAT',  preview: 'begin networking here...',               isNew: true,  dot: false, pin: false },
  { id: 'm1',  name: 'ASCE',      preview: 'lemme be on the next button plsssss...',  isNew: false, dot: false, pin: true  },
  { id: 'm2',  name: 'ACM',       preview: 'how do you not know when the showcas...', isNew: false, dot: true,  pin: false },
  { id: 'm3',  name: 'JANE DOE',  preview: 'hey do you know when the info sesh is tn?', isNew: false, dot: false, pin: false },
  { id: 'm4',  name: 'DCO',       preview: "what's a portfolio?",                     isNew: false, dot: false, pin: false },
];

/** Event categories shown in the post-GO panel */
const EVENT_CATS = [
  {
    id: 'party', label: 'PARTY / SOCIALS', color: '#ffa144',
    events: ['End of Year Party', 'Welcome Mixer', 'Game Night'],
  },
  {
    id: 'academic', label: 'ACADEMIC', color: '#4a7bfa',
    events: ['Study Session', 'Research Symposium', 'Workshop Wed'],
  },
  {
    id: 'concert', label: 'CONCERT / LARGE EVENTS', color: '#a855f7',
    events: ['SunGod Festival', 'Open Mic Night'],
  },
];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

type Overlay = 'calendar' | 'messages' | 'network' | null;

function makePinIcon(hex: string, label: string) {
  const svg  = `<svg viewBox="0 0 26 34" width="26" height="34" xmlns="http://www.w3.org/2000/svg"><path d="M13 0C5.82 0 0 5.82 0 13c0 8.78 11.36 19.8 12.42 20.8a.83.83 0 0 0 1.16 0C14.64 32.8 26 21.78 26 13 26 5.82 20.18 0 13 0z" fill="${hex}"/><circle cx="13" cy="12" r="5" fill="white"/></svg>`;
  const chip = `<div style="background:white;border-radius:4px;padding:2px 6px;margin-top:2px;white-space:nowrap;font-family:Inter,sans-serif;font-size:10px;color:#182b49;box-shadow:0 1px 3px rgba(0,0,0,0.18);line-height:1.4">${label}</div>`;
  return `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">${svg}${chip}</div>`;
}

/** Small inline pin icon for category rows */
function CatPin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 20" width="12" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 12 8 12s8-6.75 8-12C16 3.58 12.42 0 8 0z" fill={color}/>
      <circle cx="8" cy="8" r="3" fill="white"/>
    </svg>
  );
}

/** Checkbox square — tickColor lets callers use blue ticks */
function Checkbox({ checked, onChange, tickColor = '#182b49' }: { checked: boolean; onChange: () => void; tickColor?: string }) {
  return (
    <button onClick={onChange} style={{
      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
      border: '1.5px solid rgba(255,247,231,0.4)',
      background: checked ? '#fff7e7' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l3 3 5-6" stroke={tickColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

export function MapScreen() {
  const navigate       = useNavigate();
  const mapRef            = useRef<HTMLDivElement>(null);
  const mapInstanceRef    = useRef<any>(null);
  const markersRef        = useRef<Map<string, any>>(new Map());
  const networkMarkersRef = useRef<any[]>([]);

  const [filter, setFilter]           = useState('All');
  const [showFilter, setShowFilter]   = useState(false);
  const [overlay, setOverlay]         = useState<Overlay>(null);
  const [selectedPin, setSelectedPin] = useState<EventPin | null>(null);

  // Calendar range state
  const [calMonth, setCalMonth]       = useState(new Date().getMonth());
  const [calYear]                     = useState(new Date().getFullYear());
  const [rangeStart, setRangeStart]   = useState<number | null>(null);
  const [rangeEnd, setRangeEnd]       = useState<number | null>(null);

  // Post-GO event panel state
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [eventScope, setEventScope]         = useState<'ALL' | 'MINE'>('ALL');
  const [selectAll, setSelectAll]           = useState(false);
  const [expandedCats, setExpandedCats]     = useState<Set<string>>(new Set());
  const [checkedCats, setCheckedCats]       = useState<Set<string>>(new Set());
  const [checkedEvents, setCheckedEvents]   = useState<Set<string>>(new Set());

  // ── Init map + markers ───────────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;
    const tryInit = () => {
      if (!window.L) { setTimeout(tryInit, 200); return; }
      const map = window.L.map(mapRef.current!, {
        center: UCSD, zoom: 15,
        zoomControl: false, attributionControl: true,
      });
      map.attributionControl.setPrefix(false);
      // OpenStreetMap tiles: free, no API key (Carto now requires one and showed a watermark)
      window.L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
      ).addTo(map);

      PINS.forEach(pin => {
        const icon = window.L.divIcon({
          className: '',
          html: makePinIcon(PIN_HEX[pin.color], pin.title),
          iconSize: [120, 56], iconAnchor: [13, 34],
        });
        const marker = window.L.marker([pin.lat, pin.lng], { icon })
          .on('click', () => { setSelectedPin(pin); setShowFilter(false); setOverlay(null); });
        marker.addTo(map);
        markersRef.current.set(pin.id, marker);
      });
      mapInstanceRef.current = map;
    };
    tryInit();
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; markersRef.current.clear(); };
  }, []);

  // ── Network people markers ───────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const NETWORK_PEOPLE = [
      { lat: 32.8821, lng: -117.2365, color: '#ffa144' },
      { lat: 32.8808, lng: -117.2350, color: '#ff3d3d' },
      { lat: 32.8795, lng: -117.2318, color: '#ff3d3d' },
      { lat: 32.8785, lng: -117.2330, color: '#95f489' },
      { lat: 32.8800, lng: -117.2310, color: '#4a7bfa' },
      { lat: 32.8812, lng: -117.2295, color: '#182b49' },
      { lat: 32.8775, lng: -117.2345, color: '#ffa144' },
      { lat: 32.8830, lng: -117.2380, color: '#4a7bfa' },
      { lat: 32.8768, lng: -117.2360, color: '#95f489' },
      { lat: 32.8840, lng: -117.2325, color: '#ff3d3d' },
    ];
    if (overlay === 'network') {
      NETWORK_PEOPLE.forEach(p => {
        const icon = window.L.divIcon({
          className: '',
          html: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 3px ${p.color})"><circle cx="12" cy="8" r="4" fill="${p.color}"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="${p.color}"/></svg>`,
          iconSize: [22, 22], iconAnchor: [11, 11],
        });
        const m = window.L.marker([p.lat, p.lng], { icon }).addTo(mapInstanceRef.current);
        networkMarkersRef.current.push(m);
      });
    } else {
      networkMarkersRef.current.forEach(m => m.remove());
      networkMarkersRef.current = [];
    }
  }, [overlay]);

  // ── Filter markers by category ───────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach((marker, id) => {
      const pin     = PINS.find(p => p.id === id);
      if (!pin) return;
      const visible = filter === 'All' || pin.category === filter;
      if (visible) { if (!mapInstanceRef.current.hasLayer(marker)) marker.addTo(mapInstanceRef.current); }
      else { mapInstanceRef.current.removeLayer(marker); }
    });
  }, [filter]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay    = getFirstDay(calYear, calMonth);

  // ── Range selection logic ────────────────────────────────────────
  const handleDayTap = (d: number) => {
    if (rangeStart === null || rangeEnd !== null) {
      // Start fresh
      setRangeStart(d); setRangeEnd(null);
    } else {
      // Complete the range
      if (d < rangeStart) { setRangeStart(d); setRangeEnd(rangeStart); }
      else if (d === rangeStart) { setRangeStart(null); }
      else { setRangeEnd(d); }
    }
  };

  const lo = rangeStart !== null && rangeEnd !== null ? Math.min(rangeStart, rangeEnd) : rangeStart;
  const hi = rangeStart !== null && rangeEnd !== null ? Math.max(rangeStart, rangeEnd) : rangeStart;

  const isEndpoint  = (d: number) => d === lo || d === hi;
  const isInRange   = (d: number) => lo !== null && hi !== null && d > lo && d < hi;
  const hasRange    = rangeStart !== null && rangeEnd !== null;

  // ── Overlay helpers ──────────────────────────────────────────────
  const openOverlay = (o: Overlay) => {
    setShowFilter(false); setSelectedPin(null); setOverlay(prev => prev === o ? null : o);
  };
  const fabBg   = (o: Overlay) => overlay === o ? '#182b49' : '#fff7e7';
  const fabFilt = (o: Overlay) => overlay === o ? 'invert(1)' : 'none';

  // ── Select-all toggle ────────────────────────────────────────────
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedCats(new Set()); setCheckedEvents(new Set()); setSelectAll(false);
    } else {
      setCheckedCats(new Set(EVENT_CATS.map(c => c.id)));
      const allEvt = new Set(EVENT_CATS.flatMap(c => c.events));
      setCheckedEvents(allEvt); setSelectAll(true);
    }
  };

  const toggleCat = (id: string) => {
    const next = new Set(checkedCats);
    const cat  = EVENT_CATS.find(c => c.id === id)!;
    const nextEvt = new Set(checkedEvents);
    if (next.has(id)) { next.delete(id); cat.events.forEach(e => nextEvt.delete(e)); }
    else              { next.add(id);    cat.events.forEach(e => nextEvt.add(e));    }
    setCheckedCats(next); setCheckedEvents(nextEvt);
    setSelectAll(next.size === EVENT_CATS.length);
  };

  const toggleEvent = (catId: string, evt: string) => {
    const nextEvt = new Set(checkedEvents);
    if (nextEvt.has(evt)) { nextEvt.delete(evt); }
    else                  { nextEvt.add(evt); }
    setCheckedEvents(nextEvt);
    // Sync cat checkbox
    const cat     = EVENT_CATS.find(c => c.id === catId)!;
    const allEvts = cat.events.every(e => nextEvt.has(e));
    const nextCat = new Set(checkedCats);
    if (allEvts) nextCat.add(catId); else nextCat.delete(catId);
    setCheckedCats(nextCat);
    setSelectAll(nextCat.size === EVENT_CATS.length);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* ── Map canvas ── */}
      <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* ── Right FAB column — hidden when calendar is open ── */}
      <div style={{
        position: 'absolute', top: 48, right: 12, zIndex: 50,
        display: overlay === 'calendar' ? 'none' : 'flex',
        flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      }}>
        <button onClick={() => { setShowFilter(s => !s); setOverlay(null); setSelectedPin(null); }} style={{
          height: 33, padding: '0 12px 0 16px', borderRadius: 25,
          background: showFilter ? '#fff7e7' : '#182b49', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 400, color: showFilter ? '#182b49' : '#fff7e7' }}>FILTER</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 2h12l-4.5 5.5V12l-3-1.5V7.5L1 2z" stroke={showFilter ? '#182b49' : '#fff7e7'} strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        <button onClick={() => openOverlay('calendar')} style={{
          width: 50, height: 50, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: fabBg('calendar'), display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <img src={assets.calendarIcon} width={27} height={28}
            style={{ objectFit: 'contain', filter: fabFilt('calendar') }}
            onError={e => (e.currentTarget.style.display = 'none')} />
        </button>

        <button onClick={() => openOverlay('messages')} style={{
          width: 50, height: 50, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: fabBg('messages'), position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <img src={assets.messageIcon} width={27} height={27}
            style={{ objectFit: 'contain', filter: fabFilt('messages') }}
            onError={e => (e.currentTarget.style.display = 'none')} />
          <div style={{ position: 'absolute', top: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#ff3d3d', border: '1.5px solid white' }} />
        </button>

        <button onClick={() => openOverlay('network')} style={{
          width: 50, height: 50, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: fabBg('network'), display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <img src={assets.globeIcon} width={27} height={28}
            style={{ objectFit: 'contain', filter: fabFilt('network') }}
            onError={e => (e.currentTarget.style.display = 'none')} />
        </button>
      </div>

      {/* ── Filter dropdown — z:55 so it floats above FABs (z:50) ── */}
      {showFilter && (
        <>
          <div style={{ position: 'absolute', inset: 0, zIndex: 52 }} onClick={() => setShowFilter(false)} />
          <div style={{
            position: 'absolute', top: 90, right: 12, zIndex: 55,
            background: '#182b49', borderRadius: 16, padding: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            display: 'flex', flexDirection: 'column', gap: 6, minWidth: 130,
          }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setFilter(f); setShowFilter(false); }} style={{
                height: 34, borderRadius: 25, border: 'none', cursor: 'pointer',
                background: filter === f ? '#fff7e7' : 'rgba(255,247,231,0.1)',
                color: filter === f ? '#182b49' : '#fff7e7',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
                padding: '0 16px', textAlign: 'center',
              }}>{f}</button>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CALENDAR + EVENTS — two separate cards                        */}
      {/* Calendar card stays fixed; navy events card slides up below.  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {overlay === 'calendar' && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 40 }}
          onClick={() => { setOverlay(null); setShowEventPanel(false); }}
        >
          <style>{`
            @keyframes calEvtSlideUp {
              from { transform: translateY(40px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>

          {/* Exit button — top-right where FABs normally sit */}
          <button
            onClick={() => { setOverlay(null); setShowEventPanel(false); }}
            style={{
              position: 'absolute', top: 48, right: 12, zIndex: 50,
              width: 50, height: 50, borderRadius: '50%',
              background: '#fff7e7', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#182b49" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Flex column: calendar card then events card, natural height */}
          <div
            style={{
              position: 'absolute',
              top: 95, left: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
            onClick={e => e.stopPropagation()}
          >

            {/* ── CALENDAR CARD ── */}
            {/* Background: rgba(59,73,95,1) fully opaque, r=15 — matches Figma exactly */}
            <div style={{
              background: 'rgba(59,73,95,1)',
              borderRadius: 15,
              flexShrink: 0,
              padding: '12px 17px 12px',
              position: 'relative',
            }}>
              {/* Bird centred, top near card edge; "Select Date(s)" centred in front */}
              <div style={{ position: 'relative', height: 52, marginBottom: 6 }}>
                <img
                  src={assets.overlayMascot} alt=""
                  style={{
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -12,
                    width: 64, height: 56, objectFit: 'contain', zIndex: 0,
                  }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  textAlign: 'center',
                  fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 400,
                  color: '#ffffff', zIndex: 1,
                }}>Select Date(s)</span>
              </div>

              {/*
               * Month nav — Figma "Group 19" + "Frame 2"
               * Navy pill 139×38 r=25; arrows (9×9 icon) sit INSIDE the pill
               * "JANUARY" = Inter 700 16px cream, centered between arrows
               */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#182b49', borderRadius: 25,
                  height: 38, width: 139, padding: '0 9px',
                }}>
                  <button onClick={() => setCalMonth(m => m === 0 ? 11 : m - 1)} style={{
                    width: 16, height: 16, background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M6 1.5L2 4.5l4 3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700,
                    color: '#fff7e7', letterSpacing: '0.01em',
                  }}>{MONTHS[calMonth]}</span>
                  <button onClick={() => setCalMonth(m => m === 11 ? 0 : m + 1)} style={{
                    width: 16, height: 16, background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M3 1.5l4 3-4 3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Day-of-week headers — Figma: Geist 400 13.7px cream; we use Inter */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {DAYS.map(d => (
                  <div key={d} style={{
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif', fontSize: 13,
                    color: '#fff7e7', padding: '3px 0',
                  }}>{d}</div>
                ))}
              </div>

              {/*
               * Date grid — Figma: each cell 46×46, borderRadius 9.1
               * Endpoint fill: rgba(24,43,73,1) = #182b49, text: #fff7e7, Inter 400 18px
               * In-range fill: rgba(255,247,231,1) = #fff7e7, text: rgba(44,44,44,1) = #2c2c2c
               * Unselected: no fill, text: #fff7e7
               */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`b${i}`} style={{ height: 44 }} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d        = i + 1;
                  const endpoint = isEndpoint(d);
                  const inRange  = isInRange(d);
                  const selected = endpoint || inRange;

                  // Figma: endpoint rgba(24,43,73,1), in-range rgba(255,247,231,0.82) — slightly muted cream
                  const cellBg  = endpoint ? 'rgba(24,43,73,0.95)' : inRange ? 'rgba(255,247,231,0.82)' : 'transparent';
                  const txtCol  = endpoint ? '#fff7e7' : inRange ? '#2c2c2c' : 'rgba(255,247,231,0.85)';

                  return (
                    <div key={d} style={{
                      position: 'relative', height: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && (
                        <div style={{
                          position: 'absolute',
                          width: 38, height: 38, borderRadius: 9,
                          background: cellBg, zIndex: 0,
                        }} />
                      )}
                      <button onClick={() => handleDayTap(d)} style={{
                        position: 'relative', zIndex: 1,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Inter, sans-serif', fontSize: 17,
                        color: txtCol, fontWeight: 400,
                      }}>{d}</button>
                    </div>
                  );
                })}
              </div>

              {/* GO! — appears when full range selected, hidden after GO tapped */}
              {hasRange && !showEventPanel && (
                <button onClick={() => setShowEventPanel(true)} style={{
                  display: 'block', width: '100%', marginTop: 12,
                  height: 40, borderRadius: 25,
                  background: '#182b49', color: '#fff7e7',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700,
                }}>GO!</button>
              )}
            </div>

            {/* ── EVENTS CARD — separate navy card, slides up below calendar ── */}
            {showEventPanel && (
              <div style={{
                background: '#182b49',
                borderRadius: 15,
                maxHeight: 270,
                overflowY: 'auto',
                padding: '0 14px 14px',
                animation: 'calEvtSlideUp 0.25s ease',
              }}>

                {/* Row: ▲ · Event(s) · ALL · MINE */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 0 8px',
                  position: 'sticky', top: 0, background: '#182b49', zIndex: 2,
                }}>
                  <button onClick={() => setShowEventPanel(false)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'rgba(255,247,231,0.6)', fontSize: 13, lineHeight: 1,
                  }}>▲</button>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700,
                    color: '#fff7e7', flex: 1,
                  }}>Event(s)</span>
                  {/* Figma: both pills cream 60×32 r=21, Inter 700 14px navy — active = full opacity */}
                  {(['ALL', 'MINE'] as const).map(s => (
                    <button key={s} onClick={() => setEventScope(s)} style={{
                      width: 60, height: 32, borderRadius: 21, border: 'none', cursor: 'pointer',
                      background: '#fff7e7',
                      fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700,
                      color: '#182b49', opacity: eventScope === s ? 1 : 0.45,
                    }}>{s}</button>
                  ))}
                </div>

                {/* Select All — own row, label left, checkbox right */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,247,231,0.12)',
                  marginBottom: 2,
                }}>
                  <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 13, color: '#fff7e7', flex: 1 }}>Select All</span>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} tickColor="#4a7bfa" />
                </div>

                {/* Category rows */}
                {EVENT_CATS.map(cat => (
                  <div key={cat.id}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 0',
                      borderBottom: '1px solid rgba(255,247,231,0.07)',
                    }}>
                      <CatPin color={cat.color} />
                      <span style={{
                        flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700,
                        color: '#fff7e7', letterSpacing: '0.04em',
                      }}>{cat.label}</span>
                      <button onClick={() => {
                        const next = new Set(expandedCats);
                        next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id);
                        setExpandedCats(next);
                      }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
                        <svg width="11" height="7" viewBox="0 0 12 8" fill="none">
                          <path d={expandedCats.has(cat.id) ? 'M1 7l5-6 5 6' : 'M1 1l5 6 5-6'}
                            stroke="rgba(255,247,231,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <Checkbox checked={checkedCats.has(cat.id)} onChange={() => toggleCat(cat.id)} tickColor="#4a7bfa" />
                    </div>

                    {expandedCats.has(cat.id) && cat.events.map(evt => (
                      <div key={evt} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 0 7px 12px',
                        borderBottom: '1px solid rgba(255,247,231,0.05)',
                        background: 'rgba(0,0,0,0.14)',
                      }}>
                        <svg width="13" height="14" viewBox="0 0 14 15" fill="none">
                          <path d="M7 1a4 4 0 0 1 4 4v3l1.5 2H1.5L3 8V5a4 4 0 0 1 4-4z" stroke={cat.color} strokeWidth="1.3" fill="none"/>
                          <path d="M5.5 12.5a1.5 1.5 0 0 0 3 0" stroke={cat.color} strokeWidth="1.3"/>
                        </svg>
                        <span style={{ flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 12, color: 'rgba(255,247,231,0.82)' }}>{evt}</span>
                        {/* Arrow → navigates to bulletin to see the poster */}
                        <button
                          onClick={() => { setOverlay(null); setShowEventPanel(false); navigate('/bulletin'); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', display: 'flex', alignItems: 'center' }}
                        >
                          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                            <path d="M1 1l4 4-4 4" stroke="rgba(255,247,231,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <Checkbox checked={checkedEvents.has(evt)} onChange={() => toggleEvent(cat.id, evt)} tickColor="#4a7bfa" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* EVENT DETAIL BOTTOM SHEET — pin tap                           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {selectedPin && (() => {
        const detail = PIN_DETAILS[selectedPin.id] ?? { date: '', location: '', description: '' };
        const hex    = PIN_HEX[selectedPin.color];
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, zIndex: 40 }} onClick={() => setSelectedPin(null)} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 45,
              background: '#182b49', borderRadius: '24px 24px 0 0',
              padding: '0 20px 100px', boxShadow: '0 -8px 32px rgba(0,0,0,0.35)',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,247,231,0.3)', margin: '12px auto 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: hex, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(255,247,231,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{selectedPin.category}</span>
                {selectedPin.club && (<><span style={{ color: 'rgba(255,247,231,0.3)', fontSize: 12 }}>·</span><span style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: 'rgba(255,247,231,0.6)' }}>{selectedPin.club}</span></>)}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff7e7', marginBottom: 4, lineHeight: 1.2 }}>{selectedPin.title}</div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 13, color: 'rgba(255,247,231,0.65)', marginBottom: 16, lineHeight: 1.5 }}>{detail.description}</div>
              <div style={{ height: 1, background: 'rgba(255,247,231,0.12)', marginBottom: 14 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="#fff7e7" strokeWidth="1.4" fill="none"/><path d="M1 6.5h14" stroke="#fff7e7" strokeWidth="1.4"/><path d="M5 1v3M11 1v3" stroke="#fff7e7" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#fff7e7' }}>{detail.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 11 7 11s7-5.75 7-11C14 3.13 10.87 0 7 0z" fill="#fff7e7"/><circle cx="7" cy="7" r="2.5" fill="#182b49"/></svg>
                <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#fff7e7' }}>{detail.location}</span>
              </div>
              <button onClick={() => { setSelectedPin(null); navigate('/bulletin'); }} style={{
                width: '100%', height: 48, borderRadius: 25,
                background: '#fff7e7', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: '#182b49',
              }}>View Event</button>
            </div>
          </>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MESSAGE CENTER OVERLAY                                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {overlay === 'messages' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20 }} onClick={() => setOverlay(null)}>
          <div style={{
            position: 'absolute', top: 128, left: 21, right: 21,
            background: 'rgba(59,73,95,0.7)', borderRadius: 15,
            padding: '16px', maxHeight: '72%', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOverlay(null)} style={{
              position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,247,231,0.15)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#fff7e7" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <img src={assets.overlayMascotMsg} alt="" style={{ width: 112, height: 97, objectFit: 'contain', display: 'block', margin: '0 auto 4px' }} onError={e => (e.currentTarget.style.display = 'none')} />
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 20, color: 'white' }}>MESSAGE CENTER</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff7e7', borderRadius: 130, height: 32, padding: '0 14px', marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search members, keywords, more..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#000' }} />
            </div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: 'white', marginBottom: 12, marginLeft: 4 }}>@fluffyfloo123</div>
            {MESSAGES.map(msg => (
              <div key={msg.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,247,231,0.12)', cursor: 'pointer' }}>
                <div style={{ width: 35, height: 35, borderRadius: '50%', flexShrink: 0, background: '#182b49', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {msg.isNew ? <span style={{ color: '#fff7e7', fontSize: 20 }}>+</span>
                    : <img src={assets.msgPersonIcon} alt="" style={{ width: 24, height: 24 }} onError={e => (e.currentTarget.style.display = 'none')} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#fff7e7' }}>{msg.name}</div>
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: 'rgba(255,247,231,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.preview}</div>
                </div>
                {msg.pin && <img src={assets.msgThumbtack} alt="" style={{ width: 19, height: 23, flexShrink: 0 }} onError={e => (e.currentTarget.style.display = 'none')} />}
                {msg.dot && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff3d3d', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* NETWORK OVERLAY                                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {overlay === 'network' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
          <button onClick={() => setOverlay(null)} style={{
            position: 'absolute', top: 48, right: 12, pointerEvents: 'auto',
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(24,43,73,0.75)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#fff7e7" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
