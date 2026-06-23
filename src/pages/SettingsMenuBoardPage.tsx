import { useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import {
  AlignJustify,
  ArrowLeft,
  ExternalLink,
  Grid2x2,
  ImagePlus,
  Loader2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import {
  DEFAULT_THEME,
  THEME_COLOR_GROUPS,
  type StoreThemeDto,
  uploadBannerImage,
} from '@/features/store-settings/api/storeTheme.api';
import { useStoreTheme, useUpdateStoreTheme } from '@/features/store-settings/hooks/useStoreTheme';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Skeleton } from '@/shadcn/ui/skeleton';

const SettingsMenuBoardPage = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  const { data: theme, isLoading } = useStoreTheme();
  const { mutate: updateTheme, isPending: isSaving } = useUpdateStoreTheme();

  const [form, setForm] = useState<StoreThemeDto>(DEFAULT_THEME);
  const [isUploading, setIsUploading] = useState(false);
  // 업로드 중 로컬 blob URL. form/theme와 분리되어 refetch에 영향받지 않음.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);
  const initializedRef = useRef(false);

  const updateFocalPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
    setForm((prev) => ({ ...prev, bannerPosition: `${x}% ${y}%` }));
  };

  // 최초 1회만 서버 데이터로 form 초기화. 이후 background refetch는 form에 영향 없음.
  useEffect(() => {
    if (theme && !initializedRef.current) {
      setForm(theme);
      initializedRef.current = true;
    }
  }, [theme]);

  // 미리보기 우선: 업로드 중엔 blob URL, 완료 후엔 form의 서버 URL
  const displayBannerUrl = previewUrl ?? form.bannerImageUrl;

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      await uploadBannerImage(storeId, file);
      // 응답 파싱 대신 서버에서 최신 theme를 직접 가져와 bannerImageUrl을 확정
      await qc.refetchQueries({ queryKey: ['store-theme', storeId] });
      const fresh = qc.getQueryData<StoreThemeDto>(['store-theme', storeId]);
      if (fresh?.bannerImageUrl) {
        setForm((prev) => ({ ...prev, bannerImageUrl: fresh.bannerImageUrl }));
      }
    } catch {
      // 실패 시 form은 그대로 유지 (axios interceptor가 토스트 처리)
    } finally {
      setPreviewUrl(null);
      URL.revokeObjectURL(localUrl);
      setIsUploading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const isDirty = theme
    ? form.themeColor !== theme.themeColor ||
      form.layout !== theme.layout ||
      form.bannerImageUrl !== theme.bannerImageUrl ||
      form.bannerPosition !== theme.bannerPosition
    : false;

  const focalX = parseInt((form.bannerPosition ?? '50% 50%').split(' ')[0] ?? '50', 10);
  const focalY = parseInt((form.bannerPosition ?? '50% 50%').split(' ')[1] ?? '50', 10);
  const selectedColor = THEME_COLOR_GROUPS.flatMap((g) => g.colors).find(
    (c) => c.key === form.themeColor,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex flex-wrap items-center gap-3 border-b px-4 py-3 bg-background md:px-6 md:py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">메뉴판 설정</p>
          <p className="text-xs text-muted-foreground">
            손님 메뉴판의 테마 색상, 레이아웃, 배너를 설정합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {storeId && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => window.open(`/order/${storeId}/table/1`, '_blank')}
            >
              <ExternalLink className="size-3.5" />
              미리보기
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => updateTheme(form)}
            disabled={!isDirty || isSaving || isLoading}
            className="bg-baro-blue text-white hover:bg-baro-blue/80"
          >
            {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : '저장'}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="overflow-hidden rounded-xl border bg-card">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-9 w-44 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ) : (
            <div className="divide-y">
              {/* 테마 색상 */}
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">테마 색상</p>
                  {selectedColor && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <span className="text-xs text-muted-foreground">{selectedColor.label}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {THEME_COLOR_GROUPS.map((group) => (
                    <div key={group.label} className="flex items-center gap-3">
                      <span className="w-10 shrink-0 text-[11px] text-muted-foreground/70">
                        {group.label}
                      </span>
                      <div className="flex gap-2">
                        {group.colors.map((color) => (
                          <button
                            key={color.key}
                            type="button"
                            title={color.label}
                            onClick={() => setForm((p) => ({ ...p, themeColor: color.key }))}
                            className={cn(
                              'size-7 rounded-full transition-all hover:scale-105',
                              form.themeColor === color.key && 'scale-110',
                            )}
                            style={{
                              backgroundColor: color.hex,
                              ...(form.themeColor === color.key
                                ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${color.hex}` }
                                : {}),
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 레이아웃 */}
              <div className="px-4 py-3">
                <p className="mb-3 text-xs font-medium text-muted-foreground">레이아웃</p>
                <div className="inline-flex gap-0.5 rounded-lg bg-gray-100 p-1">
                  {(
                    [
                      { key: 'list', label: '리스트', icon: AlignJustify },
                      { key: 'grid', label: '그리드', icon: Grid2x2 },
                    ] as const
                  ).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, layout: key }))}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-5 py-2 text-sm transition-all',
                        form.layout === key
                          ? 'bg-white font-medium text-gray-900 shadow-sm'
                          : 'text-gray-400 hover:text-gray-600',
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 배너 이미지 */}
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    배너 이미지 <span className="font-normal">(선택 · 업로드 즉시 저장)</span>
                  </p>
                  {displayBannerUrl && !isUploading && (
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="text-xs text-baro-blue transition-colors hover:underline"
                    >
                      이미지 변경
                    </button>
                  )}
                </div>
                {displayBannerUrl ? (
                  <div className="space-y-1.5">
                    <div
                      className="relative cursor-crosshair select-none overflow-hidden rounded-xl border"
                      style={{ aspectRatio: '390 / 144', maxHeight: '9rem' }}
                      onMouseDown={(e) => {
                        isDraggingRef.current = true;
                        updateFocalPoint(e);
                      }}
                      onMouseMove={(e) => {
                        if (isDraggingRef.current) updateFocalPoint(e);
                      }}
                      onMouseUp={() => {
                        isDraggingRef.current = false;
                      }}
                      onMouseLeave={() => {
                        isDraggingRef.current = false;
                      }}
                    >
                      <img
                        src={displayBannerUrl ?? undefined}
                        alt="배너"
                        className="h-full w-full object-cover pointer-events-none"
                        style={{ objectPosition: form.bannerPosition ?? '50% 50%' }}
                        draggable={false}
                      />
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${focalX}%`,
                          top: `${focalY}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="size-5 rounded-full border-2 border-white bg-white/20 shadow-lg ring-1 ring-black/20" />
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 pointer-events-none">
                          <Loader2 className="size-5 animate-spin text-baro-blue" />
                        </div>
                      )}
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((p) => ({ ...p, bannerImageUrl: null }));
                          }}
                          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground/70">
                      클릭하거나 드래그해서 노출 영역을 조정하세요
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 transition-colors hover:border-baro-blue/40 hover:bg-baro-blue/5"
                  >
                    <ImagePlus className="size-5 text-gray-300" />
                    <span className="text-xs text-muted-foreground">배너 이미지 추가</span>
                  </button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenuBoardPage;
