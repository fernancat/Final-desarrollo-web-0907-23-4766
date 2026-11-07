export function FormField({ label, name, error, ...inputProps }) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span className="field__label">{label}</span>

      <input
        className="field__input"
        name={name}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />

      {error ? <span id={errorId} className="field__error">{error}</span> : null}
    </label>
  );
}
