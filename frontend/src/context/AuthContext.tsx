import { createContext, useContext, useEffect, useState } from "react";
import * as userService from "@/services/user.service";
import * as authService from "@/services/auth.service";
import { toast } from "sonner";
import type { User } from "../../../backend/src/model/user.model";
import type { LoginProps, RegisterProps } from "@/services/auth.service";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/utils/localstorage.constants";

type AuthContextType = {
  user?: User;
  setUser: (user?: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  setUser: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then((user) => setUser(user))
      .finally(() => setLoading(false));
  }, []);

  const me = async () => {
    const result = await userService.getProfile();
    return result.success ? result.data : undefined;
  };

  const login = async (credentials: LoginProps) => {
    const result = await authService.login(credentials);
    if (!result.success) {
      toast(result.message);
    } else {
      setUser(result.data.user);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refresh_token);
    }
  };

  const logout = async () => {
    const result = await authService.logout();
    if (!result.success) {
      toast(result.message);
    } else {
      setUser(undefined);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  const register = async (params: RegisterProps) => {
    const result = await authService.register(params);
    if (!result.success) {
      toast(result.message);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUserContext() {
  const { user, setUser } = useContext(AuthContext);

  return {
    user: user!,
    setUser,
    isAuthed: !!user,
  };
}
