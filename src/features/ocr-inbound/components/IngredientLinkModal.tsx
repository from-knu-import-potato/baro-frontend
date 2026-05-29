import { useState } from 'react';

import { Link, Search } from 'lucide-react';

import type { ExistingIngredient } from '@/features/ocr-inbound/types/ocrInbound.types';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';

interface IngredientLinkModalProps {
  open: boolean;
  ocrName: string;
  ingredients: ExistingIngredient[];
  onClose: () => void;
  onConfirm: (ingredient: ExistingIngredient) => void;
}

const IngredientLinkModal = ({
  open,
  ocrName,
  ingredients,
  onClose,
  onConfirm,
}: IngredientLinkModalProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ExistingIngredient | null>(null);

  const filtered = ingredients.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setQuery('');
    setSelected(null);
  };

  const handleClose = () => {
    setQuery('');
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg! leading-none! flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-baro-blue/10 flex items-center justify-center shrink-0">
              <Link className="w-4 h-4 text-baro-blue" />
            </div>
            기존 식자재 연결
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">"{ocrName}"</span>과 연결할 식자재를
            선택해주세요
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="식자재명 검색"
              className="h-9 text-sm pl-8"
              autoFocus
            />
          </div>

          <div className="min-h-20 max-h-44 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">검색 결과가 없습니다</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {filtered.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => setSelected(ingredient)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all select-none cursor-pointer',
                      selected?.id === ingredient.id
                        ? 'border-baro-blue bg-baro-blue/10 text-baro-blue'
                        : 'text-foreground hover:border-baro-blue/60 hover:bg-baro-blue/5',
                    )}
                  >
                    {ingredient.name}
                    <span
                      className={cn(
                        'text-[10px]',
                        selected?.id === ingredient.id
                          ? 'text-baro-blue/70'
                          : 'text-muted-foreground',
                      )}
                    >
                      ({ingredient.unit})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white"
          >
            연결
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientLinkModal;
