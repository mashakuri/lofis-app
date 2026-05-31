import { Outlet, useLocation } from 'react-router-dom';
import { StatusBar } from '../ui/StatusBar';
import { BottomNav } from '../ui/BottomNav';

const TABS = new Set(['/map', '/bulletin', '/profile']);

export function PhoneLayout() {
  const { pathname } = useLocation();
  const showNav = TABS.has(pathname);

  return (
    <div className="shell">
      <div className="phone">
        <StatusBar />
        <div className="phone__body">
          <Outlet />
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
