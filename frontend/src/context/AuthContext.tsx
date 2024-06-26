import { createContext, useContext, useEffect, useState } from "react";
import * as userService from "@/services/user.service";
import type { User } from "../../../backend/src/model/user.model";
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
  }, []); /* eslint-disable-line */

  const me = async () => {
    const result = await userService.getProfile();
    return result.success ? result.data : undefined;
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
