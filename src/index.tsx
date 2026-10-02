import React from 'react';
import ReactDOM from 'react-dom/client';
import { IconContext } from '@phosphor-icons/react';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import '@fontsource-variable/sofia-sans/wght.css';
import '@fontsource-variable/sofia-sans-condensed/wght.css';
import App from './app/app.component';
import { LocaleProvider } from './i18n/locale-context';
import './index.css';

const ICON_DEFAULTS = { size: '1em', weight: 'regular' as const };

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LocaleProvider>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion='user'>
          <IconContext.Provider value={ICON_DEFAULTS}>
            <App />
          </IconContext.Provider>
        </MotionConfig>
      </LazyMotion>
    </LocaleProvider>
  </React.StrictMode>
);
