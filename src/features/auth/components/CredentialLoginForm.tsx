import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { routePaths } from '@/app/routes/routePaths';
import { credentialLogin } from '@/features/auth/api/authApi';
import useAuthStore from '@/features/auth/store/authStore';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import axiosInstance from '@/shared/api/axiosInstance';

const schema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type FormValues = z.infer<typeof schema>;

const CredentialLoginForm = () => {
  const navigate = useNavigate();
  const { setTokens, setStoreId } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const { accessToken, refreshToken, isNewUser } = await credentialLogin(values);
      setTokens(accessToken, refreshToken);

      if (isNewUser) {
        navigate(routePaths.initialSetup, { replace: true });
        return;
      }

      axiosInstance
        .get('/users/me/store')
        .then((res) => {
          if (res.data.data?.storeId) {
            setStoreId(res.data.data.storeId);
          }
        })
        .catch(() => {})
        .finally(() => navigate(routePaths.systemStart, { replace: true }));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        toast.error('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        toast.error('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="login-username">아이디</Label>
        <Input
          id="login-username"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          aria-invalid={!!errors.username}
          className="h-11"
          {...register('username')}
        />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password">비밀번호</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
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

      <Button
        type="submit"
        className="h-11 w-full bg-baro-blue text-white hover:bg-baro-blue/90"
        disabled={isSubmitting}
      >
        <LogIn className="size-4" />
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
};

export default CredentialLoginForm;
