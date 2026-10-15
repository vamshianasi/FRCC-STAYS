import { Link } from "react-router-dom";
import { FRCC_PHONE, FRCC_PHONE_TEL, FRCC_ADDRESSES } from "../../config/contact";

// Teammates' pages are placeholders until this module is merged into the main site.
const quickLinks = [
  ["Home", "/"],
  ["Book an activity", "/book/activities"],
  ["Membership", "/membership"],
  ["My profile", "/profile"],
  ["Contact / Support", "/contact"],
];
const services = [
  ["Stay", "/book/hotel"],
  ["Halls", "/book/hall"],
  ["Activities", "/book/activities"],
  ["Parking", "/book/parking"],
  ["Membership", "/membership"],
];
const bottomLinks = ["Privacy Policy", "Accessibility", "Sitemap"];

const Icon = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/* Highlighted location marker: a solid gold pin inside a round gold badge.
   Used for the postal address rows only — phone and mail keep the outline Icon. */
const PinBadge = () => (
  <span className="frcc-footer__pin">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A227" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" fill="#0B1A33" stroke="none" /></svg>
  </span>
);

const css = `
.frcc-footer{background:#0B1A33;color:#DCE2EE;font-family:"Inter",system-ui,sans-serif}
.frcc-footer *{box-sizing:border-box}
.frcc-footer__inner{max-width:1500px;margin:0 auto;padding:54px 30px}
.frcc-footer__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px 40px;align-items:start}
.frcc-footer__logo{display:block;width:110px;height:auto;margin:0 auto 16px}
.frcc-footer__tag{margin:16px 0 0;font-size:14px;line-height:21px;font-weight:400;color:#C9D1E0}
.frcc-footer__h{margin:0 0 16px;font-size:14px;line-height:20px;font-weight:600;color:#FFFFFF;text-transform:none;letter-spacing:0}
.frcc-footer__list{list-style:none;margin:0;padding:0}
.frcc-footer__list li{margin:0 0 7px}
.frcc-footer__list a{font-size:14px;line-height:20px;font-weight:400;color:#DCE2EE;text-decoration:none}
.frcc-footer__list a:hover,.frcc-footer__bottom a:hover{color:#C9A227}
.frcc-footer__contact{display:flex;gap:10px;align-items:flex-start;margin:0 0 11px;font-size:14px;line-height:20px;font-weight:400;color:#DCE2EE}
.frcc-footer__contact--address{gap:12px}
.frcc-footer__pin{flex:0 0 28px;width:28px;height:28px;margin-top:-4px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(201,162,39,0.18);border:1px solid rgba(201,162,39,0.55)}
.frcc-footer__address{display:block;min-width:0}
.frcc-footer__phone{min-width:0;color:inherit;text-decoration:none}
.frcc-footer__hours{margin:2px 0 0;font-size:12px;line-height:20px;color:#8A98B2}
.frcc-footer__line{border-top:1px solid rgba(255,255,255,0.12)}
.frcc-footer__bottom{max-width:1500px;margin:0 auto;padding:0 30px;min-height:47px;display:flex;align-items:center;justify-content:flex-end;gap:20px}
.frcc-footer__bottom a{font-size:12px;color:#8A98B2;text-decoration:none}
@media (max-width:900px){.frcc-footer__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.frcc-footer__inner{padding:40px 20px}.frcc-footer__bottom{padding:0 20px}}
@media (max-width:560px){.frcc-footer__grid{grid-template-columns:1fr}.frcc-footer__logo{width:100px}.frcc-footer__bottom{justify-content:flex-start;flex-wrap:wrap;gap:8px 20px;padding-top:12px;padding-bottom:12px}}
`;

export default function Footer() {
  return (
    <footer className="frcc-footer">
      <style>{css}</style>
      <div className="frcc-footer__inner">
        <div className="frcc-footer__grid">
          <div>
            <Link to="/" aria-label="FRCC - Film Recreation & Cultural Centre">
              <img
                className="frcc-footer__logo"
                src="/images/brand/frcc-emblem.png"
                srcSet="/images/brand/frcc-emblem.png 1x, /images/brand/frcc-emblem.png 1x"
                alt="FRCC - Film Recreation & Cultural Centre"
                onError={(e) => { console.warn("Footer emblem file missing: /images/brand/frcc-emblem.png"); e.currentTarget.style.display = "none"; }}
              />
            </Link>
            <p className="frcc-footer__tag">Film Recreation & Cultural Centre</p>
          </div>

          <div>
            <h3 className="frcc-footer__h">Quick links</h3>
            <ul className="frcc-footer__list">
              {quickLinks.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="frcc-footer__h">Services</h3>
            <ul className="frcc-footer__list">
              {services.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="frcc-footer__h">Contact</h3>
            {FRCC_ADDRESSES.map(({ city, address }) => (
              <div key={city} className="frcc-footer__contact frcc-footer__contact--address">
                <PinBadge />
                <span className="frcc-footer__address">
                  <strong>{city}:</strong> {address}
                </span>
              </div>
            ))}
            <div className="frcc-footer__contact">
              <Icon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>
              <a className="frcc-footer__phone" href={FRCC_PHONE_TEL}>{FRCC_PHONE}</a>
            </div>
            <div className="frcc-footer__contact">
              <Icon><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>
              <span>hello@frcc.club</span>
            </div>
            <p className="frcc-footer__hours">Front desk open 6 AM – 11 PM daily</p>
          </div>
        </div>
      </div>
      <div className="frcc-footer__line">
        <div className="frcc-footer__bottom">
          {bottomLinks.map((t) => (<a key={t} href="#">{t}</a>))}
        </div>
      </div>
    </footer>
  );
}