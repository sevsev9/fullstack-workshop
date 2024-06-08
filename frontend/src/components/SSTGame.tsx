import TTTGrid from "@/components/TTTGrid";

const tttGrid = Array.from({ length: 9 }).map(() => "");
const stttGrid = Array.from({ length: 9 }).map(() => tttGrid);

export default function SuperTicTacToeGame() {
  return (
    <div className="w-[500px] grid grid-cols-3 gap-4">
      {stttGrid.map((tttGrid, i) => (
        <TTTGrid key={i} grid={tttGrid} gridIndex={i} />
      ))}
    </div>
  );
}
