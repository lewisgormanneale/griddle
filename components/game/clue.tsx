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
      <td className="border border-black"> {getClueNumbers(row).join(" ")}</td>
    );
  } else if (column) {
    return (
      <td className="border border-black">
        {getClueNumbers(column).map((num, index) => (
          <div key={index}>{num}</div>
        ))}
      </td>
    );
  } else {
    return null;
  }
}
