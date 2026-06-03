/**
 * ProfileScreen — Figma "Profile - Mine" 298:1902 / "Profile - Following" 306:1669
 */
import { useState } from 'react';
import { useLofis } from '../context/LofisContext';
import { useAuth } from '../context/AuthContext';
import { assets } from '../data/figmaAssets';

const MY_CLUBS = [
  { id: 'c1', name: 'ACM'   },
  { id: 'c2', name: 'ASCE'  },
  { id: 'c3', name: 'DCO'   },
  { id: 'c4', name: 'TREND' },
];

const FOLLOWING_CLUBS = [
  { id: 'f1', name: 'TOKENS'    },
  { id: 'f2', name: 'PMC'       },
  { id: 'f3', name: 'SNOW CLUB' },
  { id: 'f4', name: 'WIB'       },
];

const PAST_EVENTS = [
  '5/23    THRIFTMANIA                        MUIR',
  '5/18   DCO INFO SESH                      DICL',
  '5/2     SUNGOD FESTIVAL              RIMAC',
];

function GearIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff7e7">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94L2.86 14.52c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  );
}

type ProfileInfo = {
  displayName: string;
  handle: string;
  college: string;
  major: string;
  year: string;
};

/** Settings popup — cream style */
function EditModal({
  onClose,
  info,
  onSave,
}: {
  onClose: () => void;
  info: ProfileInfo;
  onSave: (next: ProfileInfo) => void;
}) {
  const [displayName, setDisplayName] = useState(info.displayName);
  const [major, setMajor]     = useState(info.major);
  const [college, setCollege] = useState(info.college);
  const [year, setYear]       = useState(info.year);
  const [handle, setHandle]   = useState(info.handle);

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid rgba(24,43,73,0.12)',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif', fontSize: 11,
    color: 'rgba(24,43,73,0.5)', marginBottom: 3, display: 'block',
  };

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff7e7', borderRadius: '25px 25px 0 0',
          padding: '20px 20px 32px', maxHeight: '80%', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{
          width: 40, height: 4, borderRadius: 2, background: 'rgba(24,43,73,0.2)',
          margin: '0 auto 16px',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 700, color: '#182b49' }}>
            Edit Profile
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, color: '#182b49', lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Fields */}
        {[
          { label: 'Display Name', value: displayName, set: setDisplayName },
          { label: 'Major',        value: major,       set: setMajor       },
          { label: 'College',      value: college,     set: setCollege     },
          { label: 'Year',         value: year,        set: setYear        },
          { label: 'Handle',       value: handle,      set: setHandle      },
        ].map(({ label, value, set }) => (
          <div key={label} style={rowStyle}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <label style={labelStyle}>{label}</label>
              <input
                value={value}
                onChange={e => set(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  height: 36, borderRadius: 8,
                  border: '1.5px solid rgba(24,43,73,0.2)',
                  background: 'rgba(24,43,73,0.05)', color: '#182b49',
                  fontFamily: 'Lato, sans-serif', fontSize: 15, padding: '0 12px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, height: 44, borderRadius: 25,
            border: '1.5px solid #182b49', background: 'transparent',
            fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 700,
            color: '#182b49', cursor: 'pointer',
          }}>CANCEL</button>
          <button onClick={() => { onSave({ displayName, handle, college, major, year }); onClose(); }} style={{
            flex: 1, height: 44, borderRadius: 25,
            border: 'none', background: '#182b49',
            fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 700,
            color: '#fff7e7', cursor: 'pointer',
          }}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

export function ProfileScreen() {
  useLofis();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<'MINE' | 'FOLLOWING'>('MINE');
  const [editOpen, setEditOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    displayName: user?.email?.split('@')[0] ?? 'Solstice',
    handle: '@fluffyfloo123',
    college: 'Marshall',
    major: 'CogSci ML',
    year: '3rd Year',
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#fff7e7', paddingBottom: 16, position: 'relative' }}>

      {/* ── Top profile card ── */}
      <div style={{ margin: '58px 19px 0' }}>
        <div style={{
          background: '#182b49', borderRadius: 25,
          padding: '29px 16px 16px', position: 'relative',
        }}>
          {/* Gear icon */}
          <button
            onClick={() => setEditOpen(true)}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 50, height: 50, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <GearIcon />
          </button>

          {/* Hero */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 107, height: 107, borderRadius: 25, flexShrink: 0,
              background: '#fff7e7', overflow: 'hidden',
            }}>
              <img src={assets.profileAvatar} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
            <div style={{ paddingTop: 4 }}>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 25, fontWeight: 400, color: '#fff7e7' }}>
                {profileInfo.displayName}
              </div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: 'white', marginTop: 4 }}>
                {profileInfo.handle}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[profileInfo.college, profileInfo.major, profileInfo.year].map((s, i) => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff7e7', display: 'inline-block' }} />}
                    <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#fff7e7' }}>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clubs card (separate rectangle) ── */}
      <div style={{ margin: '24px 19px 0' }}>
        <div style={{
          background: '#182b49', borderRadius: 25,
          padding: '16px 16px 20px',
        }}>
          {/* CLUBS + tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20,
              color: '#fff7e7', marginRight: 'auto',
            }}>CLUBS</span>
            {(['MINE', 'FOLLOWING'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                height: 28, padding: '0 14px', borderRadius: 25,
                border: '1px solid #182b49', cursor: 'pointer',
                fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 700, color: '#182b49',
                background: tab === t ? '#fff7e7' : 'rgba(255,247,231,0.58)',
              }}>{t}</button>
            ))}
          </div>

          {/* Club card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 12px' }}>
            {tab === 'MINE'
              ? MY_CLUBS.map(club => (
                <div key={club.id}>
                  <div style={{
                    height: 57, borderRadius: '4px 4px 0 0',
                    backgroundImage: `url(${assets.clubCardTop})`, backgroundSize: '100% 100%',
                    position: 'relative', padding: '8px 8px 8px 48px',
                  }}>
                    <div style={{
                      position: 'absolute', left: 8, top: 10,
                      width: 35, height: 35, borderRadius: '50%',
                      background: '#fff7e7', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={assets.msgPersonIcon} alt="" style={{ width: 24, height: 24 }}
                        onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#182b49', margin: 0, lineHeight: 1.2 }}>MY POSITION:</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#fff7e7', margin: '2px 0 0' }}>{club.name}</p>
                  </div>
                  <div style={{
                    height: 12, borderRadius: '0 0 4px 4px',
                    backgroundImage: `url(${assets.clubCardBar})`, backgroundSize: '100% 100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px',
                  }}>
                    <span style={{ fontSize: 6, color: '#fff7e7' }}>CREATE NEW EVENT</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#fff7e7' }}>+</span>
                  </div>
                </div>
              ))
              : FOLLOWING_CLUBS.map(club => (
                <div key={club.id}>
                  <div style={{
                    height: 57, borderRadius: '4px 4px 0 0',
                    background: '#fff7e7',
                    position: 'relative', padding: '8px 8px 8px 48px',
                  }}>
                    <div style={{
                      position: 'absolute', left: 8, top: 10,
                      width: 35, height: 35, borderRadius: '50%',
                      background: '#182b49',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="#fff7e7" strokeWidth="1.8"/>
                        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#fff7e7" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: 'rgba(24,43,73,0.5)', margin: 0, lineHeight: 1.2 }}>CLUB</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 15, color: '#182b49', margin: '2px 0 0', fontWeight: 700 }}>{club.name}</p>
                  </div>
                  <div style={{
                    height: 22, borderRadius: '0 0 4px 4px',
                    background: 'rgba(24,43,73,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', gap: 4,
                  }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 6, color: '#fff7e7', flexShrink: 0 }}>REACH OUT</span>
                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M5 1a3 3 0 0 1 3 3v2l1 1H1l1-1V4a3 3 0 0 1 3-3z" stroke="#fff7e7" strokeWidth="0.8"/>
                      <path d="M4 9.5a1 1 0 0 0 2 0" stroke="#fff7e7" strokeWidth="0.8"/>
                    </svg>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="1" y="1" width="8" height="6" rx="1" stroke="#fff7e7" strokeWidth="0.8"/>
                      <path d="M3 8l2 1.5L7 8" stroke="#fff7e7" strokeWidth="0.8"/>
                    </svg>
                    <button style={{
                      height: 14, padding: '0 6px', borderRadius: 15,
                      border: 'none', background: '#182b49',
                      fontFamily: 'Lato, sans-serif', fontSize: 6, color: '#fff7e7',
                      cursor: 'pointer', flexShrink: 0,
                      outline: '1px solid rgba(255,247,231,0.4)',
                    }}>UNFOLLOW</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── PAST EVENTS ── */}
      <div style={{ margin: '24px 19px 0' }}>
        <h2 style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20,
          color: '#182b49', margin: '0 0 8px',
        }}>PAST EVENTS</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 4, minHeight: 88, borderRadius: 25, background: '#182b49', flexShrink: 0 }} />
          <div style={{ flex: 1, background: '#182b49', borderRadius: 5 }}>
            {PAST_EVENTS.map((ev, i) => (
              <div key={i} style={{
                fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'white',
                padding: '10px 16px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                borderBottom: i < PAST_EVENTS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>{ev}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Log Out ── */}
      <div style={{ margin: '20px 19px 0', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => signOut()}
          style={{
            width: '60%', height: 44, borderRadius: 999,
            border: '1.5px solid #182b49', background: 'transparent',
            fontFamily: 'Lato, sans-serif', fontSize: 15, fontWeight: 700,
            color: '#182b49', cursor: 'pointer', letterSpacing: 0.5,
          }}
        >Log Out</button>
      </div>

      {editOpen && (
        <EditModal
          onClose={() => setEditOpen(false)}
          info={profileInfo}
          onSave={next => setProfileInfo(next)}
        />
      )}
    </div>
  );
}
