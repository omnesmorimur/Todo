import { memo } from 'react';
import styles from './Button.module.scss';

const Button2 = memo((props) => {
  const {
    className = '',
    type = 'button',
    children,
    isDisabled,
    onClick,
    variant = 'primary',
    size = 'medium',
  } = props;

  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${className}
      `}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
});

export default Button2;