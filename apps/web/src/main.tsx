import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { DIProvider } from '@org/di';
import { container } from './app/container';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <DIProvider container={container}>
        <App />
      </DIProvider>
    </BrowserRouter>
  </StrictMode>,
);
