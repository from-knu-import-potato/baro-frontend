import { Routes, Route } from 'react-router-dom';

import AppLayout from '@/app/layouts/AppLayout';
import { routePaths } from '@/app/routes/routePaths';
import AccountPage from '@/pages/AccountPage';
import DashboardPage from '@/pages/DashboardPage';
import InitialSetupPage from '@/pages/InitialSetupPage';
import InventoryCurrentPage from '@/pages/InventoryCurrentPage';
import InventoryDepletedPage from '@/pages/InventoryDepletedPage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OrderGuidePage from '@/pages/OrderGuidePage';
import PriceAnalysisPage from '@/pages/PriceAnalysisPage';
import SettingsIngredientsPage from '@/pages/SettingsIngredientsPage';
import SettingsPage from '@/pages/SettingsPage';
import StoreSelectionPage from '@/pages/StoreSelectionPage';

export default function Router() {
  return (
    <Routes>
      {/* 레이아웃 없는 페이지 */}
      <Route path={routePaths.landing} element={<LandingPage />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.storeSelection} element={<StoreSelectionPage />} />
      <Route path={routePaths.initialSetup} element={<InitialSetupPage />} />
      <Route path={routePaths.notFound} element={<NotFoundPage />} />

      {/* 사이드바 + 상단바 공통 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
        <Route path={routePaths.inventoryCurrent} element={<InventoryCurrentPage />} />
        <Route path={routePaths.inventoryDepleted} element={<InventoryDepletedPage />} />
        <Route path={routePaths.orderGuide} element={<OrderGuidePage />} />
        <Route path={routePaths.priceAnalysis} element={<PriceAnalysisPage />} />
        <Route path={routePaths.settings} element={<SettingsPage />} />
        <Route path={routePaths.account} element={<AccountPage />} />
        <Route path={routePaths.settingsIngredients} element={<SettingsIngredientsPage />} />
      </Route>
    </Routes>
  );
}
