import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute top-6 left-6 rounded-full hover:bg-muted p-2"
      onClick={onClick}
      aria-label="뒤로 가기"
    >
      <ArrowLeft className="size-4 text-baro-black" />
    </Button>
  );
};

export default BackButton;
