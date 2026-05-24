import { useState } from 'react';

import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  MinusCircle,
  Package2,
  Search,
  Star,
  X,
} from 'lucide-react';

import { MOCK_INVENTORY_ITEMS } from '@/features/inventory/data/inventory.mock';
import type { InventoryItem, InventoryStatus } from '@/features/inventory/types/inventory.types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';

/* ── 상태 설정 ── */
const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; badgeClass: string; rowClass: string; icon: React.ReactNode }
> = {
  critical: {
    label: '재고 부족',
    badgeClass: 'bg-red-50 text-red-400 border border-red-200/60',
    rowClass: 'border-l-4 border-l-red-300',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  warning: {
    label: '주의',
    badgeClass: 'bg-yellow-50 text-yellow-600/80 border border-yellow-200/60',
    rowClass: 'border-l-4 border-l-yellow-300',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  normal: {
    label: '정상',
    badgeClass: 'bg-slate-100 text-slate-400 border border-slate-200',
    rowClass: 'border-l-4 border-l-transparent',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  depleted: {
    label: '소진',
    badgeClass: 'bg-zinc-100 text-zinc-400 border border-zinc-200',
    rowClass: 'border-l-4 border-l-zinc-300',
    icon: <MinusCircle className="w-3 h-3" />,
  },
};

type FilterTab = InventoryStatus | 'all';
type SortKey = 'default' | 'expiryDate' | 'inboundDate';
type SortDir = 'asc' | 'desc';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'critical', label: '재고 부족' },
  { key: 'warning', label: '주의' },
  { key: 'normal', label: '정상' },
];

/* ── D-day 계산 ── */
const getDday = (expiryDate?: string) => {
  if (!expiryDate) return null;
  const diff = Math.ceil(
    (new Date(expiryDate).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return { text: '만료됨', chipClass: 'bg-zinc-100 text-zinc-400' };
  if (diff === 0) return { text: 'D-Day', chipClass: 'bg-red-50 text-red-400 font-bold' };
  if (diff <= 3) return { text: `D-${diff}`, chipClass: 'bg-red-50 text-red-400 font-semibold' };
  if (diff <= 7) return { text: `D-${diff}`, chipClass: 'bg-yellow-50 text-yellow-600/80' };
  return { text: `D-${diff}`, chipClass: 'bg-slate-100 text-slate-400' };
};

/* ── 그리드 레이아웃 ── */
// 컬럼: ☆ | 식자재명 | 현재 재고 | 안전 재고 | 입고날짜 | 유통기한 | 포함 레시피 | 상태
const GRID = 'grid-cols-[32px_2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_100px]';

/* ── 행 컴포넌트 ── */
interface InventoryRowProps {
  item: InventoryItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const InventoryRow = ({ item, isFavorite, onToggleFavorite }: InventoryRowProps) => {
  const config = STATUS_CONFIG[item.status];
  const dday = getDday(item.expiryDate);

  return (
    <div
      className={cn(
        'hidden md:grid gap-4 px-5 py-4 hover:bg-muted/20 transition-colors items-center',
        GRID,
        config.rowClass,
      )}
    >
      {/* 즐겨찾기 버튼 */}
      <button
        onClick={() => onToggleFavorite(item.id)}
        className="flex items-center justify-center"
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      >
        <Star
          className={cn(
            'w-4 h-4 transition-colors',
            isFavorite
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground/30 hover:text-yellow-400',
          )}
        />
      </button>

      {/* 식자재명 */}
      <div className="min-w-0">
        <span className="text-sm font-semibold truncate block">{item.name}</span>
      </div>

      {/* 현재 재고 */}
      <div className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="text-sm font-semibold tabular-nums">
          {item.currentStock.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">{item.unit}</span>
      </div>

      {/* 안전 재고 */}
      <div className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="text-sm tabular-nums text-muted-foreground">
          {item.safetyStock.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">{item.safetyStockUnit}</span>
      </div>

      {/* 입고날짜 */}
      <div>
        <span className="text-sm text-foreground">{item.inboundDate}</span>
      </div>

      {/* 유통기한 */}
      <div className="flex items-center gap-2">
        {item.expiryDate && dday ? (
          <>
            <span className="text-sm text-foreground">{item.expiryDate}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${dday.chipClass}`}
            >
              {dday.text}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground/40">—</span>
        )}
      </div>

      {/* 포함 레시피 */}
      <div>
        {item.recipeCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            {item.recipeCount}개 메뉴
          </span>
        ) : (
          <span className="text-sm text-muted-foreground/40">—</span>
        )}
      </div>

      {/* 상태 뱃지 */}
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.badgeClass}`}
        >
          {config.icon}
          {config.label}
        </span>
      </div>
    </div>
  );
};

/* ── 메인 컴포넌트 ── */
const InventoryTable = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const countByStatus = (status: InventoryStatus) =>
    MOCK_INVENTORY_ITEMS.filter((i) => i.status === status).length;

  const filtered = MOCK_INVENTORY_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesFavorites = !showFavoritesOnly || favorites.has(item.id);
    return matchesSearch && matchesTab && matchesFavorites;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'default') return 0;

    const aVal = sortKey === 'expiryDate' ? (a.expiryDate ?? '9999-99-99') : a.inboundDate;
    const bVal = sortKey === 'expiryDate' ? (b.expiryDate ?? '9999-99-99') : b.inboundDate;

    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <Card>
      {/* 카드 헤더 */}
      <CardHeader className="border-b pb-0">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package2 className="w-4 h-4 text-muted-foreground" />
            전체 재고
            <span className="text-xs font-normal text-muted-foreground">
              — 총 {MOCK_INVENTORY_ITEMS.length}개 품목
            </span>
          </CardTitle>

          <div className="flex items-center gap-2 ml-auto">
            {/* 즐겨찾기 필터 버튼 */}
            <button
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                showFavoritesOnly
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-600'
                  : 'border-input text-muted-foreground hover:bg-muted/50',
              )}
            >
              <Star
                className={cn(
                  'w-3.5 h-3.5',
                  showFavoritesOnly && 'fill-yellow-400 text-yellow-400',
                )}
              />
              즐겨찾기만
              {showFavoritesOnly && favorites.size > 0 && (
                <span className="ml-0.5 bg-yellow-400 text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold">
                  {favorites.size}
                </span>
              )}
            </button>

            {/* 정렬 버튼 */}
            <div className="flex items-center gap-0.5 border rounded-md px-1.5 py-0.5">
              <ArrowUpDown className="w-3 h-3 text-muted-foreground mr-0.5 shrink-0" />
              {(
                [
                  { key: 'expiryDate', label: '유통기한순' },
                  { key: 'inboundDate', label: '입고날짜순' },
                ] as const
              ).map(({ key, label }) => {
                const isActive = sortKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSortClick(key)}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-baro-blue text-white'
                        : 'text-muted-foreground hover:bg-muted/60',
                    )}
                  >
                    {label}
                    {isActive && <span className="ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                );
              })}
            </div>

            {/* 검색 */}
            <div className="relative w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="식자재 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 상태 필터 탭 */}
        <div className="flex gap-1">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? MOCK_INVENTORY_ITEMS.length
                : countByStatus(tab.key as InventoryStatus);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-t-md border-b-2 transition-colors',
                  isActive
                    ? 'border-b-baro-blue text-baro-blue-dark bg-blue-50/50 dark:bg-blue-950/20'
                    : 'border-b-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-baro-blue text-white'
                      : tab.key === 'critical' && count > 0
                        ? 'bg-red-50 text-red-400'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* 컬럼 헤더 */}
        <div
          className={`hidden md:grid ${GRID} gap-4 px-5 py-2.5 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide`}
        >
          <span />
          <span>식자재명</span>
          <span>현재 재고</span>
          <span>안전 재고</span>
          <span>입고날짜</span>
          <span>유통기한</span>
          <span>포함 레시피</span>
          <span className="text-center">상태</span>
        </div>

        {/* 행 목록 */}
        {sorted.length > 0 ? (
          <div className="divide-y">
            {sorted.map((item) => (
              <InventoryRow
                key={item.id}
                item={item}
                isFavorite={favorites.has(item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {showFavoritesOnly && favorites.size === 0
              ? '즐겨찾기한 항목이 없어요.'
              : '검색 결과가 없어요.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
