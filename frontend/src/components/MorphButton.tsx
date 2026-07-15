export type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface MorphButtonProps {
  state: SubmitState;
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
  className?: string;
  type?: 'submit' | 'button';
}

export default function MorphButton({
  state,
  idleLabel,
  loadingLabel,
  successLabel,
  className = '',
  type = 'submit',
}: MorphButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-lg btn-block morph-btn morph-btn--${state} ${className}`}
      disabled={state === 'loading' || state === 'success'}
    >
      {state === 'loading' && (
        <>
          <span className="morph-spinner" aria-hidden="true" />
          {loadingLabel}
        </>
      )}
      {state === 'success' && (
        <>
          <span className="morph-check" aria-hidden="true">✓</span>
          {successLabel}
        </>
      )}
      {(state === 'idle' || state === 'error') && idleLabel}
    </button>
  );
}
