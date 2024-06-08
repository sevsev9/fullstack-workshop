import HomeLayout from "@/layouts/HomeLayout";
import LobbyCard from "@/components/LobbyCard";
import { type WSLobby } from "../../../../backend/src/types/ws.types";
import { useRouter } from "next/router";

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

export default function Game() {
  const router = useRouter();
  const id = router.query.gameId as string;

  return <p>{id}</p>;
}

Game.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
