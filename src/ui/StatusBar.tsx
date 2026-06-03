export function StatusBar({ variant = 'light' }: { variant?: 'light' | 'cream' | 'cork' }) {
  const bg =
    variant === 'cream' ? 'var(--cream)' :
    variant === 'cork'  ? 'transparent'  :
    'var(--white)';
  const timeColor = variant === 'cream' || variant === 'cork' ? '#182b49' : '#182b49';

  return (
    <header className="status" style={{ background: bg }}>
      <span style={{ color: timeColor }}></span>
      {/* No dots — Dynamic Island handles the right-side UI */}
    </header>
  );
}
