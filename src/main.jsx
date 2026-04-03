import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App2 from '@/app'

const hideInitialLoader = () => {
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.classList.add('hide')
    setTimeout(() => {
      loader.remove()
    }, 300)
  }
}

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App2 />
  </StrictMode>
)

setTimeout(hideInitialLoader, 100)