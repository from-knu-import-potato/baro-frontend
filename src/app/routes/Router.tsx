import { Routes, Route } from 'react-router-dom';

import AppLayout from '@/app/layouts/AppLayout';
import { routePaths } from '@/app/routes/routePaths';
import SettingsPage from '@/pages/AccountSettingsPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import CustomerOrderPage from '@/pages/CustomerOrderPage';
import DashboardPage from '@/pages/DashboardPage';
import InitialSetupPage from '@/pages/InitialSetupPage';
import InventoryPage from '@/pages/InventoryPage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OcrInboundPage from '@/pages/OcrInboundPage';
import OrderGuidePage from '@/pages/OrderGuidePage';
import SettingsIngredientsPage from '@/pages/SettingsIngredientsPage';
import SettingsMenuBoardPage from '@/pages/SettingsMenuBoardPage';
import SettingsMenusPage from '@/pages/SettingsMenusPage';
import SettingsRecipesPage from '@/pages/SettingsRecipesPage';
import StoreSelectionPage from '@/pages/StoreSelectionPage';
import StoreSettingsPage from '@/pages/StoreSettingsPage';

export default function Router() {
  return (
    <Routes>
      {/* 레이아웃 없는 페이지 */}
      <Route path={routePaths.landing} element={<LandingPage />} />
      <Route path={routePaths.authCallback} element={<AuthCallbackPage />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.storeSelection} element={<StoreSelectionPage />} />
      <Route path={routePaths.authCallback} element={<AuthCallbackPage />} />
      <Route path={routePaths.initialSetup} element={<InitialSetupPage />} />
      <Route path={routePaths.ocrInbound} element={<OcrInboundPage />} />
      <Route path={routePaths.customerOrder} element={<CustomerOrderPage />} />
      <Route path={routePaths.notFound} element={<NotFoundPage />} />

      {/* 사이드바 + 상단바 공통 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
        <Route path={routePaths.inventory} element={<InventoryPage />} />
        <Route path={routePaths.orderGuide} element={<OrderGuidePage />} />
        {/* 가게 설정 */}
        <Route path={routePaths.storeSettings} element={<StoreSettingsPage />} />
        <Route path={routePaths.storeSettingsMenus} element={<SettingsMenusPage />} />
        <Route path={routePaths.storeSettingsMenuBoard} element={<SettingsMenuBoardPage />} />
        <Route path={routePaths.storeSettingsRecipes} element={<SettingsRecipesPage />} />
        <Route path={routePaths.storeSettingsIngredients} element={<SettingsIngredientsPage />} />
        {/* 회원 설정 */}
        <Route path={routePaths.settings} element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
