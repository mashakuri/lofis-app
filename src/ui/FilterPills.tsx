import type { MapFilter } from '../types';

const FILTERS: MapFilter[] = ['All', 'Clubs', 'Events', 'Fairs', 'Food'];

export function FilterPills({ value, onChange }: { value: MapFilter; onChange: (f: MapFilter) => void }) {
  return (
    <div className="pills">
      {FILTERS.map((f) => (
        <button key={f} type="button" className={`pill${value === f ? ' is-on' : ''}`} onClick={() => onChange(f)}>
          {f}
        </button>
      ))}
      <style>{`
        .pills{display:flex;gap:8px;padding:4px 16px 8px;overflow-x:auto;flex-shrink:0;background:var(--white)}
        .pills::-webkit-scrollbar{display:none}
        .pill{flex-shrink:0;height:33px;padding:0 16px;border-radius:17px;border:1px solid #e5e7eb;background:var(--white);font-size:14px;font-weight:500}
        .pill.is-on{background:var(--black);color:var(--white);border-color:var(--black)}
      `}</style>
    </div>
  );
}
