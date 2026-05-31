export function StatusBar() {
  return (
    <header className="status" data-figma-frame="status">
      <span>9:41</span>
      <div className="status__dots" aria-hidden><i /><i /><i /><i /></div>
      <style>{`
        .status{display:flex;justify-content:space-between;align-items:center;height:var(--status-h);padding:10px 16px 0;flex-shrink:0}
        .status span{font-size:15px;font-weight:600}
        .status__dots{display:flex;gap:4px;padding-top:4px}
        .status__dots i{width:6px;height:6px;border-radius:50%;background:var(--black);display:block}
      `}</style>
    </header>
  );
}
