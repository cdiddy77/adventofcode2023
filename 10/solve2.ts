import fs from "fs";

const inputs = {
  test2: {
    filename: "10/testin2.txt",
    testPoints: [
      { row: 3, col: 14 },
      { row: 4, col: 7 },
      { row: 4, col: 8 },
      { row: 4, col: 9 },
      { row: 5, col: 7 },
      { row: 5, col: 8 },
      { row: 6, col: 6 },
      { row: 6, col: 14 },
    ],
  },
  test4: {
    filename: "10/testin4.txt",
    testPoints: [
      { row: 3, col: 14 },
      { row: 4, col: 10 },
      { row: 4, col: 11 },
      { row: 4, col: 12 },
      { row: 4, col: 13 },
      { row: 5, col: 11 },
      { row: 5, col: 12 },
      { row: 5, col: 13 },
      { row: 6, col: 13 },
      { row: 6, col: 14 },
    ],
  },
  input: { filename: "10/input.txt", testPoints: [] },
  input2: { filename: "10/input2.txt", testPoints: [] },
  input3: { filename: "10/input3.txt", testPoints: [] },
};
const test = inputs.input;
const lines: string[] = fs.readFileSync(test.filename, "utf8").split("\n");

const testPoints = test.testPoints;

const visualize = false;
const calcOutpoints = true;

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
  if (!isOnMap(point)) {
    return [];
  }
  return connections[pipeValue(point)];
}

function pipeValue(point: Point) {
  return lines[point.row][point.col] as Pipe;
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

// const loop = new Map<string, number>();
const loop = new Set<string>();

function countPerpCrossings(p: Point): Record<Dir, number> {
  let west = 0;
  for (let col = p.col - 1; col >= 0; col--) {
    const pos = { col, row: p.row };
    if (loop.has(key(pos)) && pipeValue(pos) !== "-") {
      west++;
    }
  }
  let east = 0;
  for (let col = p.col + 1; col < lines[0].length; col++) {
    const pos = { col, row: p.row };
    if (loop.has(key(pos)) && pipeValue(pos) !== "-") {
      east++;
    }
  }
  let north = 0;
  for (let row = p.row - 1; row >= 0; row--) {
    const pos = { col: p.col, row };
    if (loop.has(key(pos)) && pipeValue(pos) !== "|") {
      north++;
    }
  }
  let south = 0;
  for (let row = p.row + 1; row < lines.length; row++) {
    const pos = { col: p.col, row };
    if (loop.has(key(pos)) && pipeValue(pos) !== "|") {
      south++;
    }
  }
  return { E: east, W: west, N: north, S: south };
}

function countCrossings(p: Point): Record<Dir, number> {
  let west = 0;
  for (let col = p.col - 1; col >= 0; col--) {
    const pos = { col, row: p.row };
    if (loop.has(key(pos))) {
      west++;
    }
  }
  let east = 0;
  for (let col = p.col + 1; col < lines[0].length; col++) {
    const pos = { col, row: p.row };
    if (loop.has(key(pos))) {
      east++;
    }
  }
  let north = 0;
  for (let row = p.row - 1; row >= 0; row--) {
    const pos = { col: p.col, row };
    if (loop.has(key(pos))) {
      north++;
    }
  }
  let south = 0;
  for (let row = p.row + 1; row < lines.length; row++) {
    const pos = { col: p.col, row };
    if (loop.has(key(pos))) {
      south++;
    }
  }
  return { E: east, W: west, N: north, S: south };
}

const start = getStart();
const queue: { p: Point }[] = [{ p: start }];
while (queue.length) {
  const current = queue.shift()!;
  const currentKey = key(current.p);
  if (loop.has(currentKey)) {
    continue;
  }
  loop.add(currentKey);
  const neighbors = getNeighbours(current.p);
  queue.push(...neighbors.map((n) => ({ p: n })));
  // console.log("current", current, "neighbors", neighbors);
}

function getOutNeighbours(point: Point): Point[] {
  return [
    { col: point.col + 1, row: point.row },
    { col: point.col - 1, row: point.row },
    { col: point.col - 1, row: point.row + 1 },
    { col: point.col, row: point.row + 1 },
    { col: point.col + 1, row: point.row + 1 },
    { col: point.col - 1, row: point.row - 1 },
    { col: point.col, row: point.row - 1 },
    { col: point.col + 1, row: point.row - 1 },
  ].filter((p2) => isOnMap(p2) && !loop.has(key(p2)));
}

const outs = new Set<string>();
// start at the edges of the board and traverse all the neighbors that
// arent part of the loop, including diagonally adjacents
const outQueue: Point[] = [];

// const corners = [
//   { col: 0, row: 0 },
//   { col: 0, row: lines.length - 1 },
//   { col: lines[0].length - 1, row: 0 },
//   { col: lines[0].length - 1, row: lines.length - 1 },
const sides: Point[] = [];
for (let row = 0; row < lines.length; row++) {
  const left = { col: 0, row };
  const right = { col: lines[0].length - 1, row };
  if (!loop.has(key(left))) {
    sides.push(left);
  }
  if (!loop.has(key(right))) {
    sides.push(right);
  }
}
for (let col = 0; col < lines[0].length; col++) {
  const top = { col, row: 0 };
  const bottom = { col, row: lines.length - 1 };
  if (!loop.has(key(top))) {
    sides.push(top);
  }
  if (!loop.has(key(bottom))) {
    sides.push(bottom);
  }
}
if (calcOutpoints) {
  outQueue.push(...sides);
}
while (outQueue.length) {
  const current = outQueue.shift()!;
  const currentKey = key(current);
  if (outs.has(currentKey)) {
    continue;
  }
  outs.add(currentKey);
  const neighbors = getOutNeighbours(current);
  outQueue.push(...neighbors);
}

function startShapeConnections({ row, col }: Point): Dir[] {
  if (lines[row][col] !== "S") {
    throw new Error("Not a start point");
  }
  const connections: Dir[] = [];
  if (connectionsFrom({ row, col: col + 1 }).includes("W")) {
    connections.push("E");
  }
  if (connectionsFrom({ row, col: col - 1 }).includes("E")) {
    connections.push("W");
  }
  if (connectionsFrom({ row: row + 1, col }).includes("N")) {
    connections.push("S");
  }
  if (connectionsFrom({ row: row - 1, col }).includes("S")) {
    connections.push("N");
  }
  if (connections.length !== 2) {
    throw new Error("start point lacks two connections");
  }
  return connections;
}

function isInPoint(
  { row, col }: Point,
  diag = false
): {
  crossings: number;
  inPoint: boolean;
} {
  if (outs.has(key({ row, col }))) {
    return { crossings: 0, inPoint: false };
  }
  // get the string to the right of the point
  // ignore the parts of the string that arent
  // part of the loop
  let crossings = 0;
  let delta: Dir = "W";
  for (let c = col + 1; c < lines[0].length; c++) {
    const p = { row, col: c };
    const connections = connectionsFrom(p);
    if (!loop.has(key(p))) {
      delta = "W";
      continue;
    }
    if (pipeValue(p) === "|") {
      delta = "W";
      crossings++;
    } else if (connections.includes("S")) {
      if (delta === "N") {
        crossings++;
        delta = "W";
      } else if (delta === "S") {
        delta = "W";
      } else {
        delta = "S";
      }
    } else if (connections.includes("N")) {
      if (delta === "S") {
        crossings++;
        delta = "W";
      } else if (delta === "N") {
        delta = "W";
      } else {
        delta = "N";
      }
    }
    if (diag) {
      console.log("diag", p, pipeValue(p), crossings, delta);
    }
  }
  return { crossings, inPoint: crossings % 2 === 1 };
}

// now we traverse, finding nodes that arent in the loop, and count
// the number of times we pass through the loop on the way to the edge of the board
//
const inPoints: Point[] = [];
for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[0].length; col++) {
    const p = { row, col };
    if (loop.has(key(p))) {
      continue;
    }
    if (isInPoint(p).inPoint) {
      inPoints.push(p);
    }
  }
}

testPoints.forEach((p) => console.log(p, isInPoint(p, true)));
console.log(inPoints.length);
// console.log(lines.length, lines[0].length);

if (visualize) {
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      const p = { row, col };
      if (inPoints.some((tp) => key(tp) === key(p))) {
        const { crossings, inPoint } = isInPoint(p);
        // process.stdout.write(`${crossings}`);
        process.stdout.write("@");
      } else if (testPoints.some((tp) => key(tp) === key(p))) {
        process.stdout.write("*");
      } else if (loop.has(key(p))) {
        process.stdout.write(lines[p.row][p.col]);
      } else if (outs.has(key(p))) {
        process.stdout.write("o");
      } else {
        process.stdout.write(".");
      }
    }
    process.stdout.write("\n");
  }
}
console.log(inPoints.length);

// console.log(loop.keys());
// console.log(entries.reduce((max, [_, dist]) => Math.max(max, dist), 0));
