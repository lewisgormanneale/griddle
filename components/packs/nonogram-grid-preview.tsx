const NonogramGridPreview = ({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) => {
  const maxGridSize = 200;
  const cellSize = Math.min(20, maxGridSize / Math.max(rows, columns));

  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ""),
  );

  return (
    <div
      className="justify-center"
      style={{
        display: "grid",
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
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
            }}
          />
        )),
      )}
    </div>
  );
};

export default NonogramGridPreview;
