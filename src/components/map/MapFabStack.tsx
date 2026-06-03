import { assets } from '../../data/figmaAssets';

export type MapOverlay = 'calendar' | 'messages' | 'network' | null;

type Props = {
  active: MapOverlay;
  onToggle: (overlay: MapOverlay) => void;
  onFilter: () => void;
  messageUnread?: boolean;
};

export function MapFabStack({ active, onToggle, onFilter, messageUnread }: Props) {
  return (
    <div className="map-fabs">
      <button type="button" className="map-filter-btn" onClick={onFilter}>
        FILTER
      </button>
      <div className="map-fabs__stack">
        <button
          type="button"
          className={`map-fab${active === 'calendar' ? ' is-active' : ''}`}
          aria-label="Calendar"
          onClick={() => onToggle(active === 'calendar' ? null : 'calendar')}
        >
          <img src={assets.calendarEllipse} alt="" className="map-fab__ring" />
          <img src={assets.calendarIcon} alt="" className="map-fab__icon" />
        </button>
        <button
          type="button"
          className={`map-fab${active === 'messages' ? ' is-active' : ''}`}
          aria-label="Messages"
          onClick={() => onToggle(active === 'messages' ? null : 'messages')}
        >
          <img src={assets.calendarEllipse} alt="" className="map-fab__ring" />
          <img src={assets.messageIcon} alt="" className="map-fab__icon" />
          {messageUnread && <span className="map-fab__dot" />}
        </button>
        <button
          type="button"
          className={`map-fab${active === 'network' ? ' is-active' : ''}`}
          aria-label="Network"
          onClick={() => onToggle(active === 'network' ? null : 'network')}
        >
          <img src={assets.calendarEllipse} alt="" className="map-fab__ring" />
          <img src={assets.globeIcon} alt="" className="map-fab__icon" />
        </button>
      </div>
    </div>
  );
}
