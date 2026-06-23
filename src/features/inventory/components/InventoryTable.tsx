import { useState } from 'react';

import {
  AlertTriangle,
  Archive,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  MinusCircle,
  Package2,
  Pencil,
  ScanLine,
  Search,
  Star,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import InventoryStockEditDialog from '@/features/inventory/components/InventoryStockEditDialog';
import type { InventoryItem, InventoryStatus } from '@/features/inventory/types/inventory.types';
import type { IngredientDto } from '@/features/store-settings/api/ingredients.api';
import {
  useIngredients,
  useArchivedIngredients,
  useToggleFavorite,
} from '@/features/store-settings/hooks/useIngredients';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Input } from '@/shadcn/ui/input';
import { Skeleton } from '@/shadcn/ui/skeleton';

/* ── API → UI 매퍼 ── */
function toInventoryItem(dto: IngredientDto): InventoryItem {
  const current = Number(dto.currentStock);
  const safety = Number(dto.safetyStock);

  let status: InventoryStatus;
  if (current <= 0) status = 'depleted';
  else if (safety === 0) status = 'normal';
  else {
    const ratio = current / safety;
    if (ratio < 0.5) status = 'critical';
    else if (ratio < 1.0) status = 'warning';
    else status = 'normal';
  }

  return {
    id: dto.id,
    name: dto.name,
    currentStock: current,
    unit: dto.unit,
    safetyStock: safety,
    safetyStockUnit: dto.unit,
    recipeCount: dto.relatedMenus?.length ?? 0,
    inboundDate: dto.lastInboundDate ? dto.lastInboundDate.slice(0, 10) : '',
    expiryDate: dto.nearestExpiryDate ?? undefined,
    isFavorite: dto.isFavorite ?? false,
    status,
  };
}

/* ── 상태 설정 ── */
const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; badgeClass: string; rowClass: string; icon: React.ReactNode }
> = {
  critical: {
    label: '재고 부족',
    badgeClass:
      'bg-red-50 text-red-400 border border-red-200/60 dark:bg-red-950/40 dark:border-red-800/40',
    rowClass: 'border-l-4 border-l-red-300',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  warning: {
    label: '주의',
    badgeClass: 'bg-baro-yellow/10 text-baro-yellow-text border border-baro-yellow/30',
    rowClass: 'border-l-4 border-l-baro-yellow/50',
    icon: <AlertTriangle className="w-3 h-3 text-baro-yellow-dark" />,
  },
  normal: {
    label: '정상',
    badgeClass:
      'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700',
    rowClass: 'border-l-4 border-l-transparent',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  depleted: {
    label: '소진',
    badgeClass:
      'bg-zinc-100 text-zinc-400 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700',
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
  if (diff < 0) return { text: '만료됨', chipClass: 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800' };
  if (diff === 0)
    return { text: 'D-Day', chipClass: 'bg-red-50 text-red-400 font-bold dark:bg-red-950/40' };
  if (diff <= 3)
    return {
      text: `D-${diff}`,
      chipClass: 'bg-red-50 text-red-400 font-semibold dark:bg-red-950/40',
    };
  if (diff <= 7) return { text: `D-${diff}`, chipClass: 'bg-baro-yellow/10 text-baro-yellow-text' };
  return { text: `D-${diff}`, chipClass: 'bg-slate-100 text-slate-400 dark:bg-slate-800' };
};

/* ── 그리드 레이아웃 ── */
// 컬럼: ☆ | 식자재명 | 현재 재고 | 안전 재고 | 입고날짜 | 유통기한 | 포함 레시피 | 상태 | 수정
const GRID = 'grid-cols-[32px_2fr_1.2fr_1.2fr_1.2fr_1.5fr_1fr_100px_36px]';

/* ── 행 컴포넌트 ── */
interface InventoryRowProps {
  item: InventoryItem;
  onToggleFavorite: (id: string, current: boolean) => void;
  onEdit: (item: InventoryItem) => void;
}

const InventoryRow = ({ item, onToggleFavorite, onEdit }: InventoryRowProps) => {
  const config = STATUS_CONFIG[item.status];
  const dday = getDday(item.expiryDate);

  return (
    <>
      {/* 데스크탑 행 */}
      <div
        className={cn(
          'hidden md:grid gap-4 px-5 py-4 hover:bg-muted/20 transition-colors items-center',
          GRID,
          config.rowClass,
        )}
      >
        <button
          onClick={() => onToggleFavorite(item.id, item.isFavorite)}
          className="flex items-center justify-center"
          aria-label={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          <Star
            className={cn(
              'w-4 h-4 transition-colors',
              item.isFavorite
                ? 'fill-baro-yellow text-baro-yellow'
                : 'text-muted-foreground/30 hover:text-baro-yellow',
            )}
          />
        </button>
        <div className="min-w-0">
          <span className="text-sm font-semibold truncate block">{item.name}</span>
        </div>
        <div className="flex items-baseline gap-1 whitespace-nowrap">
          <span className="text-sm font-semibold tabular-nums">
            {item.currentStock.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">{item.unit}</span>
        </div>
        <div className="flex items-baseline gap-1 whitespace-nowrap">
          <span className="text-sm tabular-nums text-muted-foreground">
            {item.safetyStock.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">{item.safetyStockUnit}</span>
        </div>
        <div>
          {item.inboundDate ? (
            <span className="text-sm text-foreground">{item.inboundDate}</span>
          ) : (
            <span className="text-sm text-muted-foreground/40">—</span>
          )}
        </div>
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
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.badgeClass}`}
          >
            {config.icon}
            {config.label}
          </span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-md text-muted-foreground/40 hover:text-baro-blue hover:bg-blue-50 transition-colors"
            aria-label="재고 수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 모바일 카드 */}
      <div
        className={cn('md:hidden px-4 py-3 hover:bg-muted/20 transition-colors', config.rowClass)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => onToggleFavorite(item.id, item.isFavorite)}
              aria-label={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              className="shrink-0"
            >
              <Star
                className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  item.isFavorite
                    ? 'fill-baro-yellow text-baro-yellow'
                    : 'text-muted-foreground/30',
                )}
              />
            </button>
            <span className="text-sm font-semibold truncate">{item.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${config.badgeClass}`}
            >
              {config.icon}
              {config.label}
            </span>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-muted-foreground/40 hover:text-baro-blue hover:bg-blue-50 transition-colors"
              aria-label="재고 수정"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">현재 재고</p>
            <p className="text-sm font-semibold">
              {item.currentStock.toLocaleString()} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">안전 재고</p>
            <p className="text-sm text-foreground">
              {item.safetyStock.toLocaleString()} {item.safetyStockUnit}
            </p>
          </div>
          {item.expiryDate && dday && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">유통기한</p>
              <p className="text-sm flex items-center gap-1.5">
                <span>{item.expiryDate}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${dday.chipClass}`}
                >
                  {dday.text}
                </span>
              </p>
            </div>
          )}
          {item.recipeCount > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">포함 레시피</p>
              <p className="text-sm flex items-center gap-1 text-foreground">
                <BookOpen className="w-3 h-3 shrink-0" />
                {item.recipeCount}개 메뉴
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ── 메인 컴포넌트 ── */
const InventoryTable = () => {
  const navigate = useNavigate();
  const { data: ingredientList = [], isLoading, isError } = useIngredients();
  const { data: archivedList = [] } = useArchivedIngredients();
  const toggleFavorite = useToggleFavorite();
  const items = ingredientList.map(toInventoryItem);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);

  const handleToggleFavorite = (id: string, current: boolean) => {
    toggleFavorite.mutate({ id, isFavorite: !current });
  };

  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const favoriteCount = items.filter((i) => i.isFavorite).length;

  const countByStatus = (status: InventoryStatus) =>
    items.filter((i) => i.status === status).length;

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesTab && matchesFavorites;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'default') return 0;

    const aVal =
      sortKey === 'expiryDate' ? (a.expiryDate ?? '9999-99-99') : a.inboundDate || '0000-00-00';
    const bVal =
      sortKey === 'expiryDate' ? (b.expiryDate ?? '9999-99-99') : b.inboundDate || '0000-00-00';

    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (isError) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          재고 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col flex-1 min-h-0 overflow-hidden gap-0 pb-0">
        {/* 카드 헤더 */}
        <CardHeader className="border-b pb-0 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package2 className="w-4 h-4 text-muted-foreground" />
              전체 재고
              <span className="text-xs font-normal text-muted-foreground">
                — 총 {items.length}개 품목
              </span>
            </CardTitle>
          </div>

          {/* 상태 필터 탭 + 액션 버튼 */}
          <div className="flex flex-wrap items-center gap-2 min-w-0 overflow-hidden">
            {/* 필터 탭 */}
            <div className="flex gap-1 flex-1 min-w-0">
              {FILTER_TABS.map((tab) => {
                const count =
                  tab.key === 'all' ? items.length : countByStatus(tab.key as InventoryStatus);
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
                            ? 'bg-red-50 text-red-400 dark:bg-red-950/40'
                            : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 액션 버튼 — 모바일: 2행 / 데스크탑: 1행 */}
            <div className="flex flex-col gap-2 w-full min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:w-auto">
              {/* 1행(모바일): 보관함 + 즐찾 + 정렬 — 좁은 화면에서 가로 스크롤 */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setArchivedOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-input text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">보관된 식자재</span>
                  {archivedList.length > 0 && (
                    <span className="ml-0.5 bg-muted text-muted-foreground rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold">
                      {archivedList.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowFavoritesOnly((prev) => !prev)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                    showFavoritesOnly
                      ? 'bg-baro-yellow/10 border-baro-yellow/50 text-baro-yellow-text'
                      : 'border-input text-muted-foreground hover:bg-muted/50',
                  )}
                >
                  <Star
                    className={cn(
                      'w-3.5 h-3.5',
                      showFavoritesOnly && 'fill-baro-yellow text-baro-yellow',
                    )}
                  />
                  <span className="hidden sm:inline">즐겨찾기만</span>
                  {favoriteCount > 0 && (
                    <span className="bg-baro-yellow text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] font-bold">
                      {favoriteCount}
                    </span>
                  )}
                </button>
                {/* 모바일: 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      'sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0',
                      sortKey !== 'default'
                        ? 'border-baro-blue/50 text-baro-blue bg-baro-blue/5'
                        : 'border-input text-muted-foreground hover:bg-muted/50',
                    )}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                    {sortKey !== 'default' && (
                      <span className="whitespace-nowrap">
                        {sortKey === 'expiryDate' ? '유통기한순' : '입고날짜순'}{' '}
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {(
                      [
                        { key: 'expiryDate', label: '유통기한순' },
                        { key: 'inboundDate', label: '입고날짜순' },
                      ] as const
                    ).map(({ key, label }) => (
                      <DropdownMenuItem
                        key={key}
                        onSelect={(e) => e.preventDefault()}
                        onClick={() => handleSortClick(key)}
                        className={cn(sortKey === key && 'text-baro-blue font-medium')}
                      >
                        {label}
                        {sortKey === key && (
                          <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* 데스크탑: 버튼 그룹 */}
                <div className="hidden sm:flex items-center gap-0.5 border rounded-md px-1.5 py-0.5">
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
                          'px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap',
                          isActive ? 'text-baro-blue' : 'text-muted-foreground hover:bg-muted/60',
                        )}
                      >
                        {label}
                        <span className={cn('ml-0.5', !isActive && 'invisible')}>
                          {sortDir === 'asc' ? '↑' : '↓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* 2행(모바일): 등록 + 검색 */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => navigate(routePaths.ocrInbound)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-baro-blue text-white hover:bg-baro-blue/90 transition-colors shrink-0"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  재고 등록하기
                </button>
                <div className="relative flex-1 min-w-0 sm:flex-none sm:w-52">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="식자재 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs placeholder:text-xs"
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
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 min-h-0 flex flex-col overflow-hidden">
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
            <span />
          </div>

          {/* 행 목록 */}
          {isLoading ? (
            <div className="divide-y flex-1 overflow-y-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className={`hidden md:grid ${GRID} gap-4 px-5 py-4 items-center`}>
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                  </div>
                  <div className="md:hidden px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length > 0 ? (
            <div className="divide-y flex-1 overflow-y-auto">
              {sorted.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={(i) => setEditingItem(i)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-16 text-center text-sm text-muted-foreground">
              {items.length === 0
                ? '등록된 재고가 없어요. OCR 입고처리로 재고를 등록해보세요.'
                : showFavoritesOnly && favoriteCount === 0
                  ? '즐겨찾기한 항목이 없어요.'
                  : '검색 결과가 없어요.'}
            </div>
          )}
        </CardContent>
      </Card>

      <InventoryStockEditDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
      />

      {/* 보관된 식자재 조회 모달 */}
      <Dialog open={archivedOpen} onOpenChange={setArchivedOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-muted-foreground" />
              보관된 식자재
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {archivedList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                보관된 식자재가 없습니다.
              </p>
            ) : (
              archivedList.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-2.5 bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-medium">{ing.name}</p>
                    <p className="text-xs text-muted-foreground">단위: {ing.unit}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Number(ing.currentStock).toLocaleString()} {ing.unit}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryTable;
