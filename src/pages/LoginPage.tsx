import { BadgeAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate(routePaths.signup);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-baro-ivory/30 px-4">
      <Card className="w-full max-w-md px-3 py-5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-baro-black">로그인</CardTitle>

              <CardDescription className="mt-2 text-sm leading-relaxed text-baro-black-muted">
                BARO에 로그인하고
                <br />
                스마트 재고 관리를 시작해보세요.
              </CardDescription>
            </div>

            <CardAction>
              <Button
                variant="link"
                onClick={handleSignupClick}
                className="text-sm text-baro-blue font-semibold"
              >
                회원가입
              </Button>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="email" className="text-sm font-semibold text-baro-black">
                  이메일
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="example@baro.com"
                  required
                  className="h-11 border-baro-ivory-dark focus-visible:ring-transparent"
                />
              </div>

              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-baro-black">
                    비밀번호
                  </Label>

                  <Button variant="link" className="text-sm text-baro-blue hover:underline">
                    비밀번호 찾기
                  </Button>
                </div>

                <Input
                  id="password"
                  type="password"
                  required
                  className="h-11 border-baro-ivory-dark  focus-visible:ring-transparent"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          <Button className="h-11 w-full bg-baro-blue hover:bg-baro-blue/90">로그인</Button>
          <Button
            variant="outline"
            className="h-11 w-full border-baro-ivory-dark hover:cursor-not-allowed text-gray-600"
          >
            <BadgeAlert /> 소셜 로그인 도입 예정
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
