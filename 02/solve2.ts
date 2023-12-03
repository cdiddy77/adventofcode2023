import fs from "fs";

const lines: string[] = fs.readFileSync("02/input.txt", "utf8").split("\n");

type Pargame = { red: number; green: number; blue: number };
const ZERO_PARSET: Pargame = { red: 0, green: 0, blue: 0 };
type Parpair = [number, keyof Pargame];

function parsePair(pair: string[]): Parpair {
  const [number, color] = pair;
  return [parseInt(number), color as keyof Pargame];
}

let power = 0;
for (const line of lines.filter(Boolean)) {
  const [gameIdText, setsText] = line.split(":");
  const gameId = parseInt(gameIdText.substring(5));
  console.log(setsText);
  const sets = setsText
    .split(";")
    .map((set) => set.split(",").map((pair) => pair.split(" ").filter(Boolean)))
    .map(getPargame);
  const maxes = sets.reduce(maxPargame, ZERO_PARSET);
  console.log(maxes);
  power += powerPargame(maxes);
}

console.log(power);

function getPargame(game: string[][]): Pargame {
  const parset = { ...ZERO_PARSET };
  for (const pair of game) {
    const pp = parsePair(pair);
    parset[pp[1]] = pp[0];
  }
  return parset;
}

function maxPargame(p1: Pargame, p2: Pargame): Pargame {
  return {
    red: Math.max(p1.red, p2.red),
    green: Math.max(p1.green, p2.green),
    blue: Math.max(p1.blue, p2.blue),
  };
}

function powerPargame(p: Pargame): number {
  return p.red * p.green * p.blue;
}
