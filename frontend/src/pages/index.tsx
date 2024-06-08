import HomeLayout from "@/layouts/HomeLayout";
import LobbyCard from "@/components/LobbyCard";
import { type WSLobby } from "../../../backend/src/types/ws.types";

const lobbies: WSLobby[] = [
  {
    game_id: "1",
    name: "Game 1",
    password: "1234",
    created: new Date(),
    players: ["1"],
  },
  {
    game_id: "2",
    name: "Game 2",
    password: "1234",
    created: new Date(),
    players: ["1"],
  },
  {
    game_id: "2",
    name: "Game 3",
    password: "4321",
    created: new Date(),
    players: ["1"],
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Lobbies</h1>

      <section className="space-y-2">
        {lobbies.map((lobby) => (
          <LobbyCard key={lobby.game_id} lobby={lobby} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
