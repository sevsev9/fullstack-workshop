import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthService from "@/hooks/useAuthService";

function useLoginForm() {
  const { login } = useAuthService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return "";
    }

    setLoading(true);
    login({ email, password }).finally(() => setLoading(false));
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}

export default function LoginForm() {
  const { email, setEmail, password, setPassword, loading, handleSubmit } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        Login
      </Button>
    </form>
  );
}
