import { Link } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import CredentialLoginForm from '@/features/auth/components/CredentialLoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const CredentialLoginCard = () => {
  return (
    <Card className="rounded-3xl border-border/60 py-6">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 pr-4">
          <img src={baroLogo} alt="BARO Logo" className="h-10 w-auto" />
          <CardTitle className="text-3xl font-black tracking-tight">아이디로 로그인</CardTitle>
        </div>
        <CardDescription className="mt-2 text-sm text-muted-foreground">
          발급받은 계정으로 로그인하세요.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        <CredentialLoginForm />

        <p className="text-center text-xs text-muted-foreground">
          계정이 없으신가요?{' '}
          <Link to={routePaths.register} className="font-semibold text-baro-blue hover:underline">
            회원가입
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default CredentialLoginCard;
