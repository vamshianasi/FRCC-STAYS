import { useState } from 'react';
import { isMember } from '../../config/member';
import './MemberToggle.css';

// DEMO ONLY: floating toggle for member pricing. Delete for production.
export default function MemberToggle() {
  const [member, setMember] = useState(isMember);
  if (!import.meta.env.DEV) return null;
  return (
    <div className="member-toggle">
      <span className="member-toggle-label">DEMO · Member: {member ? 'ON' : 'OFF'} (30% off)</span>
      <button
        className={'member-toggle-btn' + (member ? ' on' : '')}
        onClick={() => setMember(v => !v)}
      >
        <span className="member-toggle-knob" />
      </button>
    </div>
  );
}
