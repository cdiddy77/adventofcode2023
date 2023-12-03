import fs from "fs";

const lines: string[] = fs.readFileSync("02/input.txt", "utf8").split("\n");

type Parset = { red: number; green: number; blue: number };
const ZERO_PARSET: Parset = { red: 0, green: 0, blue: 0 };
type Parpair = [number, keyof Parset];

function parsePair(pair: string[]): Parpair {
  const [number, color] = pair;
  return [parseInt(number), color as keyof Parset];
}

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;
let count = 0;
for (const line of lines.filter(Boolean)) {
  const [gameIdText, setsText] = line.split(":");
  const gameId = parseInt(gameIdText.substring(5));
  console.log(setsText);
  const sets = setsText
    .split(";")
    .map((set) =>
      set.split(",").map((pair) => pair.split(" ").filter(Boolean))
    );
  if (!sets.some(isInvalidSet)) {
    count += gameId;
  }
}
console.log(count);
function isInvalidSet(set: string[][]): boolean {
  const parset = { ...ZERO_PARSET };
  for (const pair of set) {
    const pp = parsePair(pair);
    parset[pp[1]] = pp[0];
  }
  console.log(set, parset);
  if (
    parset.red <= MAX_RED &&
    parset.green <= MAX_GREEN &&
    parset.blue <= MAX_BLUE
  ) {
    console.log("valid");
    return false;
  } else {
    console.log("invalid");
    return true;
  }
}
