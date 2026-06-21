import { Routes, Route, useLocation } from 'react-router-dom';

import AppLayout from '@/app/layouts/AppLayout';
import { routePaths } from '@/app/routes/routePaths';
import SettingsPage from '@/pages/AccountSettingsPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import ClosingOrderGuidePage from '@/pages/ClosingOrderGuidePage';
import ClosingPage from '@/pages/ClosingPage';
import CredentialLoginPage from '@/pages/CredentialLoginPage';
import CustomerOrderPage from '@/pages/CustomerOrderPage';
import DashboardPage from '@/pages/DashboardPage';
import DayClosedPage from '@/pages/DayClosedPage';
import InitialSetupPage from '@/pages/InitialSetupPage';
import InventoryPage from '@/pages/InventoryPage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NoticesPage from '@/pages/NoticesPage';
import OcrInboundPage from '@/pages/OcrInboundPage';
import OrderGuidePage from '@/pages/OrderGuidePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsIngredientsPage from '@/pages/SettingsIngredientsPage';
import SettingsMenuBoardPage from '@/pages/SettingsMenuBoardPage';
import SettingsMenusPage from '@/pages/SettingsMenusPage';
import SettingsRecipesPage from '@/pages/SettingsRecipesPage';
import StoreSelectionPage from '@/pages/StoreSelectionPage';
import StoreSettingsPage from '@/pages/StoreSettingsPage';
import SystemStartPage from '@/pages/SystemStartPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';

const StandalonePageWrapper = ({ element }: { element: React.ReactElement }) => {
  const { key } = useLocation();
  return (
    <div key={key} className="animate-page-fade-in">
      {element}
    </div>
  );
};

export default function Router() {
  return (
    <Routes>
      {/* 레이아웃 없는 페이지 */}
      <Route
        path={routePaths.landing}
        element={<StandalonePageWrapper element={<LandingPage />} />}
      />
      <Route
        path={routePaths.authCallback}
        element={<StandalonePageWrapper element={<AuthCallbackPage />} />}
      />
      <Route path={routePaths.login} element={<StandalonePageWrapper element={<LoginPage />} />} />
      <Route
        path={routePaths.credentialLogin}
        element={<StandalonePageWrapper element={<CredentialLoginPage />} />}
      />
      <Route
        path={routePaths.register}
        element={<StandalonePageWrapper element={<RegisterPage />} />}
      />
      <Route
        path={routePaths.storeSelection}
        element={<StandalonePageWrapper element={<StoreSelectionPage />} />}
      />
      <Route
        path={routePaths.initialSetup}
        element={<StandalonePageWrapper element={<InitialSetupPage />} />}
      />
      <Route
        path={routePaths.systemStart}
        element={<StandalonePageWrapper element={<SystemStartPage />} />}
      />
      <Route
        path={routePaths.dayClosed}
        element={<StandalonePageWrapper element={<DayClosedPage />} />}
      />
      <Route
        path={routePaths.closingOrderGuideDetail}
        element={<StandalonePageWrapper element={<ClosingOrderGuidePage />} />}
      />
      <Route
        path={routePaths.ocrInbound}
        element={<StandalonePageWrapper element={<OcrInboundPage />} />}
      />
      <Route
        path={routePaths.customerOrder}
        element={<StandalonePageWrapper element={<CustomerOrderPage />} />}
      />
      <Route
        path={routePaths.notices}
        element={<StandalonePageWrapper element={<NoticesPage />} />}
      />
      <Route
        path={routePaths.terms}
        element={<StandalonePageWrapper element={<TermsOfServicePage />} />}
      />
      <Route
        path={routePaths.privacy}
        element={<StandalonePageWrapper element={<PrivacyPolicyPage />} />}
      />
      <Route
        path={routePaths.notFound}
        element={<StandalonePageWrapper element={<NotFoundPage />} />}
      />

      {/* 사이드바 + 상단바 공통 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
        <Route path={routePaths.inventory} element={<InventoryPage />} />
        <Route path={routePaths.orderGuide} element={<OrderGuidePage />} />
        <Route path={routePaths.closing} element={<ClosingPage />} />
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
