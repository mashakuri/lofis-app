import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './screens.css';

const DOTS = [
  { top: 130, left: 227 },
  { top: 156, left: 21 },
  { top: 156, left: 71 },
  { top: 204, left: 175 },
  { top: 266, left: 71 },
];

/** Figma: 7:2 — Erin - Calendar (month) */
export function CalendarMonthScreen() {
  const nav = useNavigate();
  const [scope, setScope] = useState<'all' | 'me'>('all');

  return (
    <div className="scroll cal" data-figma-node="7:2">
      <div className="cal-bar">
        <button type="button" className="cal-pill wide">filters ▾</button>
        <button type="button" className="cal-pill" onClick={() => nav('/calendar/day')}>month ▾</button>
      </div>
      <div className="cal-nav">
        <button type="button" aria-label="Prev">←</button>
        <span className="cal-month">JANUARY</span>
        <button type="button" aria-label="Next">→</button>
      </div>
      <div className="cal-panel">
        <div className="cal-grid">
          {Array.from({ length: 35 }, (_, i) => <div key={i} className="cal-cell" />)}
          {DOTS.map((d, i) => (
            <button key={i} type="button" className="cal-dot" style={{ top: d.top, left: d.left }} onClick={() => nav('/calendar/day')}>+</button>
          ))}
        </div>
      </div>
      <div className="cal-scope">
        <button type="button" className={scope === 'all' ? 'on' : ''} onClick={() => setScope('all')}>all</button>
        <button type="button" className={scope === 'me' ? 'on' : ''} onClick={() => setScope('me')}>me</button>
      </div>
      <Link to="/map" className="link-back">← Back to map</Link>
      <Link to="/calendar/stacked" className="link-back">Stacked events variant →</Link>
    </div>
  );
}
