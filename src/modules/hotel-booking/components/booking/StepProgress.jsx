import './StepProgress.css';

const STEPS = ['Search', 'Select Room', 'Details', 'Payment', 'Confirmed'];

export default function StepProgress({ current }) {
  return (
    <div className="step-progress">
      <div className="step-items">
        {STEPS.map((label, i) => {
          const stepNo = i + 1;
          const cls = i < current - 1 ? 'done' : i === current - 1 ? 'current' : 'todo';
          return (
            <div key={label} className={'step-item ' + cls}>
              <div className="step-circle">
                {i < current - 1 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span>{stepNo}</span>
                )}
              </div>
              <div className="step-label">{label}</div>
            </div>
          );
        })}
      </div>
      <div className="step-bar-track">
        <div className="step-bar-fill" style={{ width: ((current - 1) / (STEPS.length - 1)) * 100 + '%' }} />
      </div>
      <div className="step-status">Step {current} of {STEPS.length} · {STEPS[current - 1]}</div>
    </div>
  );
}
