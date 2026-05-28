import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { getKakaoLoginUrl } from '@/features/auth/api/authApi';
import LoginCard from '@/features/auth/components/LoginCard';
import BackButton from '@/shared/components/BackButton';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleKakaoLoginClick = () => {
    const callbackUrl = window.location.origin + routePaths.authCallback;
    window.location.href = getKakaoLoginUrl(callbackUrl);
  };

  const handleGoBackClick = () => {
    navigate(routePaths.landing);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackButton onClick={handleGoBackClick} />

      <div className="w-full max-w-md">
        <LoginCard onKakaoLoginClick={handleKakaoLoginClick} />

        <p className="mt-6 pt-3 text-center text-xs text-muted-foreground">
          © 2026 BARO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
