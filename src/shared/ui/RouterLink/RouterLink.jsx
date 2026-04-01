import { BASE_URL } from "../../constans"

const RouterLink = (props) => {
    const {
        to,
        children,
        ...rest
    } = props

    const normalizedPath = `${BASE_URL}${to}`.replace(/\/+/g, '/')

    const handleClick = (event) => {
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