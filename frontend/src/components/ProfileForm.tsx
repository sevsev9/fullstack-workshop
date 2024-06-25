import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import useUserService from "@/hooks/useUserService";

function useProfileForm() {
  const { user } = useUserContext();
  const { updateProfile } = useUserService();
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    updateProfile({
      email,
      username,
    }).then(() => setLoading(false));
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    loading,
    handleSubmit,
  };
}

export default function ProfileForm() {
  const { email, setEmail, loading, handleSubmit, username, setUsername } =
    useProfileForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Button className="w-full" loading={loading}>
        Update Profile
      </Button>
    </form>
  );
}
