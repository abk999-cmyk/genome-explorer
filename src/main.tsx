import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useSelection } from './store/selectionStore.ts'

// Dev-only: expose the selection store for automated verification in the preview.
if (import.meta.env.DEV) {
  ;(window as unknown as { __selection?: typeof useSelection }).__selection =
    useSelection
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
