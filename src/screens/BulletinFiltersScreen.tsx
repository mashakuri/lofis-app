import { Link } from 'react-router-dom';
import './screens.css';

const HAPPENING = ['#today', '#next 3 days', '#this week', '#this month'];

/** Figma: 14:208 — Bonnie - Bulletin Board (filters) */
export function BulletinFiltersScreen() {
  return (
    <div className="scroll board-wrap" data-figma-node="14:208">
      <div className="board">
        <div className="board-search">
          <input type="search" aria-label="Search" />
          <button type="button" aria-label="Search">⌕</button>
        </div>
        <Link to="/bulletin" className="board-refine" style={{ display: 'block', marginBottom: 16 }}>Refine Search</Link>
        <div className="filters-panel">
          <h2>Happening</h2>
          <div className="filter-tags">
            {HAPPENING.map((t) => (
              <button key={t} type="button">{t}</button>
            ))}
          </div>
          <div className="filters-grid">
            <div className="fcard fc-pink">
              <p style={{ margin: 0, fontSize: 15 }}>Event Type</p>
              <button type="button" className="filter-tags" style={{ width: 'auto' }}>#academic</button>
            </div>
            <div className="fcard fc-blue">
              <button type="button">#social</button>
            </div>
            <div className="fcard fc-yellow">
              <p style={{ margin: 0, letterSpacing: 2 }}>*******</p>
            </div>
            <div className="fcard fc-mint" />
          </div>
        </div>
        <div className="board-chevron">▼</div>
      </div>
      <Link to="/bulletin" className="link-back">← Back to board</Link>
    </div>
  );
}
