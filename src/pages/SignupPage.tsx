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

const SignupPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(routePaths.login);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-baro-ivory/30 px-4">
      <Card className="w-full max-w-md px-3 py-5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-baro-black">회원가입</CardTitle>

              <CardDescription className="mt-2 text-sm leading-relaxed text-baro-black-muted">
                BARO와 함께
                <br />
                스마트 재고 관리를 시작해보세요.
              </CardDescription>
            </div>

            <CardAction>
              <Button
                variant="link"
                onClick={handleLoginClick}
                className="text-sm font-semibold text-baro-blue"
              >
                로그인
              </Button>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="nickname" className="text-sm font-semibold text-baro-black">
                  닉네임
                </Label>

                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  required
                  className="h-11 border-baro-ivory-dark focus-visible:ring-transparent"
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="email" className="text-sm font-semibold text-baro-black">
                  이메일
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@baro.com"
                    required
                    className="h-11 border-baro-ivory-dark focus-visible:ring-transparent"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 border-baro-ivory-dark px-4 text-sm"
                  >
                    중복 확인
                  </Button>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="password" className="text-sm font-semibold text-baro-black">
                  비밀번호
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  required
                  className="h-11 border-baro-ivory-dark focus-visible:ring-transparent"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          <Button className="h-11 w-full bg-baro-blue hover:bg-baro-blue/90">회원가입</Button>

          <Button
            variant="outline"
            className="h-11 w-full cursor-not-allowed border-baro-ivory-dark text-gray-600"
          >
            <BadgeAlert />
            소셜 회원가입 도입 예정
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
