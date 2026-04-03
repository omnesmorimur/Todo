import { BASE_URL } from "../../constans"

const RouterLink = (props) => {
    const {
        to,
        children,
        onClick,
        ...rest
    } = props

    const normalizedPath = `${BASE_URL}${to}`.replace(/\/+/g, '/')

    const handleClick = (event) => {
        // Устанавливаем флаг, что это навигация через RouterLink (не обновление страницы)
        sessionStorage.setItem('isNavigating', 'true')
        
        if (onClick) {
            onClick(event)
        }
        event.preventDefault()
        window.history.pushState({}, '', normalizedPath)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    return (
        <a href={normalizedPath} onClick={handleClick} {...rest}>
            {children}
        </a>
    )
}

export default RouterLink