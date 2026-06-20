import FeatureCard from '@/features/landing/components/FeatureCard';
import { features } from '@/features/landing/constants/landing.constants.ui';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

const FeatureSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="features" className="py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center text-center mb-16 transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          )}
        >
          <h2 className="text-3xl lg:text-5xl mb-6">스마트한 가게 운영의 시작</h2>
          <p className="text-baro-black-muted max-w-2xl text-lg">
            매일 반복되는 지루한 재고 관리 업무, <br className="block sm:hidden" />
            이제 BARO에게 맡기고 장사에만 집중하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
