/**
 * BottomNav — Figma "Menu Bar" exact values from Bonnie - Bulletin Board(2):
 *   R Menu Bar: fill=rgba(255,247,231,1) = #fff7e7  w=362 h=75 r=25
 *   Map icon:   fill=rgba(24,43,73,1) = #182b49   50×50  r=25  (rounded square)
 *   Pin icon:   fill=rgba(24,43,73,1)              50×50  r=50% (ellipse)
 *   Profile:    fill=rgba(24,43,73,1)              50×50  r=50% (ellipse)
 *
 * On non-bulletin screens (map, profile): navy pill, cream icon circles
 * (Map screen uses absolute overlay positioning from PhoneLayout)
 */
import { useLocation, useNavigate } from 'react-router-dom';

function MapIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 26 26" fill="none">
      <path d="M3 6l6.5-3 7 3 6.5-3v17l-6.5 3-7-3-6.5 3V6z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
      <path d="M9.5 3v17M16.5 6v17" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="32" viewBox="0 0 26 32" fill="none" style={{ marginLeft: 2, marginTop: 4 }}>
      <path d="M15.7703 20.5339L16.1034 15.9705L23.0092 9.17009L25.1945 9.01547C26.0699 8.78507 26.2616 8.07953 25.6212 7.44849L18.4358 0.373418C17.7944 -0.25839 17.0791 -0.0686939 16.8444 0.793002L16.6876 2.94571L9.78172 9.7443L5.14566 10.0733C4.03182 10.3664 3.78742 11.2637 4.60356 12.0675C4.60356 12.0675 8.1731 15.5826 8.44974 15.855L1.48018 22.7378L0 25.6002L2.90836 24.143L9.89846 17.2815C10.1756 17.5533 13.7446 21.0687 13.7446 21.0687C14.5603 21.8723 15.4716 21.6306 15.7703 20.5339Z" fill={color}/>
    </svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="8" r="4.5" stroke={color} strokeWidth="1.8" fill="none"/>
      <path d="M3 23c0-5.52 4.48-10 10-10s10 4.48 10 10"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

const TABS = [
  { path: '/map',      label: 'Map'      },
  { path: '/bulletin', label: 'Bulletin' },
  { path: '/profile',  label: 'Profile'  },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const isBulletin = pathname === '/bulletin' || pathname.startsWith('/bulletin/');

  return (
    <div style={{ flexShrink: 0, padding: '0 20px 10px', background: 'transparent' }}>
      <div style={{
        height: 75,
        // Bulletin: cream semi-transparent pill (Figma: rgba(255,247,231,0.47)); Others: navy pill
        background: isBulletin ? 'rgba(255,255,255,0.40)' : '#182b49',
        borderRadius: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 12px',
      }}>
        {TABS.map(({ path, label }) => {
          const isActive = pathname === path || (path === '/bulletin' && pathname.startsWith('/bulletin'));
          const Icon = label === 'Map' ? MapIcon : label === 'Bulletin' ? PinIcon : PersonIcon;

          let iconBg: string;
          let iconRadius: number | string;
          let iconColor: string;

          if (isBulletin) {
            // Figma Bulletin Board nav: all icons navy #182b49
            // Map = rounded square r=25, Pin/Profile = circles (ellipse r=50%)
            iconBg     = '#182b49';
            iconColor  = '#fff7e7';
            iconRadius = label === 'Map' ? 25 : '50%';
          } else {
            // Other screens: cream icon background, active = rounded square r=25
            iconBg     = '#fff7e7';
            iconColor  = '#182b49';
            iconRadius = isActive ? 25 : '50%';
          }

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              aria-label={label}
              style={{
                width: 50, height: 50,
                borderRadius: iconRadius,
                background: iconBg,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon color={iconColor} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
