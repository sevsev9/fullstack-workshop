import { useRouter } from "next/router";
import { LOGIN_PAGE } from "@/utils/pages";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function JoinLobbyButton({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { isAuthed } = useUserContext();

  const handleJoinClick = () => {
    router.push(isAuthed ? `/game/${gameId}` : LOGIN_PAGE);
  };

  return <Button onClick={handleJoinClick}>Join lobby</Button>;
}
