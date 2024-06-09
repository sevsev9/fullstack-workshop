import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function useLoginForm() {
  const router = useRouter();
  const { login } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return "";
    }

    setLoading(true);

    login({ email, password })
      .then(() => {
        toast("You are logged in");
        router.push("/");
        // TODO
        // show sonner
      })
      .catch(() => {
        toast("Failed to login");
        // TODO
        // show sonner
      })
      .finally(() => {
        setLoading(false);
      });
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
    <form onSubmit={handleSubmit} className="space-y-2">
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

      <Button loading={loading}>Login</Button>
    </form>
  );
}
