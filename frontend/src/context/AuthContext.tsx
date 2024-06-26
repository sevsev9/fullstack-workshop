import { createContext, useContext, useEffect, useState } from "react";
import * as userService from "@/services/user.service";
import * as authService from "@/services/auth.service";
import { toast } from "sonner";
import type { User } from "../../../backend/src/model/user.model";
import type { LoginProps, RegisterProps } from "@/services/auth.service";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/utils/localstorage";
import { useRouter } from "next/router";
import { LOGIN_PAGE } from "@/utils/pages";

type AuthContextType = {
  user?: User;
  updateUserState: (user: Partial<User>) => void;
  setUser: (user?: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  updateUserState: () => {},
  setUser: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    me().then((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push(LOGIN_PAGE).then(() => setLoading(false));
      }
    });
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
      setLocalStorageItem(ACCESS_TOKEN_KEY, result.data.access_token);
      setLocalStorageItem(REFRESH_TOKEN_KEY, result.data.refresh_token);
    }
  };

  // can only be called if there is already a user in state
  const updateUserState = (updateProps: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...updateProps,
    });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUserContext() {
  const { user, setUser, updateUserState } = useContext(AuthContext);

  return {
    user: user!,
    setUser,
    isAuthed: !!user,
    updateUserState,
  };
}
