import { Routes, Route } from 'react-router-dom';

import AppLayout from '@/app/layouts/AppLayout';
import { routePaths } from '@/app/routes/routePaths';
import DashboardPage from '@/pages/DashboardPage';
import InventoryCurrentPage from '@/pages/InventoryCurrentPage';
import InventoryDepletedPage from '@/pages/InventoryDepletedPage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PriceAnalysisPage from '@/pages/PriceAnalysisPage';

export default function Router() {
  return (
    <Routes>
      {/* 레이아웃 없는 페이지 */}
      <Route path={routePaths.landing} element={<LandingPage />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.notFound} element={<NotFoundPage />} />

      {/* 사이드바 + 상단바 공통 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
        <Route path={routePaths.inventoryCurrent} element={<InventoryCurrentPage />} />
        <Route path={routePaths.inventoryDepleted} element={<InventoryDepletedPage />} />
        <Route path={routePaths.priceAnalysis} element={<PriceAnalysisPage />} />
      </Route>
    </Routes>
  );
}
