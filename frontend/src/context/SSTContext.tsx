import { createContext, useContext, useState } from "react";
import { WSGame } from "../../../backend/src/types/ws.types";
import { Move } from "../../../backend/src/model/game.model";

type SSTContextType = {
  game?: WSGame;
  onCellClick: (cell: [number, number]) => void;
};

const SSTContext = createContext<SSTContextType>({
  onCellClick: () => {},
});

// TODO remove this later
const exampleGame: WSGame = {
  game_id: "1",
  player_x: {
    user_id: "0",
    username: "christian",
    points: 0,
  },
  player_o: {
    user_id: "1",
    username: "sevi",
    points: 0,
  },
  moves: [],
  curr: "x",
  active_field: 4,
};

export default function SSTProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [game, setGame] = useState(exampleGame);

  // this serves as an optimistic update
  const handleCellClick = (position: [number, number]) => {
    const newMove: Move = {
      player: "1",
      timestamp: "",
      position,
    };

    setGame((p) => ({
      ...p,
      active_field: position[1],
      moves: [...p.moves, newMove],
    }));
  };

  return (
    <SSTContext.Provider
      value={{
        game,
        onCellClick: handleCellClick,
      }}
    >
      {children}
    </SSTContext.Provider>
  );
}

export function useSSTContext() {
  const { game, onCellClick } = useContext(SSTContext);
  return { game, onCellClick };
}
