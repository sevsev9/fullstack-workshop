import { createContext, useContext, useEffect, useState } from "react";

type RegisterProps = Credentials & {
  username: string;
};

type Credentials = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: any;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: RegisterProps) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // update local storage
  // refresh token
  // auth token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (credentials: Credentials) => {
    const url = "http://localhost:8080/api/auth/login";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  };

  const register = async (props: RegisterProps) => {
    const url = "http://localhost:8080/api/auth/register";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
  };

  const logout = async () => {
    const url = "http://localhost:8080/api/auth/logout";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUserContext() {
  const { user, login, register, logout } = useContext(AuthContext);
  return {
    user,
    login,
    register,
    logout,
    isAuthed: false,
  };
}
