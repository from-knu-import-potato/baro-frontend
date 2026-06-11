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

  useEffect(() => {
    fetchMe()
      .then((user) => {
        setFormData((prev) => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, ownerName: user.name },
        }));
      })
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
            onIngredientsChange={(ingredients) => setFormData((prev) => ({ ...prev, ingredients }))}
            onRecipesChange={(recipes) => setFormData((prev) => ({ ...prev, recipes }))}
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
            <CardContent>{renderStep()}</CardContent>
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
