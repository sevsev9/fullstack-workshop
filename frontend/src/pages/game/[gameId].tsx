import { useRouter } from "next/router";
import HomeLayout from "@/layouts/HomeLayout";
import SSTProvider from "@/context/SSTContext";
// components
import SuperTicTacToeGame from "@/components/SSTGame";

export default function Game() {
  const router = useRouter();
  const id = router.query.gameId as string;

  return <SuperTicTacToeGame />;
}

Game.getLayout = (page: React.ReactElement) => {
  return (
    <HomeLayout>
      <SSTProvider>{page}</SSTProvider>
    </HomeLayout>
  );
};
