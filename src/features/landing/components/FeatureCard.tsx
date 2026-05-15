import type { Feature } from '@/features/landing/types/landing.types.ui';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shadcn/ui/card';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

interface FeatureCardProps {
  feature: Feature;
  delay: number;
}

const FeatureCard = ({ feature, delay }: FeatureCardProps) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <Card
      ref={ref}
      className={cn(
        'border-baro-ivory-dark/50 shadow-sm hover:shadow-md transition-all duration-700 transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-col items-center pt-8 pb-4">
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
            feature.bgColor,
            feature.color,
          )}
        >
          {feature.icon}
        </div>
        <CardTitle className="text-xl font-bold text-center">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-8 px-6">
        <CardDescription className="text-baro-black-muted leading-relaxed">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
