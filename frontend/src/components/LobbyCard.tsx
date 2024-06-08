import { Button } from "@/components/ui/button";
import { type WSLobby } from "../../../backend/src/types/ws.types";
import { useRouter } from "next/router";

export default function LobbyCard({ lobby }: { lobby: WSLobby }) {
  const router = useRouter();

  const handleJoinClick = () => {
    router.push(`/game/${lobby.game_id}`);
  };

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      {lobby.name}

      <Button onClick={handleJoinClick}>Join lobby</Button>
    </div>
  );
}
