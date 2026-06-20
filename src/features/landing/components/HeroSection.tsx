import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import baroLogo from '@/shared/assets/images/baro-logo.png';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

const HeroSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();

  const handleStartClick = () => {
    navigate(routePaths.login);
  };

  const handleFeaturesClick = () => {
    const featuresSection = document.getElementById('features');

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="max-w-8xl mx-auto px-4 py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 items-center text-center lg:text-left">
          {/* Left Content */}
          <div
            className={cn(
              'flex flex-col items-center lg:items-start transition-[opacity,transform] duration-1000 delay-100',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10',
            )}
          >
            <div className="mb-2 inline-flex items-center rounded-full border border-baro-blue/10 bg-baro-blue/5 px-4 py-2 text-sm font-semibold text-baro-blue self-center lg:self-start backdrop-blur-sm">
              소규모 카페·식당을 위한 올인원 가게 운영 플랫폼
            </div>
            <div className="flex flex-col sm:flex-row gap-5 items-center mb-3">
              <img
                src={baroLogo}
                alt="BARO Logo"
                className="h-20 lg:h-29 w-auto transition-transform duration-500 group-hover:scale-110"
              />
              <p className="mb-6 font-extrabold text-3xl leading-tight tracking-tight lg:text-4xl">
                찍으면 <span className="text-baro-blue">바로</span>
                <br />
                재고 관리도 <span className="text-baro-green">바로</span>
              </p>
            </div>

            <p className="mb-12 max-w-2xl text-sm leading-relaxed text-baro-black-muted lg:text-md">
              거래명세서 촬영만으로 재고를 자동 등록하고,
              <br />
              QR 주문 접수부터 AI 발주, 마감까지 한 번에 관리하세요.
            </p>

            <div className="mt-4 lg:mt-10 mb-10 w-full flex flex-col items-center gap-4 sm:flex-row justify-center lg:justify-start">
              <Button
                onClick={handleStartClick}
                className="h-auto rounded-full bg-baro-blue px-8 py-3 hover:bg-baro-blue/90 w-full sm:w-auto text-white"
              >
                BARO 시작하기
              </Button>

              <Button
                variant="outline"
                onClick={handleFeaturesClick}
                className="h-auto rounded-full px-8 py-3 w-full sm:w-auto"
              >
                기능 둘러보기
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-baro-black-muted font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-baro-green" />
                <span>완전 무료 서비스</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-baro-green" />
                <span>별도 설치 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-baro-green" />
                <span>모바일 완벽 지원</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div
            className={cn(
              'relative flex transition-[opacity,transform] duration-1000 delay-300 mt-12 lg:mt-0',
              isVisible
                ? 'opacity-100 translate-y-0 lg:translate-x-0'
                : 'opacity-0 translate-y-10 lg:translate-x-10',
            )}
          >
            {/* Main Decorative Card */}
            <div className="relative w-full z-10 p-7 rounded-[3rem] dark:bg-baro-black/20 border border-baro-ivory-dark/30 dark:border-baro-black shadow-md backdrop-blur-sm group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-baro-blue/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

              {/* Floating Items Container */}
              <div className="space-y-6 relative z-20">
                {/* Visual Item 1 */}
                <div className="p-5 rounded-2xl shadow-md dark:bg-baro-black-muted/10 border border-baro-ivory-dark dark:border-baro-black flex items-center gap-4 transform transition-transform hover:-translate-y-2 relative z-10">
                  <div className="w-12 h-12 bg-baro-blue/10 rounded-xl flex items-center justify-center text-baro-blue font-black text-[10px] uppercase">
                    OCR
                  </div>
                  <div>
                    <p className="text-[10px] text-baro-blue tracking-tighter uppercase mb-0.5">
                      Recognition
                    </p>
                    <p className="text-sm font-bold leading-none">거래명세서 15개 품목 인식</p>
                  </div>
                </div>

                {/* Visual Item 2 */}
                <div className="bg-baro-green p-5 rounded-2xl shadow-md border border-baro-green-dark dark:bg-baro-green-dark flex items-center gap-4 transform translate-x-8 lg:translate-x-16 transition-transform hover:-translate-y-3 relative z-30">
                  <div className="w-12 h-12  rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={24} strokeWidth={3} />
                  </div>
                  <div className="text-white">
                    <p className="text-[10px] font-black text-white/70 tracking-tighter uppercase mb-0.5">
                      Prediction
                    </p>
                    <p className="text-sm font-bold leading-none">내일 우유 20팩 발주 추천</p>
                  </div>
                </div>

                {/* Visual Item 3 */}
                <div className="p-5 rounded-2xl dark:bg-baro-black-muted/10 shadow-md border border-baro-ivory-dark dark:border-baro-black flex items-center gap-4 transform transition-transform hover:-translate-y-2 relative z-10">
                  <div className="w-12 h-12 bg-baro-blue/10 rounded-xl flex items-center justify-center text-baro-blue">
                    <ClipboardCheck size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-baro-black-muted tracking-tighter uppercase mb-0.5">
                      Closing
                    </p>
                    <p className="text-sm font-bold leading-none">오늘 마감 완료, 재고 자동 차감</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
