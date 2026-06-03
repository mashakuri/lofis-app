import { assets } from '../../data/figmaAssets';

/** Connections shown on map — Figma: 350:1732 Bonnie - Network 1 */
const CONNECTIONS = [
  { id: '1', top: '14%', left: '50%' },
  { id: '2', top: '36%', left: '30%' },
  { id: '3', top: '36%', left: '72%' },
  { id: '4', top: '41%', left: '66%' },
  { id: '5', top: '63%', left: '46%' },
  { id: '6', top: '74%', left: '54%' },
  { id: '7', top: '47%', left: '75%' },
  { id: '8', top: '34%', left: '48%' },
];

const NETWORK_LIST = [
  { name: 'Maya L.', club: 'ACM', status: 'At Price Center' },
  { name: 'Jordan K.', club: 'ASCE', status: 'Saved Thriftmania' },
  { name: 'Sam R.', club: 'DCO', status: 'Online' },
  { name: 'Alex T.', club: 'TREND', status: 'At Geisel' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NetworkOverlay({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="map-overlay map-overlay--network" role="dialog" aria-modal aria-label="Network">
      <button type="button" className="map-overlay__backdrop" onClick={onClose} aria-label="Close" />
      <div className="network-markers" aria-hidden>
        {CONNECTIONS.map((c) => (
          <div
            key={c.id}
            className="network-marker"
            style={{ top: c.top, left: c.left }}
          >
            <img src={assets.networkPerson} alt="" />
          </div>
        ))}
      </div>
      <div className="network-panel" data-figma-node="350:1732">
        <h2>Your network</h2>
        <p className="network-panel__sub">Friends &amp; club connections on campus</p>
        <ul className="network-panel__list">
          {NETWORK_LIST.map((p) => (
            <li key={p.name}>
              <img src={assets.networkPerson} alt="" />
              <div>
                <strong>{p.name}</strong>
                <span>{p.club} · {p.status}</span>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className="network-panel__close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
