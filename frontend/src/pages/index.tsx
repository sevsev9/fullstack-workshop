import HomeLayout from "@/layouts/HomeLayout";
import LobbyCard from "@/components/LobbyCard";
import {
  LobbyCreateRequest,
  type WSLobby,
} from "../../../backend/src/types/ws.types";
import WsProvider, { useWsContext } from "@/context/WsContext";
import CreateLobbyButton from "@/components/CreateLobbyButton";

const lobbies: WSLobby[] = [
  {
    game_id: "1",
    name: "Game 1",
    created: new Date(),
    players: ["1"],
  },
  {
    game_id: "2",
    name: "Game 2",
    created: new Date(),
    players: ["1"],
  },
  {
    game_id: "3",
    name: "Game 3",
    created: new Date(),
    players: ["1"],
  },
];

export default function Home() {
  const { sendWsMessage } = useWsContext();

  const handleCreateLobby = (params: { name: string }) => {
    const createMessage: LobbyCreateRequest = {
      type: "lobby_create",
      payload: {
        user: "",
        lobbyName: params.name,
      },
    };

    console.log(createMessage);

    sendWsMessage(createMessage);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lobbies</h1>
      <CreateLobbyButton onSubmit={handleCreateLobby} />

      <section className="space-y-2">
        {lobbies.map((lobby) => (
          <LobbyCard key={lobby.game_id} lobby={lobby} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: React.ReactElement) => {
  return (
    <HomeLayout>
      <WsProvider>{page}</WsProvider>
    </HomeLayout>
  );
};
