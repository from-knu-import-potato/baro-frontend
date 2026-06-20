import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

type MessageItem = {
  text: string;
  delay: number;
  hasTyping: boolean;
};

const leftMessages: MessageItem[] = [
  {
    text: '거래명세서 받을 때마다 손으로 다시 옮겨 적느라 너무 오래 걸려요.',
    delay: 0,
    hasTyping: true,
  },
  {
    text: '발주량 감이 안 와요.',
    delay: 500,
    hasTyping: false,
  },
  {
    text: '마감하고 재고 차감 계산하느라 매일 밤 30분씩 잡아먹혀요.',
    delay: 900,
    hasTyping: true,
  },
];

const rightMessages: MessageItem[] = [
  {
    text: '직원한테 "이거 재고 얼마 남았어?" 물어보면 아무도 몰라요.',
    delay: 200,
    hasTyping: true,
  },
  {
    text: '오늘 식재료 얼마나 썼는지 모르겠어요.',
    delay: 700,
    hasTyping: false,
  },
  {
    text: '재고가 바닥난 걸 손님 앞에서 알았어요.',
    delay: 1100,
    hasTyping: true,
  },
];

const TypingDots = () => (
  <div className="inline-flex items-center gap-1 px-4 py-3">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
        style={{ animationDelay: `${d}ms`, animationDuration: '1.2s' }}
      />
    ))}
  </div>
);

const ChatBubble = ({
  msg,
  side,
  isVisible,
}: {
  msg: MessageItem;
  side: 'left' | 'right';
  isVisible: boolean;
}) => {
  const isLeft = side === 'left';
  const translate = isLeft ? 'opacity-0 -translate-x-6' : 'opacity-0 translate-x-6';
  const visible = 'opacity-100 translate-x-0';

  return (
    <div className={cn('flex flex-col gap-1.5', isLeft ? 'items-start' : 'items-end')}>
      {msg.hasTyping && (
        <div
          className={cn(
            'transition-[opacity,transform] duration-500 bg-baro-blue rounded-2xl',
            isLeft ? 'rounded-bl-sm' : 'rounded-br-sm',
            isVisible ? visible : translate,
          )}
          style={{ transitionDelay: isVisible ? `${msg.delay}ms` : '0ms' }}
        >
          <TypingDots />
        </div>
      )}
      <div
        className={cn(
          'transition-[opacity,transform] duration-500 bg-baro-blue text-white px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed max-w-[260px] lg:max-w-[300px]',
          isLeft ? 'rounded-tl-sm text-left' : 'rounded-tr-sm text-right',
          isVisible ? visible : translate,
        )}
        style={{
          transitionDelay: isVisible ? `${msg.delay + (msg.hasTyping ? 200 : 0)}ms` : '0ms',
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="problem" ref={ref} className="py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            'text-center mb-20 transition-[opacity,transform] duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <p className="text-baro-blue text-xs font-bold uppercase tracking-[0.2em] mb-4">
            왜 만들었나요
          </p>
          <h3 className="text-2xl lg:text-3xl font-black text-baro-black dark:text-white leading-tight">
            사장님들의 하루는
            <br />
            <span className="text-baro-blue">이런 불편함</span>의 연속이었습니다
          </h3>
        </div>

        {/* Chat UI */}
        <div className="grid grid-cols-2 gap-4 lg:gap-12 mb-24 max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            {leftMessages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} side="left" isVisible={isVisible} />
            ))}
          </div>
          <div className="flex flex-col gap-4 mt-10">
            {rightMessages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} side="right" isVisible={isVisible} />
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div
          className={cn(
            'flex flex-col items-center transition-[opacity,transform] duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
          style={{ transitionDelay: isVisible ? '1400ms' : '0ms' }}
        >
          <div className="w-12 h-0.5 bg-baro-blue/40 mb-15" />
          <h3 className="text-2xl lg:text-3xl font-black text-baro-black dark:text-white mb-5 text-center">
            그래서 BARO가 탄생했습니다
          </h3>
          <p className="text-baro-black-muted dark:text-neutral-400 max-w-xl text-base leading-loose text-center">
            거래명세서 수기 입력, 실시간 재고 파악 실패, 발주량 감 부재, 손계산 마감—
            <br />
            매일 반복되는 이 비효율을 없애기 위해 BARO를 만들었습니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
