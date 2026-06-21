import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import CredentialLoginCard from '@/features/auth/components/CredentialLoginCard';
import BackButton from '@/shared/components/BackButton';

const CredentialLoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackButton onClick={() => navigate(routePaths.login)} />

      <div className="w-full max-w-md">
        <CredentialLoginCard />

        <p className="mt-6 pt-3 text-center text-xs text-muted-foreground">
          © 2026 BARO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default CredentialLoginPage;
