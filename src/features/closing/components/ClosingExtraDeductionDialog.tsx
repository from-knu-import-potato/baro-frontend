import { useState } from 'react';

import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { useIngredients } from '@/features/store-settings/hooks/useIngredients';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';

export interface ExtraDeductionRow {
  ingredientId: string;
  ingredientName: string;
  unit: 'g' | 'ml' | '개';
  amount: number;
  currentStock: number;
}

interface ClosingExtraDeductionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (row: ExtraDeductionRow) => void;
}

const ClosingExtraDeductionDialog = ({
  open,
  onClose,
  onAdd,
}: ClosingExtraDeductionDialogProps) => {
  const { data: ingredients = [] } = useIngredients();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');

  const active = ingredients.filter((i) => !i.isArchived);
  const filtered = active.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const selected = active.find((i) => i.id === selectedId);

  const handleClose = () => {
    setSearch('');
    setSelectedId('');
    setAmount('');
    setPopoverOpen(false);
    onClose();
  };

  const handleAdd = () => {
    if (!selected || !amount) return;
    const n = Number(amount);
    if (isNaN(n) || n <= 0) return;
    onAdd({
      ingredientId: selected.id,
      ingredientName: selected.name,
      unit: selected.unit,
      amount: n,
      currentStock: Number(selected.currentStock),
    });
    setSearch('');
    setSelectedId('');
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">추가 차감 등록</DialogTitle>
          <DialogDescription className="text-xs">
            폐기, 직원 식사 등 판매 외 사용된 식자재를 추가로 차감합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-1">
          {/* 식자재 선택 */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">
              식자재 <span className="text-baro-red">*</span>
            </Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-9 text-sm font-normal"
                >
                  {selected ? selected.name : '식자재 선택'}
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <div className="flex items-center border-b px-3 py-2 gap-2">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="식자재 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      검색 결과가 없습니다.
                    </p>
                  ) : (
                    filtered.map((i) => (
                      <button
                        key={i.id}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left',
                          i.id === selectedId && 'bg-muted',
                        )}
                        onClick={() => {
                          setSelectedId(i.id);
                          setSearch('');
                          setPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 text-baro-blue',
                            i.id === selectedId ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <span className="flex-1">{i.name}</span>
                        <span className="text-xs text-muted-foreground">{i.unit}</span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 수량 입력 */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">
              차감 수량 <span className="text-baro-red">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0.001}
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="h-9 text-sm"
              />
              <span className="text-sm text-muted-foreground w-6 shrink-0">
                {selected?.unit ?? ''}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-10" onClick={handleClose}>
              취소
            </Button>
            <Button
              type="button"
              disabled={!selected || !amount || Number(amount) <= 0}
              onClick={handleAdd}
              className="flex-1 h-10 bg-baro-blue hover:bg-baro-blue/90 text-white"
            >
              추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClosingExtraDeductionDialog;
