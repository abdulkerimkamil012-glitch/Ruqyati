import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { AppProvider } from './state/app';
import { NavProvider } from './state/nav';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </AppProvider>
  </StrictMode>,
);
