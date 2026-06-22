import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { routePaths } from '@/app/routes/routePaths';
import { register as registerApi } from '@/features/auth/api/authApi';
import useAuthStore from '@/features/auth/store/authStore';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

const schema = z.object({
  username: z
    .string()
    .min(3, '아이디는 3자 이상이어야 합니다.')
    .max(30, '아이디는 30자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어(_)만 사용 가능합니다.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
  inviteCode: z.string().min(1, '초대 코드를 입력해주세요.'),
});

type FormValues = z.infer<typeof schema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const { accessToken, refreshToken } = await registerApi(values);
      setTokens(accessToken, refreshToken);
      navigate(routePaths.myStores, { replace: true });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        toast.error('초대 코드가 올바르지 않습니다.');
      } else if (status === 409) {
        toast.error('이미 사용 중인 아이디입니다.');
      } else {
        toast.error('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="reg-username">
          아이디 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="reg-username"
          placeholder="영문, 숫자, _ 조합 3~30자"
          autoComplete="username"
          aria-invalid={!!errors.username}
          className="h-11"
          {...register('username')}
        />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password">
          비밀번호 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="최소 6자 이상"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className="h-11 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="reg-name">
            이름 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reg-name"
            placeholder="실명"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="h-11"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-invite-code">
            초대 코드 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reg-invite-code"
            placeholder="초대 코드"
            aria-invalid={!!errors.inviteCode}
            className="h-11"
            {...register('inviteCode')}
          />
          {errors.inviteCode && (
            <p className="text-xs text-destructive">{errors.inviteCode.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-baro-blue text-white hover:bg-baro-blue/90"
        disabled={isSubmitting}
      >
        <UserPlus className="size-4" />
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>
    </form>
  );
};

export default RegisterForm;
