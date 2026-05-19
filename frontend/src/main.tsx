import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Catch global errors to prevent blank screen
window.onerror = (message) => {
  if (message === 'ResizeObserver loop limit exceeded') return;
  console.error("Application Error:", message);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
