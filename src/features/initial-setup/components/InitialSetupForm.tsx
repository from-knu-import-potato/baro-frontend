import { useState, useEffect } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { fetchMe, submitInitialSetup } from '@/features/initial-setup/api/initialSetup.api';
import SetupProgressBar from '@/features/initial-setup/components/SetupProgressBar';
import StepBasicInfo from '@/features/initial-setup/components/steps/StepBasicInfo';
import StepIngredientsAndRecipes from '@/features/initial-setup/components/steps/StepIngredientsAndRecipes';
import StepMenuRegistration from '@/features/initial-setup/components/steps/StepMenuRegistration';
import StepOperatingHours from '@/features/initial-setup/components/steps/StepOperatingHours';
import { SETUP_STEPS } from '@/features/initial-setup/constants/initialSetup.constants';
import { DEFAULT_SETUP_DATA } from '@/features/initial-setup/data/initialSetup.mock';
import type {
  InitialSetupData,
  StoreBasicInfo,
} from '@/features/initial-setup/types/initialSetup.types';
import { fetchMenus, updateMenu, uploadMenuImage } from '@/features/store-settings/api/menus.api';
import { updateStoreSettings } from '@/features/store-settings/api/storeSettings.api';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import baroLogo from '@/shared/assets/images/baro-logo.png';

type BasicInfoErrors = Partial<Record<keyof StoreBasicInfo, string>>;

const InitialSetupForm = () => {
  const navigate = useNavigate();
  const setStoreId = useAuthStore((s) => s.setStoreId);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InitialSetupData>(DEFAULT_SETUP_DATA);
  const [basicInfoErrors, setBasicInfoErrors] = useState<BasicInfoErrors>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchMe()
      .then((user) => setUserName(user.name))
      .catch(() => {});
  }, []);

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

  const handleComplete = async () => {
    try {
      // imageFile은 JSON 직렬화 제외, blob URL은 서버에 보내지 않음
      const { storeId } = await submitInitialSetup({
        ...formData,
        menuItems: formData.menuItems.map(({ imageFile: _imageFile, imageUrl, ...rest }) => ({
          ...rest,
          imageUrl: imageUrl?.startsWith('blob:') ? undefined : imageUrl,
        })),
      });
      setStoreId(storeId);

      // /stores/setup은 safetyStockPct를 처리하지 않으므로 별도 PATCH로 저장
      if (formData.safetyStockPct > 0) {
        await updateStoreSettings(storeId, { safetyStockPct: formData.safetyStockPct });
      }

      const menusWithPendingImages = formData.menuItems.filter((m) => m.imageFile);
      if (menusWithPendingImages.length > 0) {
        const backendMenus = await fetchMenus(storeId);
        await Promise.all(
          menusWithPendingImages.map(async (localMenu) => {
            const backendMenu = backendMenus.find((m) => m.name === localMenu.name);
            if (!backendMenu || !localMenu.imageFile) return;
            const imageUrl = await uploadMenuImage(storeId, localMenu.imageFile);
            await updateMenu(storeId, backendMenu.id, { imageUrl });
          }),
        );
      }

      formData.menuItems.forEach((m) => {
        if (m.imageUrl?.startsWith('blob:')) URL.revokeObjectURL(m.imageUrl);
      });

      navigate(routePaths.dashboard);
    } catch {
      alert('초기 설정 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
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
            userName={userName}
            onChange={(basicInfo) => setFormData((prev) => ({ ...prev, basicInfo }))}
            errors={basicInfoErrors}
          />
        );
      case 2:
        return (
          <StepOperatingHours
            data={formData.operatingHours}
            onChange={(operatingHours) => setFormData((prev) => ({ ...prev, operatingHours }))}
          />
        );
      case 3:
        return (
          <StepMenuRegistration
            data={formData.menuItems}
            onChange={(menuItems) => setFormData((prev) => ({ ...prev, menuItems }))}
          />
        );
      case 4:
        return (
          <StepIngredientsAndRecipes
            menuItems={formData.menuItems}
            ingredients={formData.ingredients}
            recipes={formData.recipes}
            safetyStockPct={formData.safetyStockPct}
            onIngredientsChange={(ingredients) => setFormData((prev) => ({ ...prev, ingredients }))}
            onRecipesChange={(recipes) => setFormData((prev) => ({ ...prev, recipes }))}
            onSafetyStockPctChange={(safetyStockPct) =>
              setFormData((prev) => ({ ...prev, safetyStockPct }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-background px-6 py-3.5 dark:border-gray-800">
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
      <main className="flex flex-1 min-h-0 flex-col items-center overflow-hidden px-4 py-4">
        <div
          className={cn(
            'flex w-full flex-1 min-h-0 flex-col gap-4',
            currentStep === 4 ? 'max-w-3xl' : 'max-w-xl',
          )}
        >
          {/* Progress bar */}
          <div className="mb-4 w-full max-w-xl shrink-0 self-center">
            <SetupProgressBar currentStep={currentStep} />
          </div>

          {/* Step card */}
          <Card className="flex flex-1 min-h-0 flex-col shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-baro-blue text-xs font-bold text-white">
                  {currentStep}
                </span>
                <CardTitle className="text-base">{currentStepConfig.title}</CardTitle>
              </div>
              <CardDescription className="mt-0.5">{currentStepConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 min-h-0 flex-col p-4">
              <div className="flex flex-1 min-h-0 flex-col">{renderStep()}</div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex shrink-0 items-center justify-between mb-16 mt-2">
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
              className="gap-1 rounded-full bg-baro-blue text-white hover:bg-baro-blue-dark"
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
