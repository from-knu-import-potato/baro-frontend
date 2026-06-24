import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { Button } from '@/shadcn/ui/button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="text-center">
        <p className="select-none text-8xl font-black text-baro-blue/20">404</p>
        <h1 className="mt-2 text-xl font-bold text-foreground">페이지를 찾을 수 없어요</h1>
        <p className="pt-2 text-sm text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
      </div>
      <Button
        onClick={() => navigate(routePaths.storeHome)}
        className="rounded-full bg-baro-blue px-6 py-5 text-white hover:bg-baro-blue/80"
      >
        홈으로 돌아가기
      </Button>
    </div>
  );
};

export default NotFoundPage;
