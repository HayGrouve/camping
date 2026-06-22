import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app.component';
import { LocaleProvider } from './i18n/locale-context';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </React.StrictMode>
);
