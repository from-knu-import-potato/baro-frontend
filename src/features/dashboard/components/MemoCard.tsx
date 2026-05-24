import { useState } from 'react';

import { PenLine } from 'lucide-react';

const MemoCard = () => {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-yellow-100 rounded-sm shadow-md relative overflow-hidden">
      {/* 포스트잇 상단 헤더 */}
      <div className="shrink-0 bg-yellow-200 px-4 py-2.5 flex items-center gap-2 border-b border-yellow-300/60">
        <PenLine className="w-3.5 h-3.5 text-yellow-700" />
        <span className="text-xs font-semibold text-yellow-800 tracking-wide">메모</span>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pt-1 pb-8">
        <textarea
          className="
            flex-1 w-full resize-none bg-transparent
            text-sm leading-7 text-yellow-950
            placeholder:text-yellow-700/40
            focus:outline-none
            bg-[repeating-linear-gradient(transparent,transparent_calc(1.75rem-1px),#ca8a0428_calc(1.75rem-1px),#ca8a0428_1.75rem)]
          "
          placeholder={'오늘의 메모를 남겨보세요\n(예: 오후 2시 재고 실사)'}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      {/* 접힌 모서리 효과 */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-300/80 [clip-path:polygon(100%_0,100%_100%,0_100%)] shadow-inner" />
      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-32 border-b-32 border-l-transparent border-b-yellow-50/60 pointer-events-none" />
    </div>
  );
};

export default MemoCard;
