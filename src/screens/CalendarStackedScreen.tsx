import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './screens.css';

/** Figma: 13:643 — Erin - Calendar (month, stacked dots) */
export function CalendarStackedScreen() {
  const nav = useNavigate();
  const [scope, setScope] = useState<'all' | 'me'>('me');

  return (
    <div className="scroll cal" data-figma-node="13:643">
      <div className="cal-bar">
        <button type="button" className="cal-pill wide">filters ▾</button>
        <button type="button" className="cal-pill">month ▾</button>
      </div>
      <div className="cal-nav">
        <button type="button">←</button>
        <span className="cal-month">JANUARY</span>
        <button type="button">→</button>
      </div>
      <div className="cal-panel">
        <div className="cal-grid">
          {Array.from({ length: 35 }, (_, i) => <div key={i} className="cal-cell" />)}
          <button type="button" className="cal-dot" style={{ top: 130, left: 227 }} onClick={() => nav('/calendar/day')}>+</button>
          {[156, 183, 210].map((top) => (
            <button key={top} type="button" className="cal-dot" style={{ top, left: 175 }} onClick={() => nav('/calendar/day')}>+</button>
          ))}
        </div>
      </div>
      <div className="cal-scope">
        <button type="button" className={scope === 'all' ? 'on' : ''} onClick={() => setScope('all')}>all</button>
        <button type="button" className={scope === 'me' ? 'on' : ''} onClick={() => setScope('me')}>me</button>
      </div>
      <Link to="/calendar" className="link-back">← Standard month view</Link>
    </div>
  );
}
