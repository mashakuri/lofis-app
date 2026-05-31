import { useNavigate } from 'react-router-dom';
import './screens.css';

/** Figma: 14:298 — verified club view (template picker) */
export function BulletinCreateScreen() {
  const nav = useNavigate();
  return (
    <div className="scroll board-wrap" data-figma-node="14:298">
      <div className="board">
        <button type="button" className="board-back" style={{ display: 'block', margin: '0 auto 24px' }} onClick={() => nav(-1)}>Back</button>
        <div className="create-grid">
          <button type="button" className="create-card tpl" onClick={() => nav('/bulletin/editor')}>
            <span className="badge">+ template</span>
          </button>
          <button type="button" className="create-card tpl" onClick={() => nav('/bulletin/editor')}>
            <span className="badge">+ your own</span>
          </button>
          <div className="create-card" style={{ background: 'var(--pink)' }} />
          <div className="create-card" style={{ background: 'var(--blue)' }} />
          <div className="create-card bar" style={{ background: 'var(--yellow)' }} />
          <div className="create-card bar" style={{ background: 'var(--mint)' }} />
        </div>
        <div className="board-chevron">▼</div>
      </div>
    </div>
  );
}
