/**
 * CalendarMonthScreen — Figma "Erin - Calendar 1" 370:2551
 *
 * Background: cream #fff7e7
 * Blue tile: #4a7bfa r=25, h=404 — contains calendar component
 * Calendar component:
 *   - Month/Year select: white dropdowns w=99 h=32 r=9, "Sep" + "2025"
 *   - ‹ › chevron buttons (white, w=41 h=41 r=36)
 *   - Day header: Su Mo Tu We Th Fr Sa — cream Geist 14
 *   - Day cells: 46×46 r=9, cream text Inter 18
 *   - Selected day: orange #ffa144 bg, light text
 *   - Other-month days: gray rgba(179,179,179)
 * ALL/ME toggle: yellow #ffe552 pills, navy Inter 14 bold
 * "filters" button: yellow #ffe552 r=25, navy Inter 16 bold
 */
import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const THIS_YEAR = new Date().getFullYear();
const YEARS  = [THIS_YEAR + 1, THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export function CalendarMonthScreen() {
  const now = new Date();
  const [month, setMonth]   = useState(now.getMonth());
  const [year, setYear]     = useState(now.getFullYear());
  const [scope, setScope]   = useState<'ALL' | 'ME'>('ALL');
  const [selected, setSelected] = useState<number[]>([]);

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDay(year, month);
  // days from previous month
  const prevDays     = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const toggleDay = (d: number) =>
    setSelected(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // How many cells we've used
  const totalCells = firstDay + daysInMonth;
  const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#fff7e7', padding: 16 }}>

      {/* ── Blue calendar tile: #4a7bfa r=25 ── */}
      <div style={{
        background: '#4a7bfa', borderRadius: 25,
        padding: '18px 18px 16px', marginBottom: 16,
      }}>

        {/* Month + Year selectors + chevrons */}
        {/* Figma: Icon Button 41×41 r=36 (cream) + Calendar Select Group + Icon Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          {/* Left chevron */}
          <button onClick={prevMonth} style={{
            width: 41, height: 41, borderRadius: 36, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M8 2L2 9L8 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Month dropdown */}
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            style={{
              width: 99, height: 32, borderRadius: 9, border: 'none', cursor: 'pointer',
              background: 'white', padding: '0 8px',
              fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1e1e1e',
            }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m.slice(0,3)}</option>
            ))}
          </select>

          {/* Year dropdown */}
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{
              width: 99, height: 32, borderRadius: 9, border: 'none', cursor: 'pointer',
              background: 'white', padding: '0 8px',
              fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#1e1e1e',
            }}
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Right chevron */}
          <button onClick={nextMonth} style={{
            width: 41, height: 41, borderRadius: 36, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M2 2L8 9L2 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Day headers: Su Mo Tu We Th Fr Sa — cream Geist/Inter 14 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 14,
              color: '#fff7e7', padding: '4px 0',
            }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid: 46×46 cells r=9 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {/* Previous month tail */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <button key={`prev-${i}`} style={{
              aspectRatio: '1', border: 'none', borderRadius: 9, background: 'transparent',
              color: 'rgba(179,179,179,1)', fontFamily: 'Inter, sans-serif', fontSize: 18, cursor: 'default',
            }}>{prevDays - firstDay + i + 1}</button>
          ))}

          {/* Current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d   = i + 1;
            const sel = selected.includes(d);
            return (
              <button key={d} onClick={() => toggleDay(d)} style={{
                aspectRatio: '1', border: 'none', borderRadius: 9,
                background: sel ? '#ffa144' : 'transparent',
                color: sel ? '#f5f5f5' : '#fff7e7',
                fontFamily: 'Inter, sans-serif', fontSize: 18, cursor: 'pointer',
              }}>{d}</button>
            );
          })}

          {/* Next month prefix */}
          {Array.from({ length: nextMonthDays }).map((_, i) => (
            <button key={`next-${i}`} style={{
              aspectRatio: '1', border: 'none', borderRadius: 9, background: 'transparent',
              color: 'rgba(179,179,179,1)', fontFamily: 'Inter, sans-serif', fontSize: 18, cursor: 'default',
            }}>{i + 1}</button>
          ))}
        </div>
      </div>

      {/* ── ALL / ME scope toggle ── */}
      {/* Figma: Frame 3 w=143 h=32, two yellow pills — "ALL" solid, "ME" 0.5 opacity */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
        {(['ALL', 'ME'] as const).map(s => (
          <button key={s} onClick={() => setScope(s)} style={{
            width: 60, height: 32, borderRadius: 21, border: 'none', cursor: 'pointer',
            background: scope === s ? '#ffe552' : 'rgba(255,229,82,0.5)',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#182b49',
          }}>{s}</button>
        ))}
      </div>

      {/* ── filters button ── */}
      {/* Figma: Group 23 w=248 h=33 yellow r=25, "filters" Inter 16 bold navy + filter icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <button style={{
          width: 248, height: 33, borderRadius: 25, border: 'none', cursor: 'pointer',
          background: '#ffe552',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: '#182b49' }}>
            filters
          </span>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
            <circle cx="8" cy="8" r="5" stroke="#182b49" strokeWidth="1.5"/>
            <path d="M13 13L17 17" stroke="#182b49" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

    </div>
  );
}
