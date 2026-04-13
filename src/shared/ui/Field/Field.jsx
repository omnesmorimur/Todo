import styles from './Field.module.scss'

const Field = (props) => {
  const {
    className = '',
    id,
    label,
    type = 'text',
    value,
    onInput,
    ref,
    error,
    autoComplete = 'off',
  } = props

  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={`${styles.input} ${error ? styles.isInvalid: ''}`}
        id={id}
        ref={ref}
        placeholder=""
        autoComplete={autoComplete}
        type={type}
        value={value}
        onInput={onInput}
        name={id}
        spellCheck="false"
        data-form-type="other"
      />
      {error && (
        <span className={styles.error} title={error}>{error}</span>
      )}
    </div>
  )
}

export default Field