import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './shopify_merchant/App';
import './shopify_merchant/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
