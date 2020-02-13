function countNeighbors(grid, x, y, rows, cols) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (x + i + rows) % rows;
      let col = (y + j + cols) % cols;
      sum += grid[row][col];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export { countNeighbors, arrayClone };
