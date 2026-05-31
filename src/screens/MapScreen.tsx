import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterPills } from '../ui/FilterPills';
import { CampusMap } from '../ui/CampusMap';
import { useLofis } from '../context/LofisContext';
import type { MapFilter } from '../types';

/** Figma: 1:3 — Masha - Map/Home Screen */
export function MapScreen() {
  const [filter, setFilter] = useState<MapFilter>('All');
  const { role, saved, toggleSave } = useLofis();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} data-figma-node="1:3">
      <FilterPills value={filter} onChange={setFilter} />
      {filter === 'Events' && (
        <Link to="/calendar" style={{ padding: '0 16px 6px', fontSize: 12, color: 'var(--nav-active)', textDecoration: 'none' }}>
          Open calendar →
        </Link>
      )}
      <CampusMap
        filter={filter}
        onSave={role === 'student' ? toggleSave : undefined}
        saved={saved}
      />
    </div>
  );
}
