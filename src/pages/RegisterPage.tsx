import { Link, useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';
import BackButton from '@/shared/components/BackButton';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackButton onClick={() => navigate(routePaths.login)} />

      <div className="w-full max-w-md">
        <Card className="rounded-3xl border-border/60 py-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 pr-4">
              <img src={baroLogo} alt="BARO Logo" className="h-10 w-auto" />
              <CardTitle className="text-3xl font-black tracking-tight">BARO 회원가입</CardTitle>
            </div>

            <CardDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              초대 코드가 있는 분만 가입할 수 있습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <RegisterForm />

            <div className="h-6" />
            <p className="text-center text-xs text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link to={routePaths.login} className="font-semibold text-baro-blue hover:underline">
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 pt-3 text-center text-xs text-muted-foreground">
          © 2026 BARO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
