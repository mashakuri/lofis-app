import { Link } from 'react-router-dom';
import { useLofis } from '../context/LofisContext';
import { PINS } from '../data/pins';
import './screens.css';

const CLUBS = ['ACM at UCSD', 'Design Co', 'Robotics Club', 'AI Society'];

/** Figma: 1:2 — Erin - Acc Profile/Club Attendance */
export function ProfileScreen() {
  const { role, setRole, saved, toggleSave } = useLofis();
  const savedEvents = PINS.filter((p) => saved.has(p.id));

  return (
    <div className="scroll prof" data-figma-node="1:2">
      <div className="prof-card">
        <div className="prof-head">
          <div className="prof-avatar" />
          <div className="prof-lines">
            <div className="skel skel-lg" /><div className="skel skel-md" />
            <div className="skel skel-sm" /><div className="skel skel-md" />
          </div>
        </div>
      </div>

      <div className="role">
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Role</div>
        <div className="role-btns">
          <button type="button" className={role === 'student' ? 'on' : ''} onClick={() => setRole('student')}>Student</button>
          <button type="button" className={role === 'organizer' ? 'on' : ''} onClick={() => setRole('organizer')}>Organizer</button>
        </div>
        <p>{role === 'student' ? 'Browse map events and save favorites.' : 'Post events on the bulletin (+).'}</p>
      </div>

      <section className="prof-card">
        <div className="sect-head"><span className="sect-icon">★</span><h2 className="sect-title">MY CLUBS</h2></div>
        <div className="clubs">
          {CLUBS.map((name) => (
            <div key={name} className="club"><i /><div className="skel skel-sm" style={{ flex: 1 }} /></div>
          ))}
        </div>
      </section>

      <section className="prof-card">
        <div className="sect-head"><span className="sect-icon">★</span><h2 className="sect-title">EVENTS ATTENDED</h2></div>
        <ul className="events">
          {role === 'student' ? (
            savedEvents.length === 0 ? (
              <li className="empty">No saved events. <Link to="/map">Browse the map</Link></li>
            ) : (
              savedEvents.map((e) => (
                <li key={e.id}>
                  <span>{e.title}</span>
                  <button type="button" style={{ border: 'none', background: 'none', color: 'var(--nav-active)', fontSize: 12 }} onClick={() => toggleSave(e.id)}>Remove</button>
                </li>
              ))
            )
          ) : (
            [1, 2, 3, 4, 5, 6].map((i) => <li key={i}><div className="skel skel-lg" /></li>)
          )}
        </ul>
      </section>

      <Link to="/calendar" className="link-back">View calendar →</Link>
    </div>
  );
}
