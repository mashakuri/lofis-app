import { Link } from 'react-router-dom';
import { assets } from '../data/figmaAssets';

const HAPPENING = ['#today', '#next 3 days', '#this week', '#this month'];

/** hifis filter variant */
export function BulletinFiltersScreen() {
  return (
    <div className="scroll board-wrap" data-figma-node="14:208">
      <div className="board">
        <div className="board-search">
          <input type="search" aria-label="Search" />
          <button type="button" className="board-search__btn" aria-label="Search">
            <img src={assets.bulletinSearch} alt="" />
          </button>
        </div>
        <Link to="/bulletin" className="board-refine" style={{ display: 'block', marginBottom: 16 }}>
          Refine Search
        </Link>
        <div className="filters-panel">
          <h2>Happening</h2>
          <div className="filter-tags">
            {HAPPENING.map((t) => (
              <button key={t} type="button">
                {t}
              </button>
            ))}
          </div>
          <div className="filters-grid">
            <div className="fcard fc-pink">
              <p style={{ margin: 0, fontSize: 15 }}>Event Type</p>
              <button type="button" className="filter-tags" style={{ width: 'auto', margin: 0 }}>
                #academic
              </button>
            </div>
            <div className="fcard fc-blue">
              <button type="button">#social</button>
            </div>
            <div className="fcard fc-yellow">
              <p style={{ margin: 0, letterSpacing: 2 }}>*******</p>
            </div>
            <div className="fcard fc-mint" />
          </div>
        </div>
        <div className="board-chevron">
          <img src={assets.bulletinChevron} alt="" />
        </div>
      </div>
      <Link to="/bulletin" className="link-back">
        ← Back to board
      </Link>
    </div>
  );
}
