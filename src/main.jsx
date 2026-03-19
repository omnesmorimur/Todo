import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App2 from '@/app'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App2 />
  </StrictMode>,
)
