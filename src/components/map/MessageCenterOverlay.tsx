import { assets } from '../../data/figmaAssets';

const CHATS = [
  { id: 'new', name: 'NEW CHAT', preview: 'begin networking here...', plus: true },
  { id: 'asce', name: 'ASCE', preview: 'lemme be on the next button plsssss...', pin: true },
  { id: 'acm', name: 'ACM', preview: 'how do you not know when the showcas...', unread: true },
  { id: 'jane', name: 'JANE DOE', preview: 'hey do you know when the info sesh is tn?' },
  { id: 'dco', name: 'DCO', preview: "what's a portfolio?" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Figma: 312:1738 — Bonnie - Message Center */
export function MessageCenterOverlay({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="map-overlay map-overlay--sheet" role="dialog" aria-modal aria-label="Message center">
      <button type="button" className="map-overlay__backdrop" onClick={onClose} aria-label="Close" />
      <div className="msg-center" data-figma-node="312:1738">
        <header className="msg-center__head">
          <img src={assets.overlayMascotMsg} alt="" className="msg-center__mascot" />
          <h2>MESSAGE CENTER</h2>
        </header>

        <div className="msg-center__panel">
          <div className="msg-center__search">
            <img src={assets.msgSearchUnion} alt="" className="msg-center__search-icon" />
            <input type="search" placeholder="Search members, keywords, more..." aria-label="Search messages" />
          </div>
          <p className="msg-center__handle">@fluffyfloo123</p>

          <ul className="msg-center__list">
            {CHATS.map((chat) => (
              <li key={chat.id} className="msg-center__row">
                <div className="msg-center__avatar">
                  {chat.plus ? (
                    <span className="msg-center__plus">+</span>
                  ) : (
                    <>
                      <img src={assets.msgPersonIcon} alt="" className="msg-center__avatar-icon" />
                    </>
                  )}
                </div>
                <div className="msg-center__text">
                  <strong>{chat.name}</strong>
                  <span>{chat.preview}</span>
                </div>
                {chat.pin && <img src={assets.msgThumbtack} alt="" className="msg-center__pin" />}
                {chat.unread && <img src={assets.msgNotif} alt="" className="msg-center__badge" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
