import { createContext, useContext } from "react";
import type { Move } from "../../../backend/src/model/game.model";

type SSTContextType = {
  moves: Move[];
  onCellClick: (cell: [number, number]) => void;
};

const SSTContext = createContext<SSTContextType>({
  moves: [],
  onCellClick: () => {},
});

// TODO remove this later
const exampleMoves: Move[] = [
  {
    player: "1",
    timestamp: "",
    field_idx: [0, 0],
    cell_idx: [0, 0],
  },
];

export default function SSTProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleCellClick = (cell: [number, number]) => {
    alert(cell);
  };

  return (
    <SSTContext.Provider
      value={{
        moves: exampleMoves,
        onCellClick: handleCellClick,
      }}
    >
      {children}
    </SSTContext.Provider>
  );
}

export function useSSTContext() {
  const { moves, onCellClick } = useContext(SSTContext);
  return { moves, onCellClick };
}
