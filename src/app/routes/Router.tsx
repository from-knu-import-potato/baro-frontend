import { Routes, Route } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function Router() {
  return (
    <Routes>
      <Route path={routePaths.landing} element={<LandingPage />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
