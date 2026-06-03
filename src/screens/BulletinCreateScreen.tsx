import { useNavigate } from 'react-router-dom';
import { assets } from '../data/figmaAssets';

export function BulletinCreateScreen() {
  const nav = useNavigate();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* Header */}
      <div style={{ position: 'relative', height: 320, flexShrink: 0, marginTop: 53 }}>

        {/* X close button */}
        <button
          onClick={() => nav('/bulletin')}
          style={{
            position:   'absolute',
            top:        35,
            right:      26,
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      '#182b49',
            fontSize:   26,
            lineHeight: 1,
            padding:    4,
            zIndex:     3,
          }}
          aria-label="Close"
        >×</button>

        {/* Title */}
        <div style={{
          position:         'absolute',
          top:              109,
          left:             0,
          right:            0,
          textAlign:        'center',
          transform:        'translateX(0px)',
          fontFamily:       'Inter, sans-serif',
          fontWeight:       700,
          fontSize:         38,
          lineHeight:       '44px',
          color:            '#182b49',
          WebkitTextStroke: '1.5px rgba(251,234,141,1)',
          paintOrder:       'stroke fill',
          userSelect:       'none',
          zIndex:           1,
        }}>
          <span style={{ display: 'block' }}>CREATE YOUR</span>
          <span style={{ display: 'block', marginLeft: 10 }}>OWN POSTER</span>
        </div>

        {/* Bird — behind "OWN POSTER", centered-left */}
        <img
          src={assets.bulletinMascot}
          alt=""
          style={{
            position:  'absolute',
            top:       145,
            left:      10,
            width:     180,
            objectFit: 'contain',
            zIndex:    0,
          }}
          onError={e => (e.currentTarget.style.display = 'none')}
        />

        {/* Navy line below the bird */}
        <div style={{
          position:     'absolute',
          top:          280,
          left:         '50%',
          transform:    'translateX(-50%)',
          width:        240,
          height:       3,
          background:   '#182b49',
          borderRadius: 2,
          zIndex:       1,
        }} />
      </div>

      {/* Option buttons */}
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        gap:            14,
        alignItems:     'center',
        justifyContent: 'center',
        paddingBottom:  60,
        transform:      'translateY(-70px)',
      }}>
        <button
          onClick={() => nav('/bulletin/create/template')}
          style={{
            width:        '75%',
            height:       56,
            borderRadius: 999,
            border:       'none',
            background:   'rgba(255,255,255,0.40)',
            fontFamily:   'Lato, sans-serif',
            fontSize:     18,
            color:        '#182b49',
            cursor:       'pointer',
            letterSpacing: 0.3,
          }}
        >Pick A Template</button>

        <button
          onClick={() => nav('/bulletin/create/upload')}
          style={{
            width:        '75%',
            height:       56,
            borderRadius: 999,
            border:       'none',
            background:   'rgba(255,255,255,0.40)',
            fontFamily:   'Lato, sans-serif',
            fontSize:     18,
            color:        '#182b49',
            cursor:       'pointer',
            letterSpacing: 0.3,
          }}
        >Upload Your Own</button>
      </div>
    </div>
  );
}
