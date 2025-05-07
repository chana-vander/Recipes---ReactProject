import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
  // if (rootElement) {
  //   createRoot(rootElement).render(
  //     <StrictMode>
  //       <App />
  //     </StrictMode>
  //   );
  // } else {
  //   console.error("⚠️ לא נמצא אלמנט עם id=root ב-HTML!");
  // }  
)
