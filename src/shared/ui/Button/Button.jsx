// shared/ui/Button/Button.jsx
import styles from './Button.module.scss'

const Button2 = (props) => {
    const {
        className = '',
        type = 'button',
        children,
        isDisabled,
        onClick,
        variant = 'primary', // primary, secondary, outline, 
        size = 'medium', // small, medium, large
    } = props

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
    )
}

export default Button2