import { useState } from 'react';
import { Link } from 'react-router-dom';
/** Figma: 13:480 — Erin - Calendar (day, detailed blocks) */
export function CalendarDayDetailScreen() {
  const [scope, setScope] = useState<'all' | 'me'>('me');

  return (
    <div className="scroll cal" data-figma-node="13:480">
      <div className="cal-bar">
        <button type="button" className="cal-pill wide">filters ▾</button>
        <button type="button" className="cal-pill">day ▾</button>
      </div>
      <div className="cal-day-head">
        <button type="button" style={{ background: 'none', border: 'none', fontSize: 16 }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="cal-day-num">13</span>
          <span style={{ fontSize: 12 }}>JANUARY</span>
        </div>
        <button type="button" style={{ background: 'none', border: 'none', fontSize: 16 }}>→</button>
      </div>
      <div className="cal-panel cal-day-wrap">
        <div className="cal-timeline">
          {Array.from({ length: 14 }, (_, i) => <div key={i} className="row" />)}
          <div className="cal-block sm" style={{ top: 29, height: 100 }} />
          <div className="cal-block sm" style={{ top: 102, height: 157, left: 122 }} />
          <div className="cal-block" style={{ top: 307, height: 103 }} />
        </div>
        <div className="cal-scroll" />
      </div>
      <div className="cal-scope">
        <button type="button" className={scope === 'all' ? 'on' : ''} onClick={() => setScope('all')}>all</button>
        <button type="button" className={scope === 'me' ? 'on' : ''} onClick={() => setScope('me')}>me</button>
      </div>
      <Link to="/calendar/day" className="link-back">← Standard day view</Link>
    </div>
  );
}
