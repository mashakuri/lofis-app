import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './screens.css';

const SLOTS = ['var(--pink)', 'var(--blue)', 'var(--yellow)', 'var(--mint)'];

/** Figma: 14:342 — verified club view (editor) */
export function BulletinEditorScreen() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');

  return (
    <div className="scroll board-wrap" data-figma-node="14:342">
      <div className="board">
        <button type="button" className="board-back" style={{ display: 'block', margin: '0 auto 24px' }} onClick={() => nav(-1)}>Back</button>
        <div className="editor">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          <div className="editor-grid">
            {SLOTS.map((c, i) => (
              <button key={i} type="button" className="editor-slot" style={{ background: c }}>+</button>
            ))}
          </div>
        </div>
        <div className="board-chevron">▼</div>
      </div>
      <button type="button" className="btn-primary" onClick={() => nav('/bulletin/publish', { state: { title } })}>
        Continue to publish
      </button>
    </div>
  );
}
