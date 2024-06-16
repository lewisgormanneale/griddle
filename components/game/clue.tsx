import { CellState } from "@/lib/types";

export function Clue({ row, column }: { row?: boolean[]; column?: boolean[] }) {
  const getClueNumbers = (line: boolean[]) => {
    const numbers = line.reduce((acc, cell) => {
      if (cell) {
        if (acc.length === 0) {
          return [1];
        }
        acc[acc.length - 1]++;
        return acc;
      }
      return acc.concat(0);
    }, [] as number[]);
    return numbers.filter((num) => num > 0);
  };

  if (row) {
    return (
      <td className="border border-black w-48">
        <div className="flex justify-end items-center w-full gap-2 px-2">
          {getClueNumbers(row).map((num, index) => (
            <div key={index}>{num}</div>
          ))}
        </div>
      </td>
    );
  } else if (column) {
    return (
      <td className="border border-black h-48">
        <div className="flex flex-col justify-end items-center h-full py-2">
          {getClueNumbers(column).map((num, index) => (
            <div key={index}>{num}</div>
          ))}
        </div>
      </td>
    );
  } else {
    return null;
  }
}
