import { type WSLobby } from "../../../backend/src/types/ws.types";
import JoinLobbyButton from "@/components/JoinLobbyButton";

export default function LobbyCard({ lobby }: { lobby: WSLobby }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      {lobby.name}

      <JoinLobbyButton gameId={lobby.game_id} />
    </div>
  );
}
