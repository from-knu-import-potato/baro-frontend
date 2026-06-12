import { useEffect, useRef, useState } from 'react';

import { PenLine } from 'lucide-react';

import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';

const DEBOUNCE_MS = 1000;

const MemoCard = () => {
  const { data } = useStoreSettings();
  const { mutate: updateStore } = useUpdateStoreSettings();

  const [memo, setMemo] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (data && !isInitialized.current) {
      setMemo(data.memo);
      isInitialized.current = true;
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMemo(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateStore({ memo: value });
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-yellow-100 dark:bg-zinc-800 rounded-sm shadow-md relative overflow-hidden">
      {/* 포스트잇 상단 헤더 */}
      <div className="shrink-0 bg-yellow-200 dark:bg-zinc-700 px-4 py-2.5 flex items-center gap-2 border-b border-yellow-300/60 dark:border-zinc-600">
        <PenLine className="w-3.5 h-3.5 text-yellow-700 dark:text-zinc-300" />
        <span className="text-xs font-semibold text-yellow-800 dark:text-zinc-300 tracking-wide">
          메모
        </span>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pt-1 pb-8">
        <textarea
          className="
            flex-1 w-full resize-none bg-transparent
            text-sm leading-7 text-yellow-950 dark:text-zinc-100
            placeholder:text-yellow-700/40 dark:placeholder:text-zinc-500
            focus:outline-none
            bg-[repeating-linear-gradient(transparent,transparent_calc(1.75rem-1px),#ca8a0428_calc(1.75rem-1px),#ca8a0428_1.75rem)]
            dark:bg-[repeating-linear-gradient(transparent,transparent_calc(1.75rem-1px),rgba(113,113,122,0.2)_calc(1.75rem-1px),rgba(113,113,122,0.2)_1.75rem)]
          "
          placeholder={'오늘의 메모를 남겨보세요\n(예: 오후 2시 재고 실사)'}
          value={memo}
          onChange={handleChange}
        />
      </div>

      {/* 접힌 모서리 효과 */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-300/80 dark:bg-zinc-600 [clip-path:polygon(100%_0,100%_100%,0_100%)] shadow-inner" />
      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-32 border-b-32 border-l-transparent border-b-yellow-50/60 dark:border-b-zinc-900 pointer-events-none" />
    </div>
  );
};

export default MemoCard;
