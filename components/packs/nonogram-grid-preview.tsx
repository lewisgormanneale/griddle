const NonogramGridPreview = ({
  rows,
  columns,
  solution,
  showSolution = false,
}: {
  rows: number;
  columns: number;
  solution?: string | null;
  showSolution?: boolean;
}) => {
  const maxGridSize = 96;
  const cellSize = Math.min(20, maxGridSize / Math.max(rows, columns));

  const grid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));

  return (
    <div
      className="justify-center"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        maxWidth: `${maxGridSize}px`,
        maxHeight: `${maxGridSize}px`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="grid-cell"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              border: '1px solid #ccc',
              backgroundColor:
                showSolution && solution?.[rowIndex * columns + colIndex] === '1'
                  ? 'var(--mantine-color-dark-6)'
                  : '#f9f9f9',
            }}
          />
        ))
      )}
    </div>
  );
};

export default NonogramGridPreview;
