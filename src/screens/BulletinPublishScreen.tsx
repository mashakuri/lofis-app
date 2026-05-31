import { useLocation, useNavigate } from 'react-router-dom';
import { useLofis } from '../context/LofisContext';
import './screens.css';

/** Figma: 14:399 — verified club view (publish) */
export function BulletinPublishScreen() {
  const nav = useNavigate();
  const { addNote } = useLofis();
  const title = (useLocation().state as { title?: string } | null)?.title ?? 'New Event';

  const publish = () => {
    addNote({ id: `n-${Date.now()}`, color: 'var(--pink)', title });
    nav('/bulletin');
  };

  return (
    <div className="scroll board-wrap" data-figma-node="14:399">
      <div className="board">
        <button type="button" className="board-back" style={{ display: 'block', margin: '0 auto 24px' }} onClick={() => nav(-1)}>Back</button>
        <div className="publish-preview"><p style={{ margin: 0 }}>{title}</p></div>
        <div className="publish-btns">
          <button type="button">Save</button>
          <button type="button">Delete Draft</button>
          <button type="button" onClick={publish}>Publish</button>
        </div>
      </div>
    </div>
  );
}
