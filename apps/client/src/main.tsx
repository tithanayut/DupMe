import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { GameContextProvider } from './contexts/GameContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameContextProvider>
      <div className="pt-16 md:pt-0">
        <App />
      </div>
    </GameContextProvider>
  </React.StrictMode>,
);
