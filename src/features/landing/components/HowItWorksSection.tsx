import { Package, QrCode, Bot, ClipboardCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

const timeline = [
  {
    time: '오전 9:00',
    icon: <Package size={20} />,
    title: '거래명세서가 도착했어요',
    description:
      '카메라로 한 번 찍으면 15개 품목이 재고에 자동 등록됩니다. 손으로 옮겨 적는 건 이제 그만.',
    color: 'bg-baro-green',
  },
  {
    time: '오후 12:30',
    icon: <QrCode size={20} />,
    title: '점심 주문이 쏟아져요',
    description:
      '손님이 QR을 스캔하면 주문이 실시간으로 들어옵니다. 사장님은 응대 대신 운영에만 집중하세요.',
    color: 'bg-baro-blue',
  },
  {
    time: '오후 5:00',
    icon: <Bot size={20} />,
    title: 'AI가 발주를 추천해요',
    description:
      '재고 데이터를 분석해 내일 필요한 품목과 적정 발주량을 알려줍니다. 이제 감으로 주문하지 않아도 돼요.',
    color: 'bg-baro-red',
  },
  {
    time: '오후 10:00',
    icon: <ClipboardCheck size={20} />,
    title: '마감, 1분이면 끝',
    description: '당일 판매 메뉴 기반으로 재고가 자동 차감됩니다. 30분짜리 손계산은 이제 없어요.',
    color: 'bg-baro-black dark:bg-neutral-600',
  },
];

const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" ref={ref} className="py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            'text-center mb-20 transition-[opacity,transform] duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <p className="text-baro-blue text-xs font-bold uppercase tracking-[0.2em] mb-4">
            사장님의 하루
          </p>
          <h2 className="text-2xl lg:text-3xl font-black text-baro-black dark:text-white">
            BARO와 함께하면
            <br />
            하루가 이렇게 달라져요
          </h2>
        </div>

        {/* Timeline */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl">
            {/* Vertical line */}
            <div className="absolute left-5.5 top-2 bottom-2 w-px bg-baro-black/10 dark:bg-white/10" />

            <div className="flex flex-col gap-10">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-6 transition-[opacity,transform] duration-700',
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
                  )}
                  style={{ transitionDelay: isVisible ? `${i * 180}ms` : '0ms' }}
                >
                  {/* Dot */}
                  <div className="shrink-0 z-10">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center text-white',
                        item.color,
                      )}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <span className="text-xs font-bold text-baro-black-muted dark:text-neutral-500 tracking-wider">
                      {item.time}
                    </span>
                    <h3 className="text-lg font-black text-baro-black dark:text-white mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-baro-black-muted dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
