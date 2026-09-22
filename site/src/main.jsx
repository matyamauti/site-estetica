import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* iOS Safari só aplica :active (o "hover" do toque) quando a página
   escuta touchstart. Vazio e passivo: não atrasa a rolagem. */
document.addEventListener('touchstart', () => {}, { passive: true });
