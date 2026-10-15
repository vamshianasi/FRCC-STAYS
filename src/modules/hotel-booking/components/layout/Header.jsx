import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Only "Stay" works for now. The other items are placeholders until this module
// is merged into the main FRCC site, where the team replaces them with real routes.
const STAY_PATH = "/book/hotel";
const MY_BOOKINGS_PATH = "/book/hotel/my-bookings";
const EMBLEM_SRC = "/images/brand/frcc-emblem-header.png";
const EMBLEM_SRC_2X = "/images/brand/frcc-emblem-header-2x.png";
const PHONE_DISPLAY = "+91 78936 16262";
const PHONE_LINK = "tel:+917893616262";
const navItems = ["Stay", "Halls", "Activities", "Parking", "Membership", "Gallery", "Leadership"];

const css = `
.frcc-header{position:sticky;top:0;z-index:50;font-family:"Inter",system-ui,sans-serif}
.frcc-header *{box-sizing:border-box}
.frcc-topbar{background:#0B1A33;color:#fff;height:35px}
.frcc-topbar__inner{height:100%;max-width:1500px;margin:0 auto;padding:0 30px;display:flex;align-items:center;justify-content:space-between;font-size:13px;line-height:1}
.frcc-topbar__left{display:flex;align-items:center;gap:15px}
.frcc-topbar__phone{display:flex;align-items:center;gap:8px;color:#fff;text-decoration:none}
.frcc-topbar__help{color:#fff;cursor:default}
.frcc-topbar__promo{color:#C9A227}
.frcc-nav{position:relative;background:#fff;border-bottom:1px solid #E6E1D5}
.frcc-nav__inner{max-width:1500px;margin:0 auto;padding:0 30px;height:62px;display:flex;align-items:center;gap:24px}
.frcc-brand{display:flex;align-items:center;gap:10px;text-decoration:none;flex:0 0 auto}
.frcc-brand img{width:50px;height:50px;flex:0 0 50px;object-fit:contain;display:block}
.frcc-brand__text{display:flex;flex-direction:column;justify-content:center;line-height:1}
.frcc-brand__title{display:block;font-family:"Source Serif 4",Georgia,serif;font-weight:700;font-size:22px;line-height:1.1;color:#0B1A33}
.frcc-brand__tag{display:block;margin-top:3px;font-size:11px;font-weight:400;letter-spacing:.08em;color:#6B7385;white-space:nowrap}
.frcc-links{flex:1;display:flex;justify-content:center;align-items:center;gap:18px}
.frcc-link{position:relative;padding:8px 0;font-size:13px;font-weight:500;line-height:1;color:#0B1A33;text-decoration:none;white-space:nowrap}
.frcc-link--off{cursor:default;user-select:none}
.frcc-link.is-active::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:#C9A227}
.frcc-right{display:flex;align-items:center;gap:8px;flex:0 0 auto}
.frcc-bookbtn{display:inline-flex;align-items:center;justify-content:center;height:35px;padding:0 18px;border-radius:12px;background:#C9A227;color:#0B1A33;font-size:14px;font-weight:600;line-height:1;cursor:default;user-select:none;white-space:nowrap}
.frcc-avatarwrap{position:relative}
.frcc-avatar{width:36px;height:36px;padding:0;border-radius:50%;border:1px solid #E3D49A;background:#FBF6E6;color:#0B1A33;font-family:"Source Serif 4",Georgia,serif;font-weight:700;font-size:14px;cursor:pointer}
.frcc-menu{position:absolute;right:0;top:44px;min-width:170px;background:#fff;border:1px solid #E6E1D5;border-radius:12px;box-shadow:0 8px 30px rgba(11,26,51,.12);padding:6px}
.frcc-menu a{display:block;padding:10px 12px;border-radius:8px;font-size:14px;color:#0B1A33;text-decoration:none}
.frcc-menu a:hover{background:#F3F0E8}
.frcc-burger{display:none;width:36px;height:36px;padding:0;align-items:center;justify-content:center;border:1px solid #E6E1D5;border-radius:10px;background:#fff;cursor:pointer}
.frcc-mobile{position:absolute;left:0;right:0;top:100%;background:#fff;border-bottom:1px solid #E6E1D5;box-shadow:0 12px 24px rgba(11,26,51,.08);padding:8px 30px 16px}
.frcc-mobile .frcc-link{display:block;padding:12px 0;font-size:15px}
.frcc-mobile .frcc-link.is-active::after{right:auto;width:28px;bottom:6px}
@media (max-width:980px){.frcc-links{display:none}.frcc-burger{display:inline-flex}.frcc-bookbtn{display:none}.frcc-right{margin-left:auto}}
@media (max-width:640px){.frcc-topbar__promo{display:none}.frcc-topbar__inner,.frcc-nav__inner{padding:0 16px}.frcc-brand__tag{font-size:9px;letter-spacing:.05em}.frcc-mobile{padding:8px 16px 16px}}
`;

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9D1E0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => { setMenuOpen(false); setAvatarOpen(false); }, [pathname]);
  useEffect(() => {
    const onDoc = (e) => { if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const stayActive = pathname.startsWith("/book/hotel");
  const renderItem = (label) =>
    label === "Stay" ? (
      <Link key={label} to={STAY_PATH} className={"frcc-link" + (stayActive ? " is-active" : "")}>Stay</Link>
    ) : (
      <span key={label} className="frcc-link frcc-link--off" aria-disabled="true">{label}</span>
    );

  return (
    <header className="frcc-header">
      <style>{css}</style>
      <div className="frcc-topbar">
        <div className="frcc-topbar__inner">
          <div className="frcc-topbar__left">
            <a className="frcc-topbar__phone" href={PHONE_LINK}><PhoneIcon /><span>{PHONE_DISPLAY}</span></a>
            <span className="frcc-topbar__help">Help</span>
          </div>
          <div className="frcc-topbar__promo">Members save 30% on every booking</div>
        </div>
      </div>

      <div className="frcc-nav">
        <div className="frcc-nav__inner">
          {/* Change this link to "/" after merging into the main site. */}
          <Link to={STAY_PATH} className="frcc-brand" aria-label="FRCC - Film Recreation & Cultural Centre">
            <img
              src={EMBLEM_SRC}
              srcSet={`${EMBLEM_SRC} 1x, ${EMBLEM_SRC_2X} 2x`}
              width="50" height="50" alt=""
              onError={(e) => { console.warn("Header emblem missing: " + EMBLEM_SRC); e.currentTarget.style.display = "none"; }}
            />
            <span className="frcc-brand__text">
              <span className="frcc-brand__title">FRCC</span>
              <span className="frcc-brand__tag">Film Recreation &amp; Cultural Centre</span>
            </span>
          </Link>

          <nav className="frcc-links" aria-label="Main">{navItems.map(renderItem)}</nav>

          <div className="frcc-right">
            <span className="frcc-bookbtn" role="button" aria-disabled="true">Book now</span>
            <div className="frcc-avatarwrap" ref={avatarRef}>
              <button type="button" className="frcc-avatar" aria-haspopup="menu" aria-expanded={avatarOpen} aria-label="Account menu" onClick={() => setAvatarOpen((v) => !v)}>G</button>
              {avatarOpen && (
                <div className="frcc-menu" role="menu">
                  <Link to={MY_BOOKINGS_PATH} role="menuitem">My Bookings</Link>
                </div>
              )}
            </div>
            <button type="button" className="frcc-burger" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B1A33" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
        {menuOpen && <div className="frcc-mobile">{navItems.map(renderItem)}</div>}
      </div>
    </header>
  );
}
