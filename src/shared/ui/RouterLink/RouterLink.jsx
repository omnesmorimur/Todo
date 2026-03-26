import { BASE_URL } from "../../constans"

const RouterLink = (props) => {
    const {
        to,
        children,
        ...rest
    } = props

    const handleClick = (event) => {
        event.preventDefault()
        const fullPath = `${BASE_URL}${to}`.replace(/\/+/g, '/') // удаляем лишние слеши
        window.history.pushState({}, '', fullPath)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    return (
        <a href={`${BASE_URL}${to}`} onClick={handleClick} {...rest}>
            {children}
        </a>
    )
}

export default RouterLink