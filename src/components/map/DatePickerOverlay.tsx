import { useMemo, useState } from 'react';
import { assets } from '../../data/figmaAssets';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type Props = {
  open: boolean;
  onClose: () => void;
  onApply?: (range: { start: number; end: number } | null, scope: 'all' | 'me') => void;
};

/** Figma: 214:1645 — Select Date(s) modal */
export function DatePickerOverlay({ open, onClose, onApply }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year] = useState(now.getFullYear());
  const [rangeStart, setRangeStart] = useState(9);
  const [rangeEnd, setRangeEnd] = useState(13);
  const [scope, setScope] = useState<'all' | 'me'>('all');

  const cells = useMemo(() => {
    const total = daysInMonth(year, month);
    const pad = startWeekday(year, month);
    const items: { day: number; muted: boolean }[] = [];
    for (let i = 0; i < pad; i++) items.push({ day: 0, muted: true });
    for (let d = 1; d <= total; d++) items.push({ day: d, muted: false });
    const nextMonthDays = 4;
    for (let d = 1; d <= nextMonthDays; d++) items.push({ day: d, muted: true });
    return items;
  }, [year, month]);

  if (!open) return null;

  const pickDay = (day: number, muted: boolean) => {
    if (muted || !day) return;
    if (rangeStart === null || day < rangeStart) {
      setRangeStart(day);
      setRangeEnd(day);
    } else {
      setRangeEnd(day);
    }
  };

  const inRange = (day: number, muted: boolean) => {
    if (muted || !day) return false;
    const a = Math.min(rangeStart, rangeEnd);
    const b = Math.max(rangeStart, rangeEnd);
    return day >= a && day <= b;
  };

  const isEndpoint = (day: number, muted: boolean) => {
    if (muted || !day) return false;
    return day === rangeStart || day === rangeEnd;
  };

  return (
    <div className="map-overlay" role="dialog" aria-modal aria-label="Select dates">
      <button type="button" className="map-overlay__backdrop" onClick={onClose} aria-label="Close" />
      <div className="date-picker" data-figma-node="214:1645">
        <header className="date-picker__head">
          <img src={assets.overlayMascot} alt="" className="date-picker__mascot" />
          <p className="date-picker__label">Select Date(s)</p>
        </header>

        <div className="date-picker__panel">
          <div className="date-picker__month-row">
            <button
              type="button"
              className="date-picker__nav"
              aria-label="Previous month"
              onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
            >
              ←
            </button>
            <span className="date-picker__month">{MONTHS[month]}</span>
            <button
              type="button"
              className="date-picker__nav"
              aria-label="Next month"
              onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
            >
              →
            </button>
          </div>

          <div className="date-picker__grid">
            <div className="date-picker__weekdays">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="date-picker__days">
              {cells.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={c.muted || !c.day}
                  className={[
                    'date-picker__day',
                    c.muted ? 'is-muted' : '',
                    inRange(c.day, c.muted) ? 'in-range' : '',
                    isEndpoint(c.day, c.muted) ? 'is-endpoint' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => pickDay(c.day, c.muted)}
                >
                  {c.day || ''}
                </button>
              ))}
            </div>
          </div>

          <div className="date-picker__scope">
            <button
              type="button"
              className={scope === 'all' ? 'on' : ''}
              onClick={() => setScope('all')}
            >
              ALL
            </button>
            <button
              type="button"
              className={scope === 'me' ? 'on' : ''}
              onClick={() => setScope('me')}
            >
              ME
            </button>
          </div>
        </div>

        <button
          type="button"
          className="date-picker__go"
          onClick={() => {
            onApply?.({ start: Math.min(rangeStart, rangeEnd), end: Math.max(rangeStart, rangeEnd) }, scope);
            onClose();
          }}
        >
          GO!
        </button>
      </div>
    </div>
  );
}
