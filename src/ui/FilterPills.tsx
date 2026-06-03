import type { MapFilter } from '../types';

const FILTERS: MapFilter[] = ['All', 'Clubs', 'Events', 'Fairs', 'Food'];

export function FilterPills({ value, onChange }: { value: MapFilter; onChange: (f: MapFilter) => void }) {
  return (
    <div className="pills">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={`pill${value === f ? ' is-on' : ''}`}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
