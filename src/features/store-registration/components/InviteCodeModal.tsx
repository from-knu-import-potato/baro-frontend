import { useState } from 'react';

import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

interface InviteCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteCodeModal = ({ open, onOpenChange }: InviteCodeModalProps) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    navigate(routePaths.dashboard);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setCode('');
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-xl! mb-1! flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" />
            초대코드 입력
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            사장님께 받은 초대코드를 입력해 주세요. 코드가 맞으면 가게에 직원으로 등록됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="invite-code" className="text-sm font-medium">
            초대코드
          </Label>
          <Input
            id="invite-code"
            placeholder="초대코드를 입력하세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="uppercase h-11"
            maxLength={12}
          />
        </div>

        <DialogFooter className="gap-2 pt-2 bg-background">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1 h-9">
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={code.trim().length === 0}
            className="flex-1 bg-baro-blue text-white hover:bg-baro-blue/90 h-9"
          >
            입장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCodeModal;
