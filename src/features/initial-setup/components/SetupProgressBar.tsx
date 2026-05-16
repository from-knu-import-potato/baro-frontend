import { Check } from 'lucide-react';

import { SETUP_STEPS } from '@/features/initial-setup/constants/initialSetup.constants';
import { cn } from '@/lib/utils';

interface SetupProgressBarProps {
  currentStep: number;
}

const SetupProgressBar = ({ currentStep }: SetupProgressBarProps) => {
  const totalSteps = SETUP_STEPS.length;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full px-1">
      <div className="relative flex items-start justify-between">
        {/* Background line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-baro-black-muted" />
        {/* Progress line */}
        <div
          className="absolute left-4 top-4 h-0.5 -translate-y-1/2 bg-baro-blue transition-all duration-500"
          style={{ width: `calc(${progressPercent / 100} * (100% - 2rem))` }}
        />

        {/* Step circles */}
        {SETUP_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300',
                  isCompleted
                    ? 'border-baro-blue bg-baro-blue text-white'
                    : isActive
                      ? 'border-baro-blue bg-background text-baro-blue'
                      : 'border-gray-200 dark:border-baro-black-muted bg-background text-gray-400 dark:text-baro-black-muted',
                )}
              >
                {isCompleted ? <Check className="size-3.5" strokeWidth={3} /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden text-center text-[10px] font-medium leading-tight sm:block',
                  isActive ? 'text-baro-blue' : isCompleted ? 'text-baro-blue/70' : 'text-gray-400',
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetupProgressBar;
