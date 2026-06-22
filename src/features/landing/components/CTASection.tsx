import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

const CTASection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);

  return (
    <section ref={ref} className="py-20 overflow-hidden mb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8  ">
        <div
          className={cn(
            'flex flex-col items-center text-center transition-[opacity,transform] duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <p className="text-baro-blue text-xs font-bold uppercase tracking-[0.2em] mb-6">
            {isLoggedIn ? '이미 로그인되어 있어요' : '무료로 시작하기'}
          </p>
          <h2 className="text-2xl lg:text-4xl font-black text-baro-black dark:text-white leading-tight mb-4">
            지금 바로,
            <br />
            <span className="text-baro-blue">BARO</span>와 함께 시작하세요
          </h2>
          <p className="text-baro-black-muted text-sm lg:text-base leading-relaxed mb-8">
            설치 없이 바로 시작하고,
            <br />
            매일 반복되는 비효율에서 벗어나세요.
          </p>
          <Button
            onClick={() => {
              if (isLoggedIn) {
                if (window.history.length > 1) navigate(-1);
                else navigate(routePaths.myStores);
              } else {
                navigate(routePaths.login);
              }
            }}
            className="mt-8 bg-baro-blue hover:bg-baro-blue/90 text-white font-bold p-4 py-5 rounded-full text-sm"
          >
            {isLoggedIn ? '돌아가기' : 'BARO 무료로 시작하기'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
