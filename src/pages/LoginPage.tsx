import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import KakaoLoginButton from '@/features/auth/components/KakaoLoginButton';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Back Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-6 left-6 rounded-full hover:bg-muted p-2"
        onClick={() => navigate(routePaths.landing)}
        aria-label="뒤로 가기"
      >
        <ArrowLeft className="size-4 text-baro-black" />
      </Button>

      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="rounded-3xl border-border/60  py-6">
          <CardHeader className="text-center">
            {/* Title with Logo */}
            <div className="flex items-center justify-center gap-3 pr-4">
              <img src={baroLogo} alt="BARO Logo" className="h-10 w-auto" />
              <CardTitle className="text-3xl font-black tracking-tight">BARO 로그인</CardTitle>
            </div>

            <CardDescription className="mt-5 text-sm leading-relaxed text-muted-foreground">
              카카오 계정으로 간편하게 로그인하고
              <br />
              스마트 재고 관리를 시작해보세요.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-2 space-y-4 px-4">
            {/* Feature Preview 1 */}
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-baro-blue/10 text-xs font-black text-baro-blue">
                  OCR
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-baro-blue">
                    Smart Recognition
                  </p>

                  <p className="text-sm font-semibold">거래명세서 촬영만으로 재고 자동 등록</p>
                </div>
              </div>
            </div>

            {/* Feature Preview 2 */}
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-baro-green/10 text-xs font-black text-baro-green">
                  AI
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-baro-green">
                    Smart Prediction
                  </p>

                  <p className="text-sm font-semibold">AI 기반 식자재 발주 추천 및 시세 분석</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <KakaoLoginButton />

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              처음 로그인 시 자동으로 회원가입이 진행됩니다.
            </p>
          </CardFooter>
        </Card>

        {/* Bottom Copyright */}
        <p className="mt-6 pt-3 text-center text-xs text-muted-foreground">
          © 2026 BARO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
