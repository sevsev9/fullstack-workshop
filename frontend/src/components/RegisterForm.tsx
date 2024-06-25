import { useRouter } from "next/router";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PAGE } from "@/utils/pages";
import useAuthService from "@/hooks/useAuthService";

function useRegisterForm() {
  const router = useRouter();
  const { register } = useAuthService();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !username.trim()) {
      return "";
    }

    setLoading(true);

    register({ username, email, password })
      .then((res) => {
        console.log(res);
        toast("Account created successfully, you can sign in now");
        router.push(LOGIN_PAGE);
        // TODO
        // show sonner
      })
      .catch(() => {
        toast("Failed to create account.");
        // TODO
        // show sonner
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}

export default function RegisterForm() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button className="w-full" loading={loading}>
        Create Account
      </Button>
    </form>
  );
}
