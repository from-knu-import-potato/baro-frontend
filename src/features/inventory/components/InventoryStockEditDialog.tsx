import { useState } from 'react';

import { CalendarDays, Pencil, X } from 'lucide-react';

import { useUpdateIngredient } from '@/features/store-settings/hooks/useIngredients';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';

interface EditableItem {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  inboundDate: string;
  expiryDate?: string;
}

interface InventoryStockEditDialogProps {
  open: boolean;
  onClose: () => void;
  item: EditableItem | null;
}

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}

const DatePicker = ({ id, value, onChange, optional }: DatePickerProps) => {
  return (
    <div className="relative flex items-center">
      <Popover>
        <PopoverTrigger
          id={id}
          className={cn(
            'h-9 w-full flex items-center gap-1.5 px-3 rounded-md border border-input bg-background text-sm transition-colors hover:bg-muted/50',
            value ? 'text-foreground' : 'text-muted-foreground/50',
          )}
        >
          <span className="flex-1 text-left truncate">{value || '날짜 선택'}</span>
          <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value + 'T00:00:00') : undefined}
            onSelect={(date) => onChange(date ? date.toLocaleDateString('sv') : '')}
          />
        </PopoverContent>
      </Popover>
      {optional && value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-8 z-20 p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

interface DialogFormProps {
  item: EditableItem;
  onClose: () => void;
}

const DialogForm = ({ item, onClose }: DialogFormProps) => {
  const [stock, setStock] = useState(String(item.currentStock));
  const [inboundDate, setInboundDate] = useState(item.inboundDate ?? '');
  const [expiryDate, setExpiryDate] = useState(item.expiryDate ?? '');
  const { mutate: updateIngredient, isPending } = useUpdateIngredient();

  const handleSave = () => {
    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) return;

    updateIngredient(
      {
        id: item.id,
        data: {
          currentStock: String(parsedStock),
          lastInboundDate: inboundDate || null,
          nearestExpiryDate: expiryDate || null,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">식자재명</Label>
          <p className="text-sm font-medium">{item.name}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stock-input" className="text-xs text-muted-foreground">
            현재 재고량
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="stock-input"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="h-9 text-sm"
              autoFocus
            />
            <span className="text-sm text-muted-foreground shrink-0">{item.unit}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inbound-date" className="text-xs text-muted-foreground">
            입고날짜
          </Label>
          <DatePicker id="inbound-date" value={inboundDate} onChange={setInboundDate} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiry-date" className="text-xs text-muted-foreground">
            유통기한 <span className="font-normal">(선택)</span>
          </Label>
          <DatePicker id="expiry-date" value={expiryDate} onChange={setExpiryDate} optional />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending || stock === ''}
          className="bg-baro-blue hover:bg-baro-blue/90 text-white"
        >
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </DialogFooter>
    </>
  );
};

const InventoryStockEditDialog = ({ open, onClose, item }: InventoryStockEditDialogProps) => (
  <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className="sm:max-w-xs">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Pencil className="size-4 text-muted-foreground" />
          재고 수정
        </DialogTitle>
      </DialogHeader>
      {item && <DialogForm key={item.id} item={item} onClose={onClose} />}
    </DialogContent>
  </Dialog>
);

export default InventoryStockEditDialog;
