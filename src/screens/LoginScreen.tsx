import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CORK_NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.40'/%3E%3C/svg%3E")`;

export function LoginScreen() {
  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { role, signIn, signUp } = useAuth();
  const navigate                 = useNavigate();

  /* Navigate once role is set (handles async state update) */
  useEffect(() => {
    if (role) navigate('/map', { replace: true });
  }, [role, navigate]);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const fn = mode === 'login' ? signIn(email, password) : signUp(email, password, 'student');
    const { error: err } = await fn;
    if (err) { setError(err); setLoading(false); }
    /* navigation handled by useEffect above */
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    height: 48, borderRadius: 12,
    border: '2px solid rgba(24,43,73,0.15)',
    background: 'rgba(255,247,231,0.85)',
    color: '#182b49',
    fontFamily: 'Lato, sans-serif', fontSize: 15,
    padding: '0 16px', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Lato, sans-serif', fontSize: 11, fontWeight: 700,
    letterSpacing: 1.2, textTransform: 'uppercase',
    color: 'rgba(24,43,73,0.55)', marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#111',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 390, height: 844,
        borderRadius: 44, overflow: 'hidden',
        boxShadow: '0 0 0 10px #1a1a1a, 0 0 0 12px #333, 0 40px 80px rgba(0,0,0,0.8)',
        background: '#b98f66',
        backgroundImage: CORK_NOISE,
        backgroundSize: '200px 200px',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>

        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 20,
          background: '#000', zIndex: 200, pointerEvents: 'none',
        }} />

        {/* SOLSTICE title */}
        <div style={{
          flexShrink: 0,
          textAlign:        'center',
          fontFamily:       'Inter, sans-serif',
          fontWeight:       700,
          fontSize:         46,
          lineHeight:       '52px',
          color:            '#182b49',
          WebkitTextStroke: '1.5px rgba(251,234,141,1)',
          paintOrder:       'stroke fill',
          userSelect:       'none',
          paddingTop:       160,
        }}>SOLSTICE</div>

        {/* Login card */}
        <div style={{
          flexShrink: 0,
          margin: '70px 20px 0',
          background: 'rgba(255,247,231,0.55)',
          borderRadius: 25,
          padding: '20px 20px 24px',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* LOGIN / SIGN UP tabs */}
          <div style={{
            display: 'flex', background: 'rgba(24,43,73,0.10)',
            borderRadius: 20, padding: 4, marginBottom: 20,
            flexShrink: 0,
          }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, height: 36, borderRadius: 16,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Lato, sans-serif', fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.5, textTransform: 'uppercase',
                  background: mode === m ? '#182b49' : 'transparent',
                  color: mode === m ? '#fff7e7' : 'rgba(24,43,73,0.5)',
                }}
              >{m === 'login' ? 'Log In' : 'Sign Up'}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="you@ucsd.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {error && (
              <div style={{
                background: 'rgba(220,50,50,0.12)', borderRadius: 10,
                padding: '10px 14px',
                fontFamily: 'Lato, sans-serif', fontSize: 13, color: '#c0392b',
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                height: 52, borderRadius: 999,
                border: 'none', background: '#182b49',
                fontFamily: 'Lato, sans-serif', fontSize: 16, fontWeight: 700,
                color: '#fff7e7', cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                letterSpacing: 0.5,
                flexShrink: 0,
              }}
            >{loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}</button>

            <p style={{
              textAlign: 'center', margin: 0,
              fontFamily: 'Lato, sans-serif', fontSize: 12,
              color: 'rgba(24,43,73,0.50)',
              flexShrink: 0,
            }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                style={{ color: '#182b49', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >{mode === 'login' ? 'Sign up' : 'Log in'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
