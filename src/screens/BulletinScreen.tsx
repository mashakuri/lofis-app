import { Link, useNavigate } from 'react-router-dom';
import { useLofis } from '../context/LofisContext';
import './screens.css';

/** Figma: 1:4 — Bonnie - Bulletin Board */
export function BulletinScreen() {
  const { role, notes } = useLofis();
  const nav = useNavigate();

  return (
    <div className="scroll board-wrap" data-figma-node="1:4">
      <div className="board">
        <div className="board-search">
          <input type="search" aria-label="Search bulletin" />
          <button type="button" aria-label="Search">⌕</button>
        </div>
        <div className="board-row">
          <Link to="/bulletin/filters" className="board-refine">Refine Search</Link>
          {role === 'organizer' && (
            <button type="button" className="board-add" onClick={() => nav('/bulletin/create')} aria-label="New post">+</button>
          )}
        </div>
        <div className="board-grid">
          {notes.map((n) => (
            <article key={n.id} className="note" style={{ background: n.color }}>
              {n.title && <span>{n.title}</span>}
            </article>
          ))}
        </div>
        <div className="board-chevron">▼</div>
      </div>
    </div>
  );
}
