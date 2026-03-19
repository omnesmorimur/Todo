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
  } = props

  return (
    <div className={`${styles.field} ${className}`}>
      <label
        className={styles.label}
        htmlFor={id}                    
      >
        {label}
      </label>
      <input
        className={`${styles.input} ${error ? styles.isInvalid: ''}`}
        id={id}                          
        ref={ref}
        placeholder=""
        autoComplete="off"
        type={type}                       
        value={value}
        onInput={onInput}
      />
      {error && (
        <span className={styles.error} title={error}>{error}</span>
      )}
    </div>
  )
}

export default Field