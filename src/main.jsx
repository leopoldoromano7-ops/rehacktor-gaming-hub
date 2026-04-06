import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const splash = document.getElementById('app-splash')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.setTimeout(() => {
  splash?.classList.add('is-hidden')

  window.setTimeout(() => {
    splash?.remove()
  }, 420)
}, 1800)
