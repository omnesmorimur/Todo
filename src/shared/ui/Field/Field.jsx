import { useState, useRef, useEffect } from 'react';
import styles from './Field.module.scss'

const Field = (props) => {
  const {
    className = '',
    id: externalId,
    label,
    type = 'search',
    value,
    onInput,
    ref: externalRef,
    error,
  } = props

  const [uniqueId] = useState(() => `field_${Math.random().toString(36).substr(2, 8)}`);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const internalRef = useRef(null);
  
  const setRefs = (element) => {
    internalRef.current = element;
    if (externalRef) {
      if (typeof externalRef === 'function') {
        externalRef(element);
      } else {
        externalRef.current = element;
      }
    }
  };

  const handleFocus = (e) => {
    setIsReadOnly(false);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsReadOnly(true);
    if (props.onBlur) props.onBlur(e);
  };

  const uniqueName = `field_${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={uniqueId}>
        {label}
      </label>
      <input
        className={`${styles.input} ${error ? styles.isInvalid: ''}`}
        id={uniqueId}
        name={uniqueName}
        ref={setRefs}
        placeholder=""
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
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