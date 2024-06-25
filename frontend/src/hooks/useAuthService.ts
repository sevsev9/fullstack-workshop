import { toast } from "sonner";
import { useUserContext } from "@/context/AuthContext";
import * as authService from "@/services/auth.service";
import type { LoginProps, RegisterProps } from "@/services/auth.service";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils/localstorage";
import { useRouter } from "next/router";

export default function useAuthService() {
  const { setUser } = useUserContext();
  const router = useRouter();

  const login = async (credentials: LoginProps) => {
    const result = await authService.login(credentials);
    if (!result.success) {
      toast(result.message);
    } else {
      setUser(result.data.user);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refresh_token);
      router.push("/");
    }
  };

  const logout = async () => {
    const result = await authService.logout();
    if (!result.success) {
      toast(result.message);
    } else {
      setUser(undefined);
      router.push("/");
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  const register = async (params: RegisterProps) => {
    const result = await authService.register(params);
    if (!result.success) {
      toast(result.message);
    } else {
      router.push("/auth/login");
    }
  };

  return {
    login,
    logout,
    register,
  };
}
