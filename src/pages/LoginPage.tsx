import { Link, useNavigate } from 'react-router-dom';

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

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackButton onClick={() => navigate(routePaths.landing)} />

      <div className="w-full max-w-md">
        <LoginCard onKakaoLoginClick={handleKakaoLoginClick} />

        <div className="mt-4 flex justify-center">
          <Link
            to={routePaths.credentialLogin}
            className="rounded-full border border-border px-5 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            빠른 데모 시연이 필요하신가요? →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
