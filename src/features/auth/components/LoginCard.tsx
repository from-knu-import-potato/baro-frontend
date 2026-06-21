import KakaoLoginButton from '@/features/auth/components/KakaoLoginButton';
import LoginFeatureItem from '@/features/auth/components/LoginFeatureItem';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';

interface LoginCardProps {
  onKakaoLoginClick: () => void;
}

const LoginCard = ({ onKakaoLoginClick }: LoginCardProps) => {
  return (
    <Card className="rounded-3xl border-border/60 py-6">
      <CardHeader className="text-center">
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
        <LoginFeatureItem
          badge="OCR"
          badgeColor="blue"
          label="Smart Recognition"
          description="거래명세서 촬영만으로 재고 자동 등록"
        />
        <LoginFeatureItem
          badge="AI"
          badgeColor="green"
          label="Smart Prediction"
          description="AI 기반 식자재 발주 가이드 제공"
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-6">
        <KakaoLoginButton onClick={onKakaoLoginClick} />

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          처음 로그인 시 자동으로 회원가입이 진행됩니다.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
