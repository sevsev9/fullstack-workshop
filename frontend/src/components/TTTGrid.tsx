import { CircleIcon, XIcon } from "lucide-react";
import { useSSTContext } from "@/context/SSTContext";
import clsx from "clsx";

export default function TTTGrid({
  grid,
  gridIndex,
}: {
  grid: string[];
  gridIndex: number;
}) {
  const { game } = useSSTContext();
  const isActive = game?.active_field === gridIndex;

  return (
    <div
      className={clsx(
        "grid grid-cols-3 gap-1 p-2 rounded-lg",
        isActive && "bg-indigo-200",
      )}
    >
      {grid.map((_, i) => (
        <TTTCell key={i} cellIndex={i} gridIndex={gridIndex} />
      ))}
    </div>
  );
}

function TTTCell({
  cellIndex,
  gridIndex,
}: {
  cellIndex: number;
  gridIndex: number;
}) {
  const { onCellClick, game } = useSSTContext();

  const isActive = game?.moves.find(
    ({ position: [x, y] }) => x === gridIndex && y === cellIndex,
  );

  return (
    <span
      onClick={() => onCellClick([gridIndex, cellIndex])}
      className="cursor-pointer border aspect-square rounded flex items-center justify-center border-black hover:bg-secondary"
    >
      {isActive && <TTTPlacementDisplay row={"x"} />}
    </span>
  );
}

function TTTPlacementDisplay({ row }: { row: string }) {
  if (!row) return null;
  return row === "x" ? (
    <XIcon className="size-10" />
  ) : (
    <CircleIcon className="size-8" />
  );
}
