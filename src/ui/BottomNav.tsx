import { NavLink } from 'react-router-dom';

const items = [
  { to: '/map', label: 'Map', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' },
  { to: '/bulletin', label: 'Pin', icon: 'M16 12V4H8v8l-2 2v2h12v-2l-2-2zm-6 0V6h4v6h-4z' },
  { to: '/profile', label: 'Profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
];

export function BottomNav() {
  return (
    <nav className="bnav">
      {items.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bnav__item${isActive ? ' is-active' : ''}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path fill="currentColor" d={icon} /></svg>
          <span>{label}</span>
        </NavLink>
      ))}
      <style>{`
        .bnav{height:var(--nav-h);display:flex;justify-content:space-around;align-items:center;padding:8px 20px 16px;border-top:1px solid #eee;flex-shrink:0;background:var(--white)}
        .bnav__item{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:var(--nav-idle);font-size:10px;font-weight:500}
        .bnav__item.is-active{color:var(--nav-active)}
      `}</style>
    </nav>
  );
}
