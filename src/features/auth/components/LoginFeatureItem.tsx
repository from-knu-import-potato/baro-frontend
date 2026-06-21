import { cn } from '@/lib/utils';
import { colorMap } from '@/shared/constants/ui.constants';
import type { BadgeColor } from '@/shared/types/ui.types';

interface LoginFeatureItemProps {
  badge: string;
  badgeColor: BadgeColor;
  label: string;
  description: string;
}

const LoginFeatureItem = ({ badge, badgeColor, label, description }: LoginFeatureItemProps) => {
  const { bg, text } = colorMap[badgeColor];

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl text-xs font-black',
            bg,
            text,
          )}
        >
          {badge}
        </div>

        <div>
          <p className={cn('text-xs font-bold uppercase tracking-wide', text)}>{label}</p>
          <p className="text-sm font-semibold">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginFeatureItem;
