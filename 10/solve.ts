import fs from "fs";

const lines: string[] = fs.readFileSync("10/input3.txt", "utf8").split("\n");

if (lines.some((line) => line.length != lines[0].length)) {
  throw new Error("Lines are not all the same length");
}

interface Point {
  col: number;
  row: number;
}
function isOnMap(point: Point): boolean {
  return (
    point.col >= 0 &&
    point.col < lines[0].length &&
    point.row >= 0 &&
    point.row < lines.length
  );
}

type Dir = "N" | "E" | "S" | "W";

type Pipe = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

function converse(dir: Dir): Dir {
  switch (dir) {
    case "N":
      return "S";
    case "E":
      return "W";
    case "S":
      return "N";
    case "W":
      return "E";
  }
}
const connections: Record<Pipe, Dir[]> = {
  "|": ["N", "S"],
  "-": ["E", "W"],
  L: ["N", "E"],
  J: ["N", "W"],
  "7": ["S", "W"],
  F: ["S", "E"],
  ".": [],
  S: ["E", "N", "S", "W"],
};

function connectionsFrom(point: Point): Dir[] {
  return connections[lines[point.row][point.col] as Pipe];
}

function connects(a: Point, b: Point): boolean {
  if (!isOnMap(a) || !isOnMap(b)) {
    return false;
  }
  if (a.col == b.col) {
    if (a.row == b.row) {
      return false;
    } else if (a.row == b.row + 1) {
      return (
        connectionsFrom(a).includes("N") && connectionsFrom(b).includes("S")
      );
    } else if (a.row == b.row - 1) {
      return (
        connectionsFrom(a).includes("S") && connectionsFrom(b).includes("N")
      );
    } else {
      return false;
    }
  } else if (a.row == b.row) {
    if (a.col == b.col + 1) {
      return (
        connectionsFrom(a).includes("W") && connectionsFrom(b).includes("E")
      );
    } else if (a.col == b.col - 1) {
      return (
        connectionsFrom(a).includes("E") && connectionsFrom(b).includes("W")
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function getNeighbours(point: Point): Point[] {
  return [
    { col: point.col + 1, row: point.row },
    { col: point.col - 1, row: point.row },
    { col: point.col, row: point.row + 1 },
    { col: point.col, row: point.row - 1 },
  ].filter((p2) => connects(point, p2));
}

function getStart() {
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      if (lines[row][col] === "S") {
        return { col, row };
      }
    }
  }
  throw new Error("No start found");
}

function key(p: Point) {
  return `${p.row},${p.col}`;
}

const distances = new Map<string, number>();

const start = getStart();
const queue: { p: Point; dist: number }[] = [{ p: start, dist: 0 }];
while (queue.length) {
  const current = queue.shift()!;
  const currentKey = key(current.p);
  if (distances.has(currentKey)) {
    continue;
  }
  distances.set(currentKey, current.dist);
  const neighbors = getNeighbours(current.p);
  queue.push(...neighbors.map((n) => ({ p: n, dist: current.dist + 1 })));
  console.log("current", current, "neighbors", neighbors);
}

const entries = [...distances.entries()];
console.log(entries);
console.log(entries.reduce((max, [_, dist]) => Math.max(max, dist), 0));
console.log(lines.length, lines[0].length);
