import { useState } from 'react';
import styles from './Field.module.scss'

const Field = (props) => {
  const {
    className = '',
    id,
    label,
    type = 'search',
    value,
    onInput,
    ref,
    error,
  } = props

  const [isReadOnly, setIsReadOnly] = useState(true);

  const handleFocus = (e) => {
    setIsReadOnly(false);
    // Если нужно, можно вызвать оригинальный onFocus из props
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsReadOnly(true);
    if (props.onBlur) props.onBlur(e);
  };

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
        autoComplete="false"
        type={type}
        value={value}
        onInput={onInput}
        readOnly={isReadOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && (
        <span className={styles.error} title={error}>{error}</span>
      )}
    </div>
  )
}

export default Field