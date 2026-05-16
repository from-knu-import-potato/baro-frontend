import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import SetupProgressBar from '@/features/initial-setup/components/SetupProgressBar';
import StepBasicInfo from '@/features/initial-setup/components/steps/StepBasicInfo';
import StepKeyIngredients from '@/features/initial-setup/components/steps/StepKeyIngredients';
import StepMenuRegistration from '@/features/initial-setup/components/steps/StepMenuRegistration';
import StepNotifications from '@/features/initial-setup/components/steps/StepNotifications';
import StepOperatingHours from '@/features/initial-setup/components/steps/StepOperatingHours';
import StepRecipeInfo from '@/features/initial-setup/components/steps/StepRecipeInfo';
import { SETUP_STEPS } from '@/features/initial-setup/constants/initialSetup.constants';
import { DEFAULT_SETUP_DATA } from '@/features/initial-setup/data/initialSetup.mock';
import type {
  InitialSetupData,
  StoreBasicInfo,
} from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';

type BasicInfoErrors = Partial<Record<keyof StoreBasicInfo, string>>;

const InitialSetupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InitialSetupData>(DEFAULT_SETUP_DATA);
  const [basicInfoErrors, setBasicInfoErrors] = useState<BasicInfoErrors>({});

  const totalSteps = SETUP_STEPS.length;
  const currentStepConfig = SETUP_STEPS[currentStep - 1];

  const validateStep1 = (): boolean => {
    const errors: BasicInfoErrors = {};
    if (!formData.basicInfo.storeName.trim()) {
      errors.storeName = '가게 이름을 입력해주세요';
    }
    setBasicInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // TODO: API 연동 후 실제 저장 로직으로 교체
    navigate(routePaths.dashboard);
  };

  const handleSkip = () => {
    navigate(routePaths.dashboard);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            data={formData.basicInfo}
            onChange={(basicInfo) => setFormData({ ...formData, basicInfo })}
            errors={basicInfoErrors}
          />
        );
      case 2:
        return (
          <StepOperatingHours
            data={formData.operatingHours}
            onChange={(operatingHours) => setFormData({ ...formData, operatingHours })}
          />
        );
      case 3:
        return (
          <StepMenuRegistration
            data={formData.menuItems}
            onChange={(menuItems) => setFormData({ ...formData, menuItems })}
          />
        );
      case 4:
        return (
          <StepRecipeInfo
            menuItems={formData.menuItems}
            recipes={formData.recipes}
            onChange={(recipes) => setFormData({ ...formData, recipes })}
          />
        );
      case 5:
        return (
          <StepKeyIngredients
            data={formData.keyIngredients}
            onChange={(keyIngredients) => setFormData({ ...formData, keyIngredients })}
          />
        );
      case 6:
        return (
          <StepNotifications
            data={formData.notificationSettings}
            onChange={(notificationSettings) => setFormData({ ...formData, notificationSettings })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-background px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <img src={baroLogo} alt="BARO" className="h-7 w-auto" />
          <span className="text-sm font-semibold text-foreground">초기 설정</span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          건너뛰기
        </button>
      </header>

      {/* Main content */}
      <main className="flex flex-1 justify-center px-4 py-8">
        <div className="w-full max-w-xl space-y-6">
          {/* Progress bar */}
          <SetupProgressBar currentStep={currentStep} />

          {/* Step card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-baro-blue text-xs font-bold text-white">
                  {currentStep}
                </span>
                <CardTitle className="text-base">{currentStepConfig.title}</CardTitle>
              </div>
              <CardDescription className="mt-0.5">{currentStepConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-1 rounded-full"
            >
              <ChevronLeft className="size-4" />
              이전
            </Button>

            <span className="text-xs text-muted-foreground">
              {currentStep} / {totalSteps}
            </span>

            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="gap-1  rounded-full bg-baro-blue text-white hover:bg-baro-blue-dark"
            >
              {currentStep === totalSteps ? (
                '설정 완료'
              ) : (
                <>
                  다음
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InitialSetupForm;
