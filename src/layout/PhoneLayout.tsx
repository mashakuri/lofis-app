import { Outlet, useLocation } from 'react-router-dom';
import { StatusBar } from '../ui/StatusBar';
import { BottomNav } from '../ui/BottomNav';

const TABS = new Set(['/map', '/bulletin', '/profile']);

export function PhoneLayout() {
  const { pathname } = useLocation();
  const isMap      = pathname === '/map';
  const isBulletin = pathname === '/bulletin' || pathname.startsWith('/bulletin/');
  const showNav    = TABS.has(pathname) || pathname.startsWith('/bulletin');
  const isProfile  = pathname === '/profile';
  const creamBg    = isProfile;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: 'var(--phone-w)',
        height: 'var(--phone-h)',
        position: 'relative',
        borderRadius: 44,
        overflow: 'hidden',
        boxShadow: '0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 40px 80px rgba(0,0,0,0.8)',
        background: isMap ? '#e8e0d4' : isBulletin ? '#b98f66' : creamBg ? 'var(--cream)' : '#fff',
        backgroundImage: isBulletin
          ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.40'/%3E%3C/svg%3E")`
          : undefined,
        backgroundSize: isBulletin ? '200px 200px' : undefined,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Dynamic Island — iPhone 14 Pro+ hardware notch, always on top */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 20,
          background: '#000', zIndex: 200, pointerEvents: 'none',
        }} />

        {/* Status bar: hidden on map (edge-to-edge) and bulletin (cork screen, no clock shown) */}
        {!isMap && !isBulletin && <StatusBar variant={creamBg ? 'cream' : 'light'} />}

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>

        {/* Normal nav for non-map screens */}
        {showNav && !isMap && <BottomNav />}

        {/* On map: BottomNav floats absolutely over the map */}
        {isMap && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <BottomNav />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
