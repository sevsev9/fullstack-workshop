import { CircleIcon, XIcon } from "lucide-react";
import { useSSTContext } from "@/context/SSTContext";

export default function TTTGrid({
  grid,
  gridIndex,
}: {
  grid: string[];
  gridIndex: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-1">
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
  const { onCellClick } = useSSTContext();

  return (
    <span
      onClick={() => onCellClick([gridIndex, cellIndex])}
      className="cursor-pointer border aspect-square rounded flex items-center justify-center border-black hover:bg-secondary"
    >
      <TTTPlacementDisplay row={""} />
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
