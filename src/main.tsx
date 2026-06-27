import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

// 브라우저의 자동 스크롤 복원 비활성화 — 앱에서 직접 관리
history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
