import fs from "fs";

const lines: string[] = fs.readFileSync("11/input.txt", "utf8").split("\n");

const AGE = 1000000;

interface Point {
  col: number;
  row: number;
}
const galaxies: Point[] = [];
// const emptyRows: number[] = [];
const emptyCols: number[] = [];
// find coordinates of all galaxies
const colPos: number[] = [0];
for (let col = 0; col < lines[0].length; col++) {
  let hasGalaxy = false;
  for (let row = 0; row < lines.length; row++) {
    if (lines[row][col] == "#") {
      hasGalaxy = true;
    }
  }
  colPos.push(colPos[colPos.length - 1] + 1 + (hasGalaxy ? 0 : AGE - 1));
}

let emptyRowCount = 0;
for (let row = 0; row < lines.length; row++) {
  let hasGalaxy = false;
  for (let col = 0; col < lines[0].length; col++) {
    if (lines[row][col] == "#") {
      galaxies.push({ col: colPos[col], row: row + emptyRowCount });
      hasGalaxy = true;
    }
  }
  if (!hasGalaxy) {
    emptyRowCount += AGE - 1;
  }
}

console.log(emptyCols, lines.length, lines[0].length);

let total = 0;
for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    total += calcDistance(i, j);
  }
}

function calcDistance(i: number, j: number) {
  return (
    Math.abs(galaxies[i].col - galaxies[j].col) +
    Math.abs(galaxies[i].row - galaxies[j].row)
  );
}

console.log(colPos, galaxies);
console.log(total);
// console.log(calcDistance(0, 6));
// console.log(calcDistance(2, 5));
// console.log(calcDistance(7, 8));
